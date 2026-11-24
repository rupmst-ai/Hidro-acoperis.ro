# hidro-acoperis.ro

Site static, copie în română a site-ului din Polonia (dachjetz.de/pl): aceleași pagini, aceleași reduceri
(seniori −25%, ofertă de iarnă −15% până la 30.11), paginile de ofertă în 3 pași (`/oferta-...`).

- Paginile se generează în `public/` cu `node src/build.mjs` (textele sunt în `src/build.mjs`).
  După orice modificare rulați comanda și faceți commit și la fișierele generate.
- `src/assets/app.js`: orașul din cuvântul cheie (`kw=`) sau din campanie (`region=bucuresti` / `region=cluj`),
  conversii Google Ads (contul nou, AW-18589674615), notificări Telegram prin `https://dachjetz.de/notify`.
- `src/assets/wycena.js`: formularul în 3 pași de pe paginile `/oferta-...`.

Publicare: Cloudflare Worker `hidro-acoperis-ro` (Workers Builds, legat de GitHub, branch `main`).
Orice push pe `main` se publică automat pe hidro-acoperis.ro și www.hidro-acoperis.ro.

## Acces doar din România
`worker/index.js` blochează vizitatorii din afara României (pagina „disponibil doar în România”).
Trec totuși: roboții Google (necesari pentru aprobarea anunțurilor) și proprietarul.
Proprietarul deschide o dată pe fiecare telefon/calculator: https://hidro-acoperis.ro/?acces=hidro-ro
