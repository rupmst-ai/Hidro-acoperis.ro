// Generează site-ul în public/ – copie în română a site-ului din Polonia (dachjetz.de/pl).
// Rulare: node src/build.mjs   (apoi commit și la fișierele generate din public/)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, '..', 'public');
const SITE = 'https://hidro-acoperis.ro';
const AW = 'AW-18589674615';
const V = '2'; // versiunea fișierelor din /assets/ – se mărește la fiecare schimbare
const TEL = '+40742431066';
const TEL_TXT = '0742 431 066';
const MAIL = 'dachjetz@mail.de';
const WA = 'https://wa.me/40742431066?text=' + encodeURIComponent('Bună ziua, aș dori o ofertă gratuită pentru acoperiș.');
const ZONA = 'București și împrejurimi (până la 50 km)';
const BRAND = 'HidroAcoperiș';
const LOGO = 'Hidro<em>Acoperiș</em>';
const DESERVIM = '<b>Deservim:</b> București (sectoarele 1–6), Voluntari, Otopeni, Pantelimon, Popești-Leordeni, Bragadiru, Chiajna, Buftea, Măgurele, Cluj-Napoca, Florești, Baciu, Apahida, Turda, Dej și împrejurimile, până la 50 km.';

const SYMBOLS = readFileSync(join(SRC, 'partials', 'symbols.html'), 'utf8').trim();
const HOUSE = readFileSync(join(SRC, 'partials', 'house.svg'), 'utf8').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '');

/* ---------- Meniu (ordinea din Polonia) ---------- */
const NAV = [
  ['/', 'Acasă'],
  ['/inlocuire-acoperis/', 'Acoperiș nou și înlocuire'],
  ['/sarpanta/', 'Șarpantă'],
  ['/hidroizolatii/', 'Acoperiș plat'],
  ['/montaj-tabla/', 'Țiglă metalică'],
  ['/izolatie-mansarda/', 'Izolație mansardă'],
  ['/structura-panouri-solare/', 'Structură panouri solare'],
  ['/reparatii-acoperis/', 'Reparații acoperiș'],
  ['/tinichigerie/', 'Tinichigerie'],
  ['/jgheaburi/', 'Jgheaburi'],
  ['/contact/', 'Contact']
];
const SERVICES = NAV.slice(1, -1);
const CONTACT = NAV[NAV.length - 1];
const OPTIONS = ['Acoperiș nou și înlocuire', 'Șarpantă', 'Acoperiș plat', 'Țiglă metalică', 'Izolație mansardă',
  'Structură panouri solare', 'Reparații acoperiș', 'Tinichigerie', 'Jgheaburi', 'Altele'];

const ico = (id) => `<svg class="ico"><use href="#i-${id}"/></svg>`;
const btnWa = (txt) => `<a class="btn btn-wa" href="${esc(WA)}" target="_blank" rel="noopener">${ico('wa')}${txt}</a>`;
const btnTel = (txt) => `<a class="btn btn-ghost" href="tel:${TEL}">${ico('tel')}${txt}</a>`;

function gtagHead() {
  return `<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{var c=JSON.parse(localStorage.getItem('ro_consent_v1'));if(c){var a=c.marketing?'granted':'denied';gtag('consent','update',{ad_storage:a,ad_user_data:a,ad_personalization:a,analytics_storage:c.analytics?'granted':'denied'});}}catch(e){}
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
gtag('js',new Date());gtag('config','${AW}');
</script>`;
}

function head(p) {
  const url = SITE + p.path;
  const ld = (p.ld || []).map((o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 1)}\n</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${p.noindex ? 'noindex' : 'index, follow'}">
<meta name="theme-color" content="#1a1f2e">
<meta property="og:type" content="website">
<meta property="og:locale" content="ro_RO">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/${p.img || 'hero-video-poster-v42.webp'}">
<link rel="icon" href="/img/logo.png" type="image/png">
${p.img ? `<link rel="preload" as="image" href="/img/${p.img}" fetchpriority="high">\n` : ''}<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="stylesheet" href="/assets/style.css?v=${V}">
${gtagHead()}
<script src="/assets/app.js?v=${V}" defer></script>
${ld}
</head>`;
}

function header(cur) {
  const links = NAV.map(([h, t]) => `      <a href="${h}"${h === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('\n');
  return `<header class="hd">
  <div class="wrap">
    <a href="/" class="logo" aria-label="${BRAND} – acasă"><img src="/img/logo.png" alt="" width="36" height="36"> <span>${LOGO}</span></a>
    <a href="tel:${TEL}" class="hd-call" aria-label="Sunați: ${TEL_TXT}">
      <b>${ico('tel')}${TEL_TXT}</b>
      <i>${ZONA}</i>
    </a>
    <button class="hbg" id="hbg" type="button" aria-label="Meniu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Meniu principal">
${links}
    </nav>
  </div>
</header>`;
}

function footer(stale = true) {
  const col = (arr) => arr.map(([h, t]) => `          <li><a href="${h}">${t}</a></li>`).join('\n');
  return `<footer class="ft">
  <div class="wrap">
    <div class="ft-grid">
      <div>
        <h3>${BRAND}</h3>
        <p>Meisterdach GmbH SRL<br>CUI RO51313339</p>
        <p style="margin-top:8px"><a href="mailto:${MAIL}">${MAIL}</a><br><a href="tel:${TEL}">${TEL_TXT}</a></p>
        <p style="margin-top:8px">Zonă de lucru: ${ZONA}</p>
${stale ? `        <p data-stale style="margin-top:8px">${DESERVIM}</p>\n` : ''}      </div>
      <div>
        <h3>Servicii</h3>
        <ul>
${col(SERVICES.slice(0, 5))}
        </ul>
      </div>
      <div>
        <h3>&nbsp;</h3>
        <ul>
${col([...SERVICES.slice(5), CONTACT])}
        </ul>
      </div>
    </div>
    <div class="ft-bot">
      <span>© 2026 Meisterdach GmbH SRL</span>
      <span><a href="/confidentialitate/">Politica de confidențialitate</a> · <a href="#" data-cookies>Setări cookies</a></span>
    </div>
  </div>
</footer>

<div class="mbar">
  <a class="btn btn-wa" href="${esc(WA)}" target="_blank" rel="noopener">${ico('wa')}WhatsApp</a>
  <a class="btn btn-or" href="tel:${TEL}">${ico('tel')}Sunați</a>
</div>

</body>
</html>
`;
}

const OFFER24 = `<p class="offer24"><b>Venim rapid la fața locului</b> · ofertă gratuită în 24 h<br><b>Sunați sau scrieți zilnic 8:00–21:00</b></p>`;
const TICKS = `<ul class="ticks">
      <li>Standarde germane</li>
      <li>Garanție scrisă</li>
      <li>Ofertă gratuită</li>
    </ul>`;

function formSection(selected) {
  const opts = OPTIONS.map((o) => `          <option${o === selected ? ' selected' : ''}>${o}</option>`).join('\n');
  return `<section class="sec form-sec" id="oferta">
  <div class="wrap form-grid">
    <div class="side">
      <h2 class="h2">Ofertă gratuită pentru acoperiș</h2>
      <p>Lăsați numărul de telefon – vă sunăm înapoi și stabilim o vizită la fața locului. Preferați să vorbiți direct? Scrieți-ne pe WhatsApp sau sunați.</p>
      <div class="btns">
        ${btnWa('WhatsApp')}
        ${btnTel('Sunați')}
      </div>
    </div>
    <form class="form-box js-lead" action="https://formspree.io/f/xvzbwbrj" method="POST" novalidate>
      <h2>Cereți o ofertă</h2>
      <p class="sub">Răspundem repede. Oferta este gratuită și fără obligații.</p>
      <div class="fld"><label for="f-nume">Nume</label><input id="f-nume" name="nume" type="text" autocomplete="given-name" required></div>
      <div class="fld"><label for="f-tel">Telefon</label><input id="f-tel" name="telefon" type="tel" inputmode="tel" autocomplete="tel" placeholder="ex. 0722 123 456" required></div>
      <div class="fld"><label for="f-loc">Localitate</label><input id="f-loc" name="localitate" type="text" autocomplete="address-level2" placeholder="ex. București" required></div>
      <div class="fld"><label for="f-tip">Tip lucrare</label>
        <select id="f-tip" name="tip_lucrare" required>
          <option value="">Alegeți…</option>
${opts}
        </select>
      </div>
      <div class="photo-note">📷 <span>Aveți poze cu acoperișul? <a href="${esc(WA)}" target="_blank" rel="noopener">Trimiteți-le pe WhatsApp</a> – oferta vine mai repede.</span></div>
      <div class="hp" aria-hidden="true"><label>Nu completați <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
      <label class="chk"><input type="checkbox" name="acord" value="da" required> <span>Vă rog să mă contactați pentru ofertă. Am citit <a href="/confidentialitate/">politica de confidențialitate</a>.</span></label>
      <div class="form-err" role="alert"></div>
      <button class="btn btn-or" type="submit">Trimite cererea</button>
    </form>
  </div>
</section>`;
}

function faqHtml(faq) {
  return `<section class="sec sec-w">
  <div class="wrap">
    <h2 class="h2">Întrebări frecvente</h2>
    <div class="faq">
${faq.map(([q, a], i) => `      <details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
    </div>
  </div>
</section>`;
}

function cta(h2, lead, waTxt = 'Ofertă gratuită pe WhatsApp') {
  return `<section class="sec sec-dk cta">
  <div class="wrap">
    <h2 class="h2">${h2}</h2>
    <p class="lead" style="margin-left:auto;margin-right:auto">${lead}</p>
    <div class="btns">
      ${btnWa(waTxt)}
      ${btnTel(TEL_TXT)}
    </div>
  </div>
</section>`;
}

const PROVIDER = { '@type': 'RoofingContractor', name: BRAND, telephone: TEL, url: SITE + '/', email: MAIL };
const AREA = { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 44.4268, longitude: 26.1025 }, geoRadius: '50000' };
const crumbsLd = (name, path) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name, item: SITE + path }
  ]
});
const faqLd = (faq) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } }))
});

/* ---------- Secțiuni comune paginilor de servicii ---------- */
const WHY_SERVICE = `<section class="sec sec-dk">
  <div class="wrap">
    <h2 class="h2">De ce ${BRAND}?</h2>
    <div class="why">
      <div class="why-i"><span class="why-ic">${ico('flag')}</span><div><h3>Echipă locală cu experiență în Germania</h3><p>Suntem aproape, iar ani de zile am lucrat la acoperișuri pe exigenta piață germană.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('check')}</span><div><h3>Standarde germane de execuție</h3><p>Precizie, ordine și lucru după regulile meseriei.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('doc')}</span><div><h3>Garanție scrisă</h3><p>Pentru lucrările executate primiți garanție în scris.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('eye')}</span><div><h3>Ofertă gratuită</h3><p>Evaluare la fața locului și ofertă fără costuri și fără obligații.</p></div></div>
    </div>
  </div>
