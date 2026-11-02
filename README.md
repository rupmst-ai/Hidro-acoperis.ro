# hidro-acoperis.ro

Site static (Cloudflare Pages), axat pe conversii din Google Ads.

- Paginile se generează cu `node src/build.mjs` (textele sunt în `src/build.mjs`, stilurile în `src/*.css`).
  După orice modificare rulați comanda și faceți commit și la fișierele `index.html` generate.
- `assets/site.js`: conversii (apel, WhatsApp, formular), banner cookies, popup-uri, formular.
- `functions/api/callback.js`: trimite cererile „Te sunăm noi” pe email prin Resend.

Variabile de mediu în Cloudflare Pages (Settings → Variables and Secrets):
`RESEND_API_KEY` (obligatoriu), `TURNSTILE_SECRET_KEY` (opțional).
Cheia publică Turnstile se pune în `assets/site.js` (`TURNSTILE_SITEKEY`).
