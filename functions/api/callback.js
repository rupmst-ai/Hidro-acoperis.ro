// Cloudflare Pages Function: POST /api/callback
// Primește cererea "Te sunăm noi" și o trimite pe aceleași canale ca site-ul german:
//   1. Formspree  → email
//   2. Google Apps Script → notificare (WhatsApp / tabel)
//   3. Resend (opțional, doar dacă e setat RESEND_API_KEY) → email de rezervă
// Cererea e considerată reușită dacă a ajuns pe cel puțin un canal.
//
// Variabile de mediu opționale (Cloudflare Pages → Settings → Variables and Secrets):
//   FORMSPREE_URL, SHEET_URL   suprascriu adresele implicite de mai jos
//   TURNSTILE_SECRET_KEY       dacă lipsește, verificarea Turnstile e sărită
//   RESEND_API_KEY, LEAD_TO, LEAD_FROM   email de rezervă prin Resend

const FORMSPREE_URL = 'https://formspree.io/f/xvzbwbrj';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxKxU91jmxHQIyEyBzzcuQ7Q3zN1q9wsklPoltXMbpYjF6GybzK2o2ZqforBrD8gBLk/exec';
const SITE = 'https://hidro-acoperis.ro';
const ZONE = { mures: 'Mureș', cluj: 'Cluj', sibiu: 'Sibiu' };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function clean(v, max = 200) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function verifyTurnstile(secret, token, ip) {
  if (!secret) return 'neconfigurat';
  if (!token) return 'lipsă token';
  try {
    const form = new FormData();
    form.append('secret', secret);
    form.append('response', token);
    if (ip) form.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const j = await r.json();
    return j.success ? 'ok' : 'eșuat';
  } catch (e) {
    return 'eroare verificare';
  }
}

async function sendFormspree(url, lead) {
  const fd = new FormData();
  fd.append('_subject', lead.subject);
  fd.append('leistung', lead.service || 'Acoperiș (general)');
  fd.append('telefon', lead.local);
  fd.append('nume', lead.name || '—');
  fd.append('judet', lead.judet || '—');
  fd.append('quelle', 'RO hidro-acoperis.ro – Te sunăm noi');
  fd.append('pagina', lead.pageUrl);
  fd.append('gclid', lead.gclid);
  fd.append('turnstile', lead.ts);
  fd.append('id', lead.id);
  const r = await fetch(url, {
    method: 'POST',
    body: fd,
    headers: { Accept: 'application/json', Origin: SITE, Referer: lead.pageUrl }
  });
  return r.ok;
}

async function sendSheet(url, lead) {
  // Același format ca pe site-ul german, ca scriptul existent să-l înțeleagă.
  const d = {
    action: '☎ ' + lead.local + (lead.name ? ' | ' + lead.name : '') + ' | ' + (lead.service || 'Acoperiș') + ' | RO' + (lead.judet ? ' ' + lead.judet : ''),
    city: lead.judet || '',
    locPhys: '',
    locInt: '',
    campId: '',
    page: lead.page,
    campaign: '',
    keyword: '',
    gclid: lead.gclid,
    device: lead.device,
    referrer: 'hidro-acoperis.ro'
  };
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(d),
    redirect: 'follow'
  });
  // Apps Script răspunde cu redirect; scriptul a rulat deja dacă nu e eroare de server.
  return r.status < 500;
}

async function sendResend(env, lead) {
  const rows = [
    ['Nume', lead.name || '—'],
    ['Telefon', lead.local],
    ['Lucrare', lead.service || '—'],
    ['Județ', lead.judet || '—'],
    ['Pagina', lead.pageUrl],
    ['gclid', lead.gclid || '—'],
    ['Turnstile', lead.ts],
    ['ID cerere', lead.id]
  ];
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_FROM || 'HidroAcoperis <onboarding@resend.dev>',
      to: [env.LEAD_TO || 'dachgmbh01@gmail.com'],
      subject: lead.subject,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<p style="font-size:22px"><a href="tel:${lead.phone}">${esc(lead.local)}</a></p><table cellpadding="6">` +
        rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join('') + '</table>'
    })
  });
  return r.ok;
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: un bot a completat câmpul ascuns. Răspundem "ok" ca să nu afle, dar nu trimitem nimic.
  if (clean(data.website)) return json({ ok: true, id: 'x' });

  const phone = clean(data.phone, 20);
  if (!/^\+40[237]\d{8}$/.test(phone)) return json({ ok: false, error: 'phone' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ts = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, clean(data.token, 2048), ip);
  // Dacă Turnstile pică, trimitem totuși (marcat), ca să nu pierdem un client real.
  const suspect = ts === 'eșuat' || ts === 'lipsă token';

  const page = clean(data.page, 120) || '/';
  const lead = {
    id: crypto.randomUUID(),
    phone,
    local: phone.replace(/^\+40/, '0'),
    name: clean(data.name, 80),
    service: clean(data.service, 80),
    judet: ZONE[clean(data.judet, 10)] || '',
    page,
    pageUrl: SITE + page,
    gclid: clean(data.gclid, 200) || clean(data.gbraid, 200) || clean(data.wbraid, 200),
    device: /Mobi|Android|iPhone/i.test(request.headers.get('User-Agent') || '') ? 'telefon' : 'desktop',
    ts
  };
  lead.subject = `${suspect ? '[posibil spam] ' : ''}[RO] Te sunăm noi: ${lead.local}` +
    `${lead.service ? ' – ' + lead.service : ''}${lead.judet ? ' (' + lead.judet + ')' : ''}`;

  const jobs = [
    sendFormspree(env.FORMSPREE_URL || FORMSPREE_URL, lead),
    sendSheet(env.SHEET_URL || SHEET_URL, lead)
  ];
  if (env.RESEND_API_KEY) jobs.push(sendResend(env, lead));

  const results = await Promise.allSettled(jobs);
  const delivered = results.some(r => r.status === 'fulfilled' && r.value === true);
  if (!delivered) return json({ ok: false, error: 'delivery' }, 502);
  return json({ ok: true, id: lead.id });
}

export function onRequest() {
  return json({ ok: false, error: 'method' }, 405);
}