</section>`;

const STEPS_SERVICE = `<section class="sec">
  <div class="wrap">
    <h2 class="h2">Cum lucrăm</h2>
    <div class="steps">
      <div class="step"><h3>Contact</h3><p>Scrieți-ne pe WhatsApp, sunați sau lăsați numărul în formular. Puteți trimite direct poze.</p></div>
      <div class="step"><h3>Evaluare</h3><p>Stabilim o vizită gratuită la fața locului în București sau în împrejurimi.</p></div>
      <div class="step"><h3>Ofertă</h3><p>Primiți oferta cu descrierea lucrărilor și a materialelor.</p></div>
      <div class="step"><h3>Execuție</h3><p>Executăm lucrarea la termenul stabilit și vă dăm garanția în scris.</p></div>
    </div>
  </div>
</section>`;

function servicePage(p) {
  const name = NAV.find(([h]) => h === p.path)[1];
  const others = SERVICES.filter(([h]) => h !== p.path).slice(0, 8);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Service', name: p.service, serviceType: p.service, description: p.desc, url: SITE + p.path, provider: PROVIDER, areaServed: AREA },
    crumbsLd(name, p.path),
    faqLd(p.faq)
  ];
  return `${head({ ...p, ld })}
<body data-page="${p.path.replace(/\//g, '')}">

${SYMBOLS}

${header(p.path)}

<main>
<section class="hero">
  <img class="hero-img" src="/img/${p.img}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" fetchpriority="high" decoding="async">
  <div class="hero-txt">
    <nav class="crumb" aria-label="Navigare"><a href="/">Acasă</a> › ${name}</nav>
    <span class="zone">${ico('pin')}${ZONA}</span>
    <h1>${p.h1}</h1>
    ${OFFER24}
    <p class="hero-sub">${p.sub}</p>
    ${TICKS}
    <div class="btns">
      ${btnWa('Ofertă gratuită pe WhatsApp')}
      ${btnTel(TEL_TXT)}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <h2 class="h2">${p.service} – ce include serviciul</h2>
${p.leads.map((l) => `    <p class="lead">${l}</p>`).join('\n')}
    <ul class="scope">
