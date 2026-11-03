# hidro-acoperis.ro

Site static (Cloudflare Pages), axat pe conversii din Google Ads.

- Paginile se generează în `public/` cu `node src/build.mjs` (textele sunt în `src/build.mjs`, stilurile în `src/*.css`).
  După orice modificare rulați comanda și faceți commit și la fișierele `index.html` generate.
- `public/assets/site.js`: conversii (apel, WhatsApp, formular), banner cookies, popup-uri, formular.
- `functions/api/callback.js`: trimite cererile „Te sunăm noi” pe aceleași canale ca site-ul german:
  Formspree (email) și Google Apps Script (notificare). Merge fără nicio setare.

Variabile de mediu opționale în Cloudflare Pages (Settings → Variables and Secrets):
`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` (email de rezervă), `FORMSPREE_URL`, `SHEET_URL`.
Cheia publică Turnstile se pune în `public/assets/site.js` (`TURNSTILE_SITEKEY`).

Publicare: Cloudflare Worker `hidro-acoperis-ro` (Workers Builds, legat de GitHub, branch `main`).
Orice push pe `main` se publică automat pe hidro-acoperis.ro și www.hidro-acoperis.ro.
`wrangler.jsonc` publică folderul `public/`.

## Acces doar din România
`worker/index.js` blochează vizitatorii din afara României (pagina „disponibil doar în România”).
Trec totuși: roboții Google (necesari pentru aprobarea anunțurilor) și proprietarul.
Proprietarul deschide o dată pe fiecare telefon/calculator: https://hidro-acoperis.ro/?acces=hidro-ro
