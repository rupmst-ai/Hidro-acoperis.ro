// Lasă pe site doar vizitatorii din România.
// Excepții: roboții Google (altfel Google Ads respinge anunțurile cu „destinație indisponibilă”)
// și proprietarul, după ce deschide o dată linkul cu ?acces=hidro-ro (cookie 1 an).
const ALLOWED = new Set(['RO']);
const BOTS = /(Googlebot|AdsBot-Google|Mediapartners-Google|Google-InspectionTool|GoogleOther|Storebot-Google|Google-Site-Verification|APIs-Google|FeedFetcher-Google|Google-Read-Aloud|Google-Adwords|Google Page Speed|Chrome-Lighthouse)/i;
const KEY = 'hidro-ro';
const COOKIE = 'ha_acces=1';

const BLOCKED = `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>HidroAcoperiș</title>
<style>body{margin:0;font:17px/1.5 system-ui,sans-serif;background:#0f1d2e;color:#fff;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px}a{color:#ff8a3d}</style></head>
<body><div><h1>HidroAcoperiș</h1><p>Site-ul este disponibil doar în România.<br>This website is only available in Romania.</p><p>Telefon: <a href="tel:+40742431066">0742 431 066</a></p></div></body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const country = request.cf && request.cf.country;
    const ua = request.headers.get('User-Agent') || '';
    const cookie = request.headers.get('Cookie') || '';
    const verifiedBot = request.cf && request.cf.verifiedBotCategory;

    // Proprietarul: deschide o dată https://hidro-acoperis.ro/?acces=hidro-ro
    if (url.searchParams.get('acces') === KEY) {
      url.searchParams.delete('acces');
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.pathname + (url.search || ''),
          'Set-Cookie': `${COOKIE}; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`,
          'Cache-Control': 'no-store'
        }
      });
    }

    const allowed = !country || ALLOWED.has(country) || BOTS.test(ua) || !!verifiedBot || cookie.includes(COOKIE);
    if (!allowed) {
      return new Response(BLOCKED, {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Vary': 'Cookie' }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
