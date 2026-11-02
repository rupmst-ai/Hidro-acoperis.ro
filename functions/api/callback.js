// Cloudflare Pages Function: POST /api/callback
// Primește cererea "Te sunăm noi" și o trimite pe email prin Resend.
//
// Variabile de mediu (Cloudflare Pages → Settings → Variables and Secrets):
//   RESEND_API_KEY        obligatoriu (secret)
//   TURNSTILE_SECRET_KEY  opțional (secret); dacă lipsește, verificarea Turnstile e sărită
//   LEAD_TO               opțional; implicit dachgmbh01@gmail.com
//   LEAD_FROM             opțional; implicit "HidroAcoperis <onboarding@resend.dev>"

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

  const name = clean(data.name, 80);
  const service = clean(data.service, 80);
  const judetKey = clean(data.judet, 10);
  const judet = ZONE[judetKey] || '';
  const page = clean(data.page, 120);
  const pageTitle = clean(data.pageTitle, 160);
  const gclid = clean(data.gclid, 200);
  const gbraid = clean(data.gbraid, 200);
  const wbraid = clean(data.wbraid, 200);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ts = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, clean(data.token, 2048), ip);
  // Dacă Turnstile pică, trimitem totuși emailul (marcat), ca să nu pierdem un client real.
  const suspect = ts === 'eșuat' || ts === 'lipsă token';

  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not_configured' }, 500);

  const id = crypto.randomUUID();
  const when = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
  const local = phone.replace(/^\+40/, '0');

  const rows = [
    ['Nume', name || '—'],
    ['Telefon', local],
    ['Lucrare', service || '—'],
    ['Județ', judet || '—'],
    ['Pagina', (pageTitle ? pageTitle + ' — ' : '') + (page || '/')],
    ['gclid', gclid || '—'],
    ['gbraid / wbraid', [gbraid, wbraid].filter(Boolean).join(' / ') || '—'],
    ['Data', when],
    ['Turnstile', ts],
    ['ID cerere', id]
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const htmlBody =
    `<h2 style="margin:0 0 12px">Cerere nouă: vă rugăm sunați clientul</h2>` +
    `<p style="font-size:22px;margin:0 0 16px"><a href="tel:${phone}">${esc(local)}</a></p>` +
    `<table cellpadding="6" style="border-collapse:collapse;font:15px Arial,sans-serif">` +
    rows.map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join('') +
    `</table>`;

  const subject = `${suspect ? '[posibil spam] ' : ''}Te sunăm noi: ${local}${service ? ' – ' + service : ''}${judet ? ' (' + judet + ')' : ''}`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_FROM || 'HidroAcoperis <onboarding@resend.dev>',
      to: [env.LEAD_TO || 'dachgmbh01@gmail.com'],
      subject,
      text,
      html: htmlBody
    })
  });

  if (!r.ok) return json({ ok: false, error: 'email' }, 502);
  return json({ ok: true, id });
}

export function onRequest() {
  return json({ ok: false, error: 'method' }, 405);
}