${p.scope.map((s) => `      <li>${s}</li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="sec sec-w">
  <div class="wrap">
    <h2 class="h2">La ce suntem atenți</h2>
    <p class="lead">Detaliile care decid dacă acoperișul rezistă ani de zile.</p>
    <div class="qual">
${p.qual.map(([h, t]) => `      <div class="q"><h3>${h}</h3><p>${t}</p></div>`).join('\n')}
    </div>
  </div>
</section>

${WHY_SERVICE}

${STEPS_SERVICE}

${formSection(p.option)}

${faqHtml(p.faq)}

<section class="sec">
  <div class="wrap">
    <h2 class="h2">Alte servicii</h2>
    <div class="rel">
${others.map(([h, t]) => `      <a href="${h}">${t} →</a>`).join('\n')}
    </div>
  </div>
</section>

${cta('Cereți o ofertă gratuită', 'Scrieți sau sunați – stabilim o vizită gratuită la fața locului în București și împrejurimi.')}

</main>

${footer()}`;
}

/* ---------- Paginile de servicii (traducerea paginilor din Polonia) ---------- */
const PAGES = [
  {
    path: '/inlocuire-acoperis/', service: 'Acoperiș nou și înlocuire', option: 'Acoperiș nou și înlocuire',
    title: 'Acoperiș nou și înlocuire acoperiș București și împrejurimi | HidroAcoperiș',
    desc: 'Acoperișuri noi și înlocuire acoperiș în București și împrejurimi (până la 50 km): șarpantă, membrană, învelitoare, tinichigerie și jgheaburi. Demontarea celui vechi inclusă. Garanție scrisă, ofertă gratuită.',
    img: 'hero-dachziegel.webp', w: 800, h: 500, alt: 'Înlocuirea țiglelor vechi cu o învelitoare nouă',
    h1: 'Acoperiș nou și înlocuire acoperiș în București și împrejurimi',
    sub: 'Construim acoperișuri noi și le înlocuim pe cele vechi – de la șarpantă la jgheaburi, pe case, garaje, blocuri și hale. Garanție scrisă, ofertă gratuită.',
    leads: [
      'Un acoperiș nou este o investiție pentru zeci de ani. De aceea fiecare etapă o facem așa cum am învățat în Germania: atent, după indicațiile producătorilor și fără scurtături. Ne ocupăm de tot acoperișul, deci nu trebuie să coordonați mai multe echipe.',
      'Acoperișul vechi curge, învelitoarea se sfărâmă sau pur și simplu i-a venit vremea? Înlocuirea e o ocazie bună să refaceți și ce nu se vede zilnic: membrana, șipcile, izolația și tinichigeria. Înainte de lucru verificăm structura și scriem în ofertă exact ce înlocuim.',
      'Învelitoare nouă – țiglă metalică, tablă fălțuită, țiglă ceramică, membrană bituminoasă. Demontarea învelitorii vechi și transportul molozului sunt incluse în preț.'
    ],
    scope: ['Demontarea învelitorii vechi și transportul deșeurilor', 'Execuția, verificarea sau înlocuirea șarpantei', 'Membrană, contrașipci și șipci noi',
      'Învelitoare: țiglă ceramică, țiglă metalică, tablă fălțuită sau membrană bituminoasă', 'Tinichigerie la coșuri, pereți și ferestre de mansardă', 'Montaj ferestre de mansardă și trape de acces',
      'Jgheaburi și burlane', 'Izolație între căpriori – la cerere', 'Protejarea acoperișului de ploaie pe durata lucrării'],
    qual: [['Protecție la vreme rea', 'Descoperim doar atât cât putem proteja în aceeași zi.'],
      ['Structură verificată', 'Înainte de învelitoarea nouă verificăm șarpanta și reparăm ce e nevoie.'],
      ['Detalii etanșe', 'Coșurile, ferestrele de mansardă și doliile sunt locurile unde apar cel mai des infiltrațiile – aici lucrăm cel mai atent.'],
      ['Ordine pe șantier', 'Învelitoarea veche o ducem noi, iar în jurul casei lăsăm curat.']],
    faq: [['Ne ajutați să alegem tipul de învelitoare?', 'Da. La evaluarea la fața locului vă spunem ce învelitoare se potrivește cel mai bine clădirii – în funcție de panta acoperișului, structură și ce vă doriți.'],
      ['Cât durează lucrarea?', 'Depinde de mărimea și complexitatea acoperișului. Termenul exact îl stabilim la ofertă, înainte să începem lucrul.'],
      ['Se poate locui în casă în timpul înlocuirii acoperișului?', 'Da. Lucrăm pe etape și protejăm acoperișul pe parcurs, deci de obicei nu trebuie să vă mutați.'],
      ['La înlocuirea acoperișului trebuie schimbată și șarpanta?', 'Nu întotdeauna. Întâi verificăm starea lemnului – înlocuim doar elementele deteriorate, iar restul îl consolidăm dacă e nevoie.'],
      ['Se poate izola acoperișul cu ocazia asta?', 'Da, înlocuirea învelitorii este cel mai bun moment pentru izolația între căpriori sau pentru îmbunătățirea celei existente.']]
  },
  {
    path: '/sarpanta/', service: 'Șarpantă', option: 'Șarpantă',
    title: 'Șarpantă București și împrejurimi – execuție, consolidare, înlocuire | HidroAcoperiș',
    desc: 'Șarpante în București și împrejurimi (până la 50 km): șarpante noi, consolidarea și înlocuirea căpriorilor deteriorați. Standarde germane, garanție scrisă, ofertă gratuită.',
    img: 'card-ziegeloptik.webp', w: 600, h: 400, alt: 'Structură de acoperiș cu șipci și membrană',
    h1: 'Șarpantă în București și împrejurimi',
    sub: 'Șarpante noi, consolidarea și înlocuirea căpriorilor deteriorați – o structură solidă pentru orice tip de învelitoare. Standarde germane de execuție, garanție scrisă.',
    leads: [
      'Șarpanta este scheletul acoperișului – de ea depinde dacă învelitoarea stă drept și sigur ani de zile. Facem șarpante noi pe case și clădiri în construcție și reparăm structuri afectate de umezeală, dăunători sau suprasarcină.',
      'La renovări verificăm întâi starea lemnului. Înlocuim doar ce trebuie, iar restul îl consolidăm.'
    ],
    scope: ['Execuția șarpantei după proiect', 'Montaj cosoroabe, căpriori, pane și clești', 'Consolidarea căpriorilor slăbiți', 'Înlocuirea elementelor de structură deteriorate',
      'Tratarea lemnului cu soluții de protecție', 'Pregătirea structurii pentru ferestre de mansardă', 'Șarpante pentru garaje, case și anexe', 'Pregătirea structurii pentru învelitoarea nouă'],
    qual: [['Lemnul potrivit', 'Folosim lemn de construcție uscat și impregnat.'],
      ['Conform proiectului', 'Secțiunile și distanțele dintre elemente le facem după proiect.'],
      ['Îmbinări precise', 'Îmbinări de dulgherie solide și piese metalice acolo unde e nevoie.'],
      ['Acoperiș drept, fără denivelări', 'Avem grijă de geometria acoperișului, ca învelitoarea să stea perfect drept.']],
    faq: [['De unde știu că șarpanta trebuie reparată?', 'Semnale de alarmă sunt apele lăsate, lemnul umed sau înnegrit, urme de dăunători sau elemente crăpate. La evaluarea gratuită verificăm starea structurii.'],
      ['Se poate consolida șarpanta fără să scoatem învelitoarea?', 'De multe ori da – depinde de locul defectului și de accesul din pod. Verificăm la fața locului.'],
      ['Faceți șarpanta după proiect?', 'Da. Șarpanta nouă o facem conform proiectului de construcție.']]
  },
  {
    path: '/hidroizolatii/', service: 'Acoperiș plat', option: 'Acoperiș plat',
    title: 'Acoperiș plat București și împrejurimi – hidroizolație cu membrană bituminoasă | HidroAcoperiș',
    desc: 'Acoperișuri plate în București și împrejurimi (până la 50 km): hidroizolații noi și renovări cu membrană bituminoasă pe garaje, case, blocuri și hale. Garanție scrisă, ofertă gratuită.',
    img: 'hero-flachdach.webp', w: 800, h: 500, alt: 'Acoperiș plat acoperit cu membrană bituminoasă',
    h1: 'Acoperiș plat în București și împrejurimi',
    sub: 'Hidroizolații noi și renovări de acoperișuri plate cu membrană bituminoasă – pe garaje, case, blocuri și hale. Garanție scrisă, ofertă gratuită.',
    leads: [
      'Un acoperiș plat trebuie înainte de toate să fie etanș. Apa stă pe el mai mult decât pe unul înclinat, deci orice greșeală se vede repede. De aceea suntem foarte atenți la pante, la suprapunerile membranei și la racordurile de la atice, coșuri și guri de scurgere.',
      'Facem acoperișuri plate pe clădiri de orice mărime: de la garaj și casă până la blocuri, hale și clădiri comerciale.',
      'Hidroizolație cu membrană bituminoasă – acoperiș de garaj, terasă, bloc. Membrană aplicată cu flacăra în două straturi, de la 30 m².'
    ],
    scope: ['Membrană bituminoasă aplicată cu flacăra – două straturi', 'Renovarea hidroizolațiilor vechi', 'Eliminarea bășicilor, fisurilor și infiltrațiilor', 'Termoizolație sub hidroizolația nouă',
      'Racorduri la atice, coșuri și luminatoare', 'Guri de scurgere și evacuarea apei', 'Montaj trape și luminatoare', 'Acoperișuri plate la garaje, blocuri și hale'],
    qual: [['Pante corecte', 'Apa trebuie să curgă spre guri și jgheaburi, nu să stea pe acoperiș.'],
      ['Lipituri atente', 'Suprapunerile membranei le facem cu rezervă suficientă și verificăm fiecare lipitură.'],
      ['Racorduri la atice', 'Ridicarea membranei pe atice și pereți e cheia unui acoperiș etanș.'],
      ['Scurgere liberă', 'Gurile de scurgere și preaplinurile le facem așa încât apa să aibă mereu pe unde ieși.']],
    faq: [['Se poate pune membrană nouă peste cea veche?', 'De multe ori da, dacă vechea hidroizolație e uscată și bine lipită de suport. Decidem după evaluarea la fața locului – uneori e mai bine să scoatem straturile vechi.'],
      ['Faceți acoperișuri plate la blocuri și hale?', 'Da. Facem acoperișuri plate pe clădiri de orice mărime – de la garaj până la blocuri, hale și clădiri comerciale.'],
      ['Când e cel mai bine să renovați un acoperiș plat?', 'Membrana bituminoasă se aplică pe vreme uscată, cel mai bine din primăvară până toamna. Infiltrațiile urgente le rezolvăm și în afara sezonului, de îndată ce vremea permite.']]
  },
  {
    path: '/montaj-tabla/', service: 'Țiglă metalică', option: 'Țiglă metalică',
    title: 'Țiglă metalică București și împrejurimi – montaj și înlocuire învelitoare | HidroAcoperiș',
    desc: 'Montaj țiglă metalică, tablă cutată și tablă fălțuită în București și împrejurimi (până la 50 km). Acoperișuri noi și înlocuire învelitoare. Garanție scrisă, ofertă gratuită.',
    img: 'hero-blechdach.webp', w: 800, h: 446, alt: 'Montaj învelitoare din tablă pe acoperiș',
    h1: 'Țiglă metalică în București și împrejurimi',
    sub: 'Montaj țiglă metalică, tablă cutată și tablă fălțuită – pe acoperișuri noi și la înlocuirea învelitorii. Standarde germane de execuție, garanție scrisă.',
    leads: [
      'Țigla metalică este ușoară, rezistentă și se montează repede – de aceea e una dintre cele mai folosite învelitori în România. Ca să țină mult, trebuie însă prinsă corect și bine ventilată pe dedesubt.',
      'Montăm învelitori din tablă pe case, garaje, anexe și hale – atât pe acoperișuri noi, cât și în locul învelitorii vechi.'
    ],
    scope: ['Țiglă metalică modulară și în panouri', 'Tablă cutată pentru garaje, hale și anexe', 'Tablă fălțuită', 'Membrană, contrașipci și șipci sub învelitoare',
      'Tinichigerie: coame, borduri, dolii, picurători', 'Tinichigerie la coșuri și ferestre de mansardă', 'Parazăpezi și podețe de acces', 'Jgheaburi și burlane în culoarea învelitorii'],
    qual: [['Prindere corectă', 'Șuruburi cu garnitură în locurile indicate de producător – fără strângere excesivă și fără joc.'],
      ['Ventilare sub tablă', 'Spațiul potrivit sub învelitoare previne condensul.'],
      ['Tăiere fără flex', 'Tabla o tăiem cu foarfeca, ca să nu distrugem stratul protector și să nu apară rugina.'],
      ['Tinichigerie completă', 'Tinichigeria și accesoriile sunt din același sistem cu învelitoarea.']],
    faq: [['Țigla metalică e zgomotoasă când plouă?', 'La un acoperiș făcut corect – cu membrană și mansarda izolată – ploaia se aude foarte puțin.'],
      ['Ne ajutați să alegem culoarea și tipul de tablă?', 'Da. Vă recomandăm profilul, grosimea și stratul de protecție, plus o culoare potrivită clădirii.'],
      ['Cât rezistă țigla metalică?', 'Durata depinde mai ales de calitatea tablei și a stratului de protecție și de montaj. O învelitoare bună, montată corect, ține zeci de ani.']]
  },
  {
    path: '/izolatie-mansarda/', service: 'Izolație mansardă', option: 'Izolație mansardă',
    title: 'Izolație mansardă București și împrejurimi – izolație între căpriori și planșeu | HidroAcoperiș',
    desc: 'Izolație mansardă în București și împrejurimi (până la 50 km): vată minerală între căpriori, izolarea planșeului și a podului. Garanție scrisă, ofertă gratuită.',
    img: 'dachdaemmung.svg', w: 1200, h: 800, alt: 'Mansardă izolată – ilustrație',
    h1: 'Izolație mansardă în București și împrejurimi',
    sub: 'Izolație între căpriori și izolarea planșeului sau a podului – mai cald iarna, mai răcoare vara și facturi mai mici la încălzire.',
    leads: [
      'Printr-un acoperiș neizolat se pierde multă căldură. O mansardă bine izolată face casa mai confortabilă tot anul: iarna păstrează căldura, iar vara o protejează de încingere.',
      'Izolăm mansarde cu vată minerală între căpriori, precum și planșeul sau podul nelocuit. Esențială este bariera de vapori făcută etanș – ea protejează izolația de umezeala din casă.'
    ],
    scope: ['Izolație cu vată minerală între căpriori', 'Barieră de vapori cu îmbinări și racorduri lipite', 'Izolarea planșeului de sub pod', 'Izolarea podului nelocuit', 'Completarea sau înlocuirea izolației vechi'],
    qual: [['Fără goluri', 'Vata o tăiem pe măsură, ca să nu rămână goluri sau întreruperi în izolație.'],
      ['Barieră de vapori etanșă', 'Folia o lipim la îmbinări și la pereți – asta decide cât ține izolația.'],
      ['Ventilarea acoperișului', 'Păstrăm spațiul de sub membrană, ca acoperișul să poată respira.'],
      ['Grosime potrivită', 'Grosimea izolației o alegem după structură și după cerințele termice actuale.']],
    faq: [['Ce grosime trebuie să aibă izolația la mansardă?', 'O alegem după structura acoperișului și cerințele termice actuale. La izolația între căpriori potrivim grosimea vatei la înălțimea căpriorilor, ca să rămână ventilare sub învelitoare.'],
      ['Se poate izola mansarda fără să scoatem învelitoarea?', 'Da, izolația între căpriori o facem din interior, dacă sub învelitoare există membrană difuzivă. Dacă nu există, vă recomandăm cea mai bună soluție.'],
      ['Izolăm acoperișul sau planșeul?', 'Dacă podul nu e locuit, de obicei e suficientă izolarea planșeului sau a podului. Dacă mansarda e sau va fi locuită, izolăm acoperișul între căpriori.']]
  },
  {
    path: '/structura-panouri-solare/', service: 'Structură panouri solare', option: 'Structură panouri solare',
    title: 'Structură panouri solare București și împrejurimi – montaj pe acoperiș | HidroAcoperiș',
    desc: 'Montaj structură pentru panouri fotovoltaice pe acoperiș în București și împrejurimi (până la 50 km): cârlige, șine, panouri și etanșarea învelitorii. Garanție scrisă, ofertă gratuită.',
    img: 'hero-solar.webp', w: 1400, h: 788, alt: 'Panouri fotovoltaice montate pe acoperiș',
    h1: 'Structură panouri solare în București și împrejurimi',
    sub: 'Montaj cârlige, șine și panouri pe acoperiș, cu etanșarea corectă a învelitorii. Instalația stă stabil, iar acoperișul rămâne etanș.',
    leads: [
      'La montajul fotovoltaicelor acoperișul se strică ușor: cârlige puse greșit, țigle crăpate sau treceri neetanșe pot duce în timp la infiltrații. Noi lucrăm ca meșteri de acoperișuri – instalația trebuie să fie stabilă, iar învelitoarea etanșă.',
      'Ne ocupăm doar de partea mecanică de pe acoperiș. Conectarea electrică o face un electrician autorizat.'
    ],
    scope: ['Alegerea și montajul cârligelor după tipul învelitorii: țiglă, tablă, membrană', 'Montaj șine', 'Montaj panouri pe structură', 'Etanșarea prinderilor și a trecerilor prin învelitoare',
      'Structuri pentru acoperișuri plate', 'Țigle și plăci de sistem sub cârlige', 'Demontarea și remontarea panourilor la renovarea acoperișului'],
    qual: [['Prindere în structură', 'Cârligele le ancorăm în căpriori sau în structură, nu doar în învelitoare.'],
      ['Țigla fără încărcare', 'Cârligul nu are voie să se sprijine pe țiglă – altfel aceasta crapă în timp.'],
      ['Treceri etanșe', 'Fiecare prindere și trecere prin învelitoare o protejăm de apă.'],
      ['Vânt și zăpadă', 'Distanța dintre prinderi o alegem ținând cont de vânt și zăpadă.']],
    faq: [['Faceți și conectarea electrică?', 'Nu. Facem montajul mecanic pe acoperiș: cârlige, șine, panouri și etanșarea învelitorii. Conectarea electrică o face un electrician autorizat.'],
      ['Lucrați cu instalatorul nostru?', 'Da. Putem face partea de acoperiș direct pentru dumneavoastră sau împreună cu firma de instalații aleasă de dumneavoastră.'],
      ['Merită să schimbăm acoperișul înainte de panouri?', 'Dacă învelitoarea e veche, merită luat în calcul – mai târziu înlocuirea ar cere demontarea panourilor. La evaluarea la fața locului vă spunem starea acoperișului.']]
  },
  {
    path: '/reparatii-acoperis/', service: 'Reparații acoperiș', option: 'Reparații acoperiș',
    title: 'Reparații acoperiș București și împrejurimi – infiltrații, țiglă, tinichigerie | HidroAcoperiș',
    desc: 'Reparații acoperiș în București și împrejurimi (până la 50 km): infiltrații, țiglă, tablă, membrană, tinichigerie la coșuri, pagube după furtuni. Case, blocuri, hale. Ofertă gratuită.',
    img: 'hero-dachreparatur.webp', w: 800, h: 500, alt: 'Învelitoare deteriorată care trebuie reparată',
    h1: 'Reparații acoperiș în București și împrejurimi',
    sub: 'Infiltrații, țigle și tablă deteriorate, tinichigerie la coșuri, acoperișuri plate – găsim cauza și reparăm definitiv.',
    leads: [
      'Pată pe tavan, perete ud sub acoperiș sau învelitoare smulsă de vânt? Cu cât ne ocupăm mai repede de defect, cu atât sunt mai mici pagubele la structură și izolație.',
      'Nu peticim doar simptomele – întâi căutăm de unde intră de fapt apa. De multe ori cauza este tinichigeria neetanșă de la coș, de la fereastra de mansardă sau de la dolie, nu învelitoarea în sine.'
    ],
    scope: ['Găsirea și eliminarea infiltrațiilor', 'Înlocuirea țiglelor crăpate și deplasate', 'Reparații la învelitori din tablă și membrană',
      '<a href="/tinichigerie/">Tinichigerie nouă la coșuri, ferestre de mansardă și pereți</a>', 'Reparații la coame și dolii', 'Remedierea pagubelor după vânt și furtuni',
      'Repararea și etanșarea jgheaburilor', 'Verificarea stării acoperișului'],
    qual: [['Diagnostic înainte de reparație', 'Întâi aflăm cauza infiltrației, apoi reparăm.'],
      ['Materiale potrivite', 'Pentru reparație alegem elemente potrivite cu învelitoarea existentă.'],
      ['Protejare rapidă', 'În situații urgente întâi protejăm acoperișul de alte pagube.'],
      ['Evaluare cinstită', 'Vă spunem direct dacă reparația are sens sau e mai bine să schimbați învelitoarea.']],
    faq: [['Ce fac dacă îmi curge acoperișul?', 'Protejați lucrurile de sub locul infiltrației, faceți câteva poze din exterior și din interior și trimiteți-le pe WhatsApp. Stabilim cât de repede putem veni.'],
      ['Reparați acoperișuri plate și acoperișuri de bloc?', 'Da. Reparăm acoperișuri înclinate și plate pe clădiri de orice mărime – de la garaj și casă până la blocuri și hale.'],
      ['Reparație sau înlocuire?', 'Dacă defectul e local, de obicei ajunge o reparație. Dacă învelitoarea e veche și problemele revin, merită mai mult înlocuirea. Vă sfătuim după evaluarea la fața locului.']]
  },
  {
    path: '/tinichigerie/', service: 'Tinichigerie', option: 'Tinichigerie',
    title: 'Tinichigerie acoperiș București și împrejurimi – coșuri, ferestre de mansardă, atice | HidroAcoperiș',
    desc: 'Tinichigerie în București și împrejurimi (până la 50 km): racorduri la coșuri, ferestre de mansardă, atice și pereți, picurători, repararea tinichigeriei neetanșe. Ofertă gratuită.',
    img: 'hero-dachreparatur.webp', w: 800, h: 500, alt: 'Acoperiș cu tinichigerie care trebuie reparată',
    h1: 'Tinichigerie în București și împrejurimi – coșuri, ferestre, atice',
    sub: 'Tinichigerie nouă la coșuri, ferestre de mansardă, atice și pereți, plus repararea celei neetanșe. Venim și pentru lucrări mici.',
    leads: [
      'Infiltrație la coș, perete ud sub atic sau pată lângă fereastra de mansardă? De cele mai multe ori de vină e tinichigeria neetanșă sau ruginită, nu învelitoarea.',
      'Facem tinichigerie nouă din tablă zincată vopsită, aluminiu, titan-zinc și cupru și o reparăm pe cea existentă – pe case, garaje, blocuri și hale.'
    ],
    scope: ['Tinichigerie la coșuri – nouă și repararea celei neetanșe', 'Tinichigerie la ferestre de mansardă și trape', 'Racorduri la atice, calcane și pereți', 'Picurători și tinichigeria streașinii',
      'Dolii, borduri și coame', 'Glafuri exterioare și pălării de coș din tablă', 'Etanșarea și înlocuirea tinichigeriei ruginite', 'Lucrări mici de tinichigerie – fără cantitate minimă'],
    qual: [['Diagnostic înainte de reparație', 'Întâi aflăm pe unde intră apa, apoi facem tinichigeria.'],
      ['Tablă potrivită', 'Materialul și culoarea le alegem după învelitoarea existentă.'],
      ['Îmbinări etanșe', 'Tinichigeria o încastrăm în peretele coșului și o etanșăm – nu doar „cu silicon”.'],
      ['Evaluare cinstită', 'Vă spunem direct dacă ajunge etanșarea sau tinichigeria trebuie schimbată.']],
    faq: [['Curge la coș – ce fac?', 'Faceți câteva poze cu coșul din exterior și cu pata din interior și trimiteți-le pe WhatsApp. De obicei ajunge repararea sau înlocuirea tinichigeriei de la coș – stabilim repede o vizită la fața locului.'],
      ['Veniți și pentru lucrări mici de tinichigerie?', 'Da. Facem și racorduri individuale – un coș, o fereastră de mansardă, o bucată de atic sau picurătorul.'],
      ['Din ce tablă faceți tinichigeria?', 'Din tablă zincată vopsită, aluminiu, titan-zinc și cupru. Materialul și culoarea le potrivim cu învelitoarea.']]
  },
  {
    path: '/jgheaburi/', service: 'Jgheaburi', option: 'Jgheaburi',
    title: 'Jgheaburi București și împrejurimi – montaj, reparații și curățare | HidroAcoperiș',
    desc: 'Montaj, reparații, etanșare și curățare jgheaburi și burlane în București și împrejurimi (până la 50 km). Și reparații mici. Case, blocuri, hale. Garanție scrisă, ofertă gratuită.',
    img: 'hero-dachrinne.webp', w: 800, h: 500, alt: 'Jgheab de acoperiș cu cârlig de prindere',
    h1: 'Jgheaburi în București și împrejurimi – montaj, reparații și curățare',
    sub: 'Montaj, înlocuire, reparații, etanșare și curățare jgheaburi și burlane. Venim și pentru reparații mici – fără lungime minimă.',
    leads: [
      'Un jgheab neetanș sau montat prost poate strica fațada, fundația și scândurile streașinii. De aceea montăm jgheaburile cu panta potrivită lungimii și cu numărul corect de burlane.',
      'Montăm sisteme pluviale pe case, garaje, blocuri și hale – pe acoperișuri noi și la înlocuirea jgheaburilor vechi. Reparăm și jgheaburi care curg, sunt rupte sau înfundate: etanșăm îmbinările, schimbăm bucățile deteriorate, curățăm jgheaburile și burlanele.'
    ],
    scope: ['Montaj jgheaburi și burlane noi', 'Înlocuirea jgheaburilor vechi și ruginite', 'Jgheaburi din oțel, aluminiu, PVC, cupru și titan-zinc', 'Cârlige și picurător',
      'Racordarea burlanelor la canalizare', 'Plase și grătare împotriva frunzelor', 'Repararea și etanșarea scurgerilor la jgheaburi și îmbinări', 'Curățarea jgheaburilor și desfundarea burlanelor',
      'Corectarea pantei, înlocuirea cârligelor și a bucăților deteriorate', 'Reparații mici – fără lungime minimă', 'Tinichigeria streașinii'],
    qual: [['Panta potrivită', 'Un jgheab cu pantă potrivită lungimii nu adună apă și mizerie.'],
      ['Picurător', 'Apa curge direct în jgheab, nu pe scândurile streașinii.'],
      ['Un singur sistem', 'Jgheaburi, cârlige și racorduri din același sistem – fără scurgeri la îmbinări.'],
      ['Cârlige rezistente', 'Distanța dintre cârlige o alegem ca jgheabul să țină la zăpadă și gheață.']],
    faq: [['Schimbați doar jgheaburile, fără renovarea acoperișului?', 'Da. Jgheaburile și burlanele le schimbăm și ca serviciu separat.'],
      ['Ce material de jgheab să aleg?', 'Cele mai alese sunt jgheaburile din oțel vopsit și PVC. Cuprul și titan-zincul sunt mai scumpe, dar foarte rezistente. Vă recomandăm soluția potrivită clădirii.'],
      ['Montați jgheaburi la blocuri și hale?', 'Da – montăm sisteme pluviale pe clădiri de orice mărime.']]
  }
];

/* ---------- Pagina principală ---------- */
const HOME_FAQ = [
  ['Unde lucrați?', 'În București și împrejurimi – până la aproximativ 50 km de oraș. Dacă nu sunteți sigur că localitatea dumneavoastră e în zona noastră, scrieți-ne și vă răspundem imediat.'],
  ['Oferta costă ceva?', 'Nu. Evaluarea acoperișului și oferta sunt gratuite și fără obligații.'],
  ['Ce garanție oferiți?', 'Pentru lucrările executate dăm garanție în scris. Ce acoperă și pe ce perioadă stabilim înainte de începerea lucrării – depind de tipul lucrării și de materialele folosite.'],
  ['Ce acoperișuri faceți?', 'Toate tipurile: acoperișuri înclinate și plate, pe garaje, case, blocuri, clădiri vechi, hale și clădiri comerciale. Construim acoperișuri noi, înlocuim învelitori vechi și facem reparații.'],
  ['Faceți și reparații la acoperiș?', 'Da. Eliminăm infiltrații, înlocuim țigle și tablă deteriorate, reparăm tinichigeria de la coșuri și acoperișurile plate. Întâi căutăm cauza și abia apoi reparăm.'],
  ['Cum mă pregătesc pentru ofertă?', 'Ajung câteva poze cu acoperișul și dimensiunile aproximative ale clădirii. Trimiteți-le pe WhatsApp – așa pregătim mai repede o ofertă estimativă și stabilim vizita la fața locului.'],
  ['Conectați și instalația fotovoltaică?', 'Nu. Ne ocupăm de partea de acoperiș: montajul cârligelor, șinelor și panourilor și etanșarea învelitorii. Conectarea electrică o face un electrician autorizat.']
];
const CARDS = [
  ['/inlocuire-acoperis/', 'card-ziegeloptik.webp', 'Învelitoare nouă pe șipci și membrană', 'Acoperiș nou și înlocuire', 'Acoperișuri noi și înlocuirea celor vechi: șarpantă, membrană, învelitoare, tinichigerie.'],
  ['/reparatii-acoperis/', 'card-dachreparatur.webp', 'Acoperiș care curge și trebuie reparat', 'Reparații acoperiș', 'Infiltrații, țigle deteriorate, tinichigerie la coșuri – găsim cauza și eliminăm defectul.'],
  ['/tinichigerie/', 'card-schornstein.webp', 'Coș pe acoperiș cu tinichigerie', 'Tinichigerie', 'Tinichigerie la coșuri, ferestre de mansardă și atice – nouă și repararea celei neetanșe.'],
  ['/sarpanta/', 'card-trapezblech.webp', 'Structură de acoperiș cu șipci din lemn', 'Șarpantă', 'Șarpantă nouă, plus consolidarea sau înlocuirea căpriorilor și șipcilor deteriorate.'],
  ['/hidroizolatii/', 'card-flachdach.webp', 'Acoperiș plat înainte și după hidroizolația nouă', 'Acoperiș plat', 'Hidroizolații etanșe cu membrană bituminoasă – pe garaje, case, blocuri, hale și clădiri comerciale.'],
  ['/montaj-tabla/', 'card-blechdach-combo.webp', 'Montaj țiglă metalică pe acoperiș', 'Țiglă metalică', 'Învelitoare ușoară și rezistentă din tablă, montată cu toată tinichigeria și accesoriile.'],
  ['/izolatie-mansarda/', 'dachdaemmung.svg', 'Mansardă izolată', 'Izolație mansardă', 'Izolație între căpriori și izolarea planșeului – mai cald iarna, mai răcoare vara.'],
  ['/structura-panouri-solare/', 'card-solar.webp', 'Panouri fotovoltaice montate pe acoperiș', 'Structură panouri solare', 'Montaj cârlige, șine și panouri pe acoperiș – cu etanșarea corectă a învelitorii.'],
  ['/jgheaburi/', 'card-klempner.webp', 'Jgheab de acoperiș cu cârlig de prindere', 'Jgheaburi', 'Montaj și înlocuire jgheaburi și burlane, ca apa de pe acoperiș să nu strice fațada.']
];

function homePage() {
  const desc = 'Acoperișuri noi, înlocuire și reparații acoperiș în București și împrejurimi (până la 50 km). Echipă locală cu experiență în Germania, garanție scrisă, ofertă gratuită.';
  const ld = [{
    '@context': 'https://schema.org', '@type': 'RoofingContractor', name: BRAND, legalName: 'Meisterdach GmbH SRL',
    telephone: TEL, email: MAIL, url: SITE + '/', image: SITE + '/img/hero-video-poster-v42.webp', areaServed: AREA,
    openingHours: 'Mo-Su 08:00-21:00'
  }, faqLd(HOME_FAQ)];
  return `${head({ path: '/', title: 'Acoperișuri București și împrejurimi – acoperiș nou, înlocuire, reparații | HidroAcoperiș', desc, img: 'hero-video-poster-v42.webp', ld })}
<body data-page="home">

${SYMBOLS}

${header('/')}

<main>
<section class="hero">
  <img class="hero-img" src="/img/hero-video-poster-v42.webp" alt="Echipa ${BRAND} la montajul unui acoperiș nou" width="960" height="540" fetchpriority="high" decoding="async">
  <div class="hero-txt">
    <span class="zone">${ico('pin')}${ZONA}</span>
    <h1>Acoperișuri noi, înlocuire și reparații în București și împrejurimi – echipă locală cu experiență în Germania</h1>
    ${OFFER24}
    <p class="hero-sub">Toate tipurile de acoperișuri – înclinate și plate, de la garaj și casă până la blocuri și hale. Standarde germane de execuție, garanție scrisă, ofertă gratuită.</p>
    ${TICKS}
    <div class="btns">
      ${btnWa('Ofertă gratuită pe WhatsApp')}
      ${btnTel(TEL_TXT)}
    </div>
  </div>
</section>

<section class="sec" id="servicii">
  <div class="wrap">
    <h2 class="h2">Ce facem</h2>
    <p class="lead">Construim acoperișuri noi, le înlocuim pe cele vechi și le reparăm pe cele deteriorate – de la structură și învelitoare până la jgheaburi și izolație. Lucrăm în București și împrejurimi pe orice tip de clădire: case, garaje, anexe, blocuri, clădiri vechi, hale și spații comerciale.</p>
    <div class="cards">
${CARDS.map(([h, img, alt, t, d]) => `      <a class="card" href="${h}">
        <img src="/img/${img}" alt="${alt}" width="600" height="400" loading="lazy" decoding="async">
        <div class="card-b"><h3>${t}</h3><p>${d}</p><span class="more">Detalii →</span></div>
      </a>`).join('\n')}
    </div>
  </div>
</section>

<section class="sec sec-dk">
  <div class="wrap">
    <h2 class="h2">De ce ${BRAND}?</h2>
    <p class="lead">Ani de zile am construit, înlocuit și reparat acoperișuri în Germania. Acum lucrăm la fel în București și împrejurimi.</p>
    <div class="why">
      <div class="why-i"><span class="why-ic">${ico('flag')}</span><div><h3>Echipă locală cu experiență în Germania</h3><p>Suntem aproape și cunoaștem cerințele uneia dintre cele mai exigente piețe de acoperișuri din Europa.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('check')}</span><div><h3>Standarde germane de execuție</h3><p>Precizie, ordine pe șantier și lucru după regulile meseriei – fără scurtături.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('doc')}</span><div><h3>Garanție scrisă</h3><p>Pentru lucrările executate primiți garanție în scris – clar stabilită, nu doar promisă.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('eye')}</span><div><h3>Ofertă gratuită</h3><p>Venim, ne uităm la acoperiș și pregătim oferta – fără costuri și fără obligații.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('list')}</span><div><h3>Înțelegeri clare</h3><p>Lucrările, materialele și termenul le stabilim înainte de început – și ne ținem de ele.</p></div></div>
      <div class="why-i"><span class="why-ic">${ico('home')}</span><div><h3>Orice tip de acoperiș</h3><p>Acoperișuri înclinate și plate – de la garaj și casă până la blocuri, clădiri vechi și hale.</p></div></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <h2 class="h2">Cum lucrăm</h2>
    <p class="lead">Simplu și fără formalități inutile – de la primul mesaj până la acoperișul gata.</p>
    <div class="steps">
      <div class="step"><h3>Contact</h3><p>Scrieți-ne pe WhatsApp, sunați sau lăsați numărul în formular. Puteți trimite direct poze cu acoperișul.</p></div>
      <div class="step"><h3>Evaluare</h3><p>Stabilim o vizită gratuită la fața locului în București sau în împrejurimi.</p></div>
      <div class="step"><h3>Ofertă</h3><p>Primiți oferta cu descrierea lucrărilor și a materialelor – fără poziții ascunse.</p></div>
      <div class="step"><h3>Execuție</h3><p>Facem acoperișul la termenul stabilit și vă dăm garanția în scris.</p></div>
    </div>
  </div>
</section>

${formSection('')}

${faqHtml(HOME_FAQ)}

${cta('Acoperiș nou, înlocuire sau reparație?', 'Scrieți sau sunați – stabilim o vizită gratuită la fața locului în București și împrejurimi.', 'Scrieți pe WhatsApp')}
</main>

${footer()}`;
}

function contactPage() {
  const p = { path: '/contact/', title: 'Contact – ofertă gratuită pentru acoperiș | HidroAcoperiș',
    desc: 'Contact HidroAcoperiș: WhatsApp și telefon 0742 431 066. Ofertă gratuită pentru acoperiș în București și împrejurimi (până la 50 km).', img: 'hero-video-poster-v42.webp',
    ld: [crumbsLd('Contact', '/contact/')] };
  return `${head(p)}
<body data-page="contact">

${SYMBOLS}

${header('/contact/')}

<main>
<section class="hero">
  <img class="hero-img" src="/img/hero-video-poster-v42.webp" alt="Echipa ${BRAND} pe acoperiș" width="960" height="540" fetchpriority="high" decoding="async">
  <div class="hero-txt">
    <nav class="crumb" aria-label="Navigare"><a href="/">Acasă</a> › Contact</nav>
    <h1>Contact – ofertă gratuită pentru acoperiș</h1>
    ${OFFER24}
    <p class="hero-sub">Scrieți-ne pe WhatsApp, sunați sau lăsați numărul în formular. Lucrăm în București și împrejurimi (până la 50 km).</p>
    <div class="btns">
      ${btnWa('Ofertă gratuită pe WhatsApp')}
      ${btnTel(TEL_TXT)}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <h2 class="h2">Cum ne contactați</h2>
    <p class="lead">Cel mai repede răspundem pe WhatsApp – puteți trimite direct poze cu acoperișul, așa oferta vine mai repede.</p>
    <div class="cc">
      <a class="cc-i" href="${esc(WA)}" target="_blank" rel="noopener"><span class="cc-ic cc-wa">${ico('wa')}</span><span><b>WhatsApp</b>${TEL_TXT}</span></a>
      <a class="cc-i" href="tel:${TEL}"><span class="cc-ic">${ico('tel')}</span><span><b>Telefon</b>${TEL_TXT}</span></a>
      <a class="cc-i" href="mailto:${MAIL}"><span class="cc-ic">${ico('doc')}</span><span><b>E-mail</b>${MAIL}</span></a>
      <div class="cc-i"><span class="cc-ic">${ico('pin')}</span><span><b>Zonă de lucru</b>${ZONA}</span></div>
    </div>
  </div>
</section>

${formSection('')}

<section class="sec sec-w">
  <div class="wrap prose">
    <h2>Datele firmei</h2>
    <p>Meisterdach GmbH SRL<br>CUI RO51313339<br>Nr. Reg. Com. J2025011664001</p>
    <p>E-mail: <a href="mailto:${MAIL}">${MAIL}</a><br>Telefon și WhatsApp: <a href="tel:${TEL}">${TEL_TXT}</a></p>
  </div>
</section>

</main>

${footer()}`;
}

function thanksPage() {
  return `${head({ path: '/multumim/', title: 'Mulțumim! – HidroAcoperiș', desc: 'Am primit cererea dumneavoastră. Vă sunăm cât mai repede.', noindex: true })}
<body data-page="multumim">

${SYMBOLS}

${header('')}

<main>
<section class="hero hero-plain">
  <div class="hero-txt thanks">
    <div class="thanks-ok" aria-hidden="true">✓</div>
    <h1>Mulțumim! Am primit cererea dumneavoastră.</h1>
    <p class="hero-sub">Vă sunăm cât mai repede și stabilim o evaluare gratuită a acoperișului în București sau în împrejurimi.</p>
    <p class="hero-sub"><strong style="color:#fff">Aveți poze cu acoperișul?</strong> Trimiteți-le pe WhatsApp – așa pregătim oferta mai repede.</p>
    <div class="btns">
      ${btnWa('Ofertă gratuită pe WhatsApp')}
      ${btnTel(TEL_TXT)}
    </div>
    <p style="margin-top:22px"><a href="/" style="color:rgba(255,255,255,.7);text-decoration:underline">← Înapoi la pagina principală</a></p>
  </div>
</section>

</main>

${footer(false)}`;
}

function privacyPage() {
  return `${head({ path: '/confidentialitate/', title: 'Politica de confidențialitate | HidroAcoperiș', desc: 'Informații despre prelucrarea datelor personale conform GDPR și despre cookie-uri.', ld: [crumbsLd('Politica de confidențialitate', '/confidentialitate/')] })}
<body data-page="confidentialitate">

${SYMBOLS}

${header('')}

<main>
<section class="hero hero-plain">
  <div class="hero-txt">
    <nav class="crumb" aria-label="Navigare"><a href="/">Acasă</a> › Politica de confidențialitate</nav>
    <h1>Politica de confidențialitate</h1>
    <p class="hero-sub">Informații despre prelucrarea datelor personale conform GDPR și despre cookie-uri.</p>
  </div>
</section>

<section class="sec sec-w">
  <div class="wrap prose">
    <h2>1. Operatorul de date</h2>
    <p>Operatorul datelor dumneavoastră personale este Meisterdach GmbH SRL, CUI RO51313339, Nr. Reg. Com. J2025011664001, cu sediul în Sat Bolintineni, nr. 6/A, 547456, județul Mureș (denumit în continuare „Operatorul”, „noi”). Pentru orice întrebare legată de datele personale ne puteți scrie la <a href="mailto:${MAIL}">${MAIL}</a> sau ne puteți suna la <a href="tel:${TEL}">${TEL_TXT}</a>.</p>

    <h2>2. Ce date prelucrăm</h2>
    <ul>
      <li><strong>Formularul de contact:</strong> numele, numărul de telefon, localitatea, tipul lucrării și informații tehnice despre trimitere (pagina de pe care a fost trimisă cererea, identificatorul de click al anunțului Google, dacă există).</li>
      <li><strong>WhatsApp și telefon:</strong> numărul de telefon, numele profilului, conținutul mesajelor și pozele trimise – în măsura în care ni le transmiteți.</li>
      <li><strong>E-mail:</strong> adresa de e-mail și conținutul mesajului.</li>
      <li><strong>Cookie-uri și tehnologii similare:</strong> descrise la punctul 8.</li>
    </ul>

    <h2>3. Scopuri și temeiuri legale</h2>
    <ul>
      <li>Răspunsul la cerere, pregătirea ofertei și stabilirea vizitei la fața locului – demersuri înainte de încheierea contractului, la cererea dumneavoastră (art. 6 alin. (1) lit. b GDPR).</li>
      <li>Executarea contractului și garanția – art. 6 alin. (1) lit. b GDPR.</li>
      <li>Îndeplinirea obligațiilor legale, de exemplu fiscale și contabile – art. 6 alin. (1) lit. c GDPR.</li>
      <li>Constatarea, exercitarea sau apărarea unor drepturi în instanță – interesul nostru legitim (art. 6 alin. (1) lit. f GDPR).</li>
      <li>Măsurarea eficienței anunțurilor – doar pe baza consimțământului dumneavoastră (art. 6 alin. (1) lit. a GDPR), pe care îl puteți retrage oricând.</li>
    </ul>

    <h2>4. Destinatarii datelor</h2>
    <p>Datele pot fi transmise firmelor care ne ajută să administrăm site-ul și să comunicăm cu clienții:</p>
    <ul>
      <li>Formspree, Inc. (SUA) – formularul de contact și trimiterea cererilor pe e-mailul nostru,</li>
      <li>Cloudflare, Inc. – găzduirea site-ului,</li>
      <li>Telegram – notificarea internă despre cereri noi,</li>
      <li>Google Ireland Limited / Google LLC – Google Ads (măsurarea conversiilor), doar cu acordul dumneavoastră,</li>
      <li>WhatsApp Ireland Limited – dacă ne contactați pe WhatsApp,</li>
      <li>furnizorul de e-mail pe care îl folosim,</li>
      <li>contabilitatea și consultanții juridici – în măsura necesară.</li>
    </ul>

    <h2>5. Transferul datelor în afara SEE</h2>
    <p>Unii furnizori (de exemplu Formspree, Google, Cloudflare) pot prelucra date în Statele Unite. Transferul se face pe baza deciziei Comisiei Europene privind EU-US Data Privacy Framework sau a clauzelor contractuale standard aprobate de Comisia Europeană.</p>

    <h2>6. Cât timp păstrăm datele</h2>
    <ul>
      <li>Datele din cererile care nu s-au încheiat cu un contract – până la 12 luni de la ultimul contact.</li>
      <li>Datele clienților – pe durata contractului și a garanției, apoi până la expirarea termenelor de prescripție și a obligațiilor contabile.</li>
      <li>Datele prelucrate pe baza consimțământului – până la retragerea acestuia.</li>
    </ul>

    <h2>7. Drepturile dumneavoastră</h2>
    <p>Aveți dreptul de acces la date, de rectificare, de ștergere, de restricționare a prelucrării, la portabilitatea datelor, de opoziție față de prelucrarea bazată pe interesul legitim și de retragere a consimțământului oricând (fără a afecta legalitatea prelucrării dinainte de retragere). Pentru a vă exercita drepturile, scrieți-ne la <a href="mailto:${MAIL}">${MAIL}</a>.</p>
    <p data-stale>Aveți și dreptul să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1, București, sau la o altă autoritate de supraveghere din UE.</p>
    <p>Furnizarea datelor este voluntară, dar fără numărul de telefon nu vă putem răspunde la cererea din formular. Nu luăm decizii automate și nu vă creăm un profil în sensul GDPR.</p>

    <h2>8. Cookie-uri</h2>
    <p>Site-ul folosește cookie-uri și tehnologii similare (de exemplu memoria browserului). La prima vizită le puteți accepta pe toate, le puteți refuza sau puteți alege categoriile:</p>
    <ul>
      <li><strong>Necesare</strong> – rețin alegerea dumneavoastră privind cookie-urile (memoria browserului, cheia <code>ro_consent_v1</code>). Nu necesită acord.</li>
      <li><strong>Statistice</strong> – statistici despre folosirea site-ului; doar cu acordul dumneavoastră.</li>
      <li><strong>Marketing</strong> – Google Ads: măsurăm dacă un click pe anunț s-a încheiat cu un contact (conversie); doar cu acordul dumneavoastră.</li>
    </ul>
    <p>Folosim modul de consimțământ Google (Consent Mode v2). Până nu vă dați acordul, Google nu salvează cookie-uri de publicitate sau statistice; pot fi trimise doar semnale anonime, fără identificatori.</p>
    <p>Vă puteți schimba alegerea oricând: <a href="#" data-cookies>Setări cookies</a>. Cookie-urile le puteți șterge și din setările browserului.</p>

    <h2>9. Modificări</h2>
    <p>Putem actualiza această politică, de exemplu când se schimbă legislația sau instrumentele de pe site. Versiunea actuală este mereu pe această pagină.</p>
    <p><em>Ultima actualizare: noiembrie 2026.</em></p>
  </div>
</section>

</main>

${footer(false)}`;
}

/* ---------- Paginile de ofertă (formular în 3 pași, pentru campanii cu formular) ---------- */
const OPT_ICONS = {
  'Reparații acoperiș': '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l4 4"/><path d="M11.5 8.5l-7 7a1.8 1.8 0 0 0 2.5 2.5l7-7"/><path d="M13 4l3-1 5 5-1 3-2-2-2 2-3-3 2-2z"/></svg>',
  'Acoperișul curge': '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
  'Jgheaburi': '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M18 8.5h2v11"/><path d="M8 15.5v1.5M12 15v3M5 17v1"/></svg>',
  'Acoperiș nou / înlocuire': '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>'
};
const OFERTE = [
  { path: '/oferta-reparatii-acoperis/', title: 'Reparații acoperiș în București și împrejurimi – ofertă gratuită',
    desc: 'Reparații acoperiș în București și împrejurimi: țiglă, tablă, membrană, tinichigerie. Evaluare și ofertă gratuite – lăsați numărul, vă sunăm în 15 minute.',
    h1: 'Reparații acoperiș<br>în București și împrejurimi', sub: '<b>Ofertă gratuită</b> · vă sunăm în 15 minute',
    opts: ['Reparații acoperiș', 'Acoperișul curge', 'Jgheaburi', 'Acoperiș nou / înlocuire'] },
  { path: '/oferta-acoperis-nou/', title: 'Acoperiș nou sau înlocuire învelitoare în București și împrejurimi – ofertă gratuită',
    desc: 'Acoperiș nou sau înlocuirea învelitorii în București și împrejurimi. Evaluare și ofertă gratuite – lăsați numărul, vă sunăm în 15 minute.',
    h1: 'Acoperiș nou<br>sau înlocuire învelitoare', sub: '<b>Ofertă gratuită</b> în București și împrejurimi · vă sunăm în 15 minute',
    opts: ['Acoperiș nou / înlocuire', 'Acoperișul curge', 'Reparații acoperiș', 'Jgheaburi'] },
  { path: '/oferta-acoperis-curge/', title: 'Vă curge acoperișul? Reparație înainte de iarnă – ofertă gratuită | București și împrejurimi',
    desc: 'Acoperiș care curge în București și împrejurimi? Reparație rapidă înainte de iarnă. Evaluare și ofertă gratuite – lăsați numărul, vă sunăm în 15 minute.',
    h1: 'Vă curge acoperișul?<br>Venim și reparăm', sub: '<b>Ofertă gratuită</b> în București și împrejurimi · vă sunăm în 15 minute',
    opts: ['Acoperișul curge', 'Reparații acoperiș', 'Jgheaburi', 'Acoperiș nou / înlocuire'] },
  { path: '/oferta-jgheaburi/', title: 'Reparații și montaj jgheaburi în București și împrejurimi – ofertă gratuită',
    desc: 'Reparații, înlocuire și montaj jgheaburi în București și împrejurimi, înainte de iarnă. Evaluare și ofertă gratuite – lăsați numărul, vă sunăm în 15 minute.',
    h1: 'Reparații și montaj jgheaburi<br>înainte de iarnă', sub: '<b>Ofertă gratuită</b> în București și împrejurimi · vă sunăm în 15 minute',
    opts: ['Jgheaburi', 'Acoperișul curge', 'Reparații acoperiș', 'Acoperiș nou / înlocuire'] }
];

function ofertaPage(o) {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${SITE}${o.path}">
<meta name="theme-color" content="#1c1f22">
<link rel="icon" href="/img/logo.png" type="image/png">
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="stylesheet" href="/assets/wycena.css?v=${V}">
${gtagHead()}
<script src="/assets/app.js?v=${V}" defer></script>
<script src="/assets/wycena.js?v=${V}" defer></script>
</head>
<body>

<header class="top">
  <div class="logo"><div class="lm">🏠</div><div><div class="ln">Hidro<span>Acoperiș</span></div><div class="ls">Firmă de acoperișuri</div></div></div>
  <div class="tagline">✓ Meșteri cu experiență<br>✓ Lucrăm în zona dumneavoastră</div>
</header>

<section class="hero">
  <div class="fx"><i class="tape"></i><i class="beam"></i><i class="r2"></i><i class="r1"></i></div>
  <div class="badge">🚨 URGENȚE ACOPERIȘ</div>
  <h1>${o.h1}</h1>
  <p class="sub">${o.sub}</p>${HOUSE}
</section>

<main>
  <div class="card">
    <div class="prog">
      <button class="back" id="back" aria-label="Înapoi">‹</button>
      <div class="bar"><i id="bar"></i></div>
      <div class="stepn" id="stepn">Pasul 1 din 3</div>
    </div>

    <!-- PASUL 1 -->
    <div class="step on" data-step="1">
      <div class="q">Ce se întâmplă cu acoperișul dumneavoastră?</div>
      <div class="grid">
${o.opts.map((v, i) => `        <button class="opt${i === 0 ? ' hot' : ''}" data-k="problem" data-v="${v}">${OPT_ICONS[v]}${v}</button>`).join('\n')}
      </div>
    </div>

    <!-- PASUL 2 -->
    <div class="step" data-step="2">
      <div class="qsmall">🎁 Avem o ofertă pentru dumneavoastră</div>
      <div class="q">Alegeți oferta</div>
      <div class="offers">
        <button class="offer" data-k="oferta" data-v="Ofertă pentru seniori" data-pct="25">
          <span class="ic">👴</span>
          <span><div class="t">Plătiți <em>cu 25% mai puțin</em> — ofertă pentru seniori</div><div class="d">în casă locuiește un pensionar</div></span>
        </button>
        <button class="offer" data-k="oferta" data-v="Ofertă de iarnă" data-pct="15">
          <span class="ic">❄️</span>
          <span><div class="t">Plătiți <em>cu 15% mai puțin</em> — ofertă de iarnă</div><div class="d">valabilă până la 30.11</div></span>
        </button>
      </div>
      <div class="free">✓ Evaluare și ofertă gratuite</div>
    </div>

    <!-- PASUL 3 -->
    <div class="step" data-step="3">
      <div class="won">🎉 Oferta dumneavoastră:</div>
      <ul class="list">
        <li><span><b id="pct">25</b>% mai puțin la lucrare</span></li>
        <li>Evaluare gratuită a acoperișului</li>
        <li>Ofertă gratuită</li>
      </ul>
      <form id="f" novalidate>
        <input id="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="Număr de telefon">
        <p class="terr" id="terr">Scrieți un număr de telefon corect (10 cifre).</p>
        <p class="hint">După ce scrieți numărul, vă sunăm noi.</p>
        <input id="adr" type="text" autocomplete="street-address" placeholder="Adresa (opțional)">
        <button class="cta" type="submit">Vreau oferta</button>
        <p class="consent">Vă sunăm în 15 minute (zilnic 8:00–21:00). Datele le folosim doar ca să vă contactăm pentru această ofertă.</p>
      </form>
    </div>

    <!-- MULȚUMIM -->
    <div class="step thanks" data-step="4">
      <div class="big">✅</div>
      <h2>Mulțumim!</h2>
      <p>Oferta dumneavoastră este rezervată. Un meșter vă sună în 15 minute (zilnic 8:00–21:00) ca să stabiliți vizita gratuită la fața locului.</p>
    </div>
  </div>
</main>

<footer>
  <p data-stale style="margin:0 0 6px">${DESERVIM}</p>
  ${BRAND} · <a href="/confidentialitate/">Politica de confidențialitate</a> · <a href="#" data-cookies>Cookies</a>
</footer>

<nav class="bbar">
  <a class="cbtn call" href="tel:${TEL}" data-track="call">
    <svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>${TEL_TXT}
  </a>
  <a class="cbtn wa" href="${esc(WA)}" data-track="whatsapp">
    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.1z"/></svg>WhatsApp
  </a>
</nav>

</body>
</html>
`;
}

function notFound() {
  return `${head({ path: '/404', title: 'Pagina nu există – HidroAcoperiș', desc: 'Pagina căutată nu există.', noindex: true })}
<body data-page="404">

${SYMBOLS}

${header('')}

<main>
<section class="hero hero-plain">
  <div class="hero-txt thanks">
    <h1>Pagina nu există</h1>
    <p class="hero-sub">Adresa nu mai e valabilă. Mergeți la <a href="/" style="color:#fff;text-decoration:underline">pagina principală</a> sau sunați-ne.</p>
    <div class="btns">
      ${btnWa('Ofertă gratuită pe WhatsApp')}
      ${btnTel(TEL_TXT)}
    </div>
  </div>
</section>
</main>

${footer(false)}`;
}

/* ---------- Scriere ---------- */
function write(path, html) {
  const file = path === '/404' ? join(OUT, '404.html') : join(OUT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Fișierele site-ului vechi care nu mai sunt folosite.
for (const old of ['acoperis-nou', 'sistem-pluvial', 'assets/site.js', 'assets/img']) {
  const f = join(OUT, old);
  if (existsSync(f)) rmSync(f, { recursive: true, force: true });
}

mkdirSync(join(OUT, 'assets'), { recursive: true });
for (const f of ['style.css', 'wycena.css', 'app.js', 'wycena.js']) copyFileSync(join(SRC, 'assets', f), join(OUT, 'assets', f));

write('/', homePage());
PAGES.forEach((p) => write(p.path, servicePage(p)));
write('/contact/', contactPage());
write('/multumim/', thanksPage());
write('/confidentialitate/', privacyPage());
OFERTE.forEach((o) => write(o.path, ofertaPage(o)));
write('/404', notFound());

const today = new Date().toISOString().slice(0, 10);
const urls = ['/', ...PAGES.map((p) => p.path), '/contact/', '/confidentialitate/'];
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /oferta-\nDisallow: /multumim/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('OK:', 4 + PAGES.length + OFERTE.length + 1, 'pagini în public/');
