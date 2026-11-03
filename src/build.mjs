// Generează paginile statice ale site-ului din același șablon.
// Rulare: node src/build.mjs   (scrie index.html și câte un folder pe serviciu)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://hidro-acoperis.ro';
const TEL = '+40742431066';
const TEL_TXT = '0742 431 066';
const WA = 'https://wa.me/40742431066';
const AW = 'AW-17044870869';
const VER = Date.now().toString(36);

// Tot CSS-ul e inline (≈10 KB): fără cerere în plus și fără deplasări de conținut la încărcare.
const css = (readFileSync(join(ROOT, 'src/critical.css'), 'utf8') + readFileSync(join(ROOT, 'src/site.css'), 'utf8'))
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n+/g, '');
const headJs = readFileSync(join(ROOT, 'src/head.js'), 'utf8').replace(/\n+/g, '');

const ICON = {
  tel: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8s-.39-.12-.56.12-.64.8-.78.97-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33a.45.45 0 0 0-.02-.42c-.06-.12-.56-1.34-.76-1.84s-.4-.42-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.07 4.85 4.85 0 0 0 1 2.58 11.1 11.1 0 0 0 4.27 3.77c1.58.68 2.2.74 3 .62a2.55 2.55 0 0 0 1.67-1.18 2.07 2.07 0 0 0 .15-1.18c-.06-.1-.22-.16-.47-.28z"/></svg>',
  cb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>'
};

const SERVICES = [
  { slug: 'acoperis-nou', name: 'Acoperiș nou / înlocuire', card: 'Structură din lemn, astereală, învelitoare. Montaj complet sau înlocuirea acoperișului vechi.' },
  { slug: 'montaj-tabla', name: 'Montaj tablă', card: 'Tablă tip țiglă, cutată sau fălțuită. Montaj cu toate accesoriile, fără infiltrații.' },
  { slug: 'reparatii-acoperis', name: 'Reparații acoperiș', card: 'Infiltrații, țigle sau tablă deteriorate, coame, dolii. Intervenții și după furtună.' },
  { slug: 'hidroizolatii', name: 'Hidroizolații cu bitum', card: 'Membrane bituminoase pentru terase, blocuri, hale și acoperișuri plate.' },
  { slug: 'sistem-pluvial', name: 'Jgheaburi și burlane', card: 'Montaj, reparații și înlocuire sistem pluvial. Etanșare îmbinări care curg.' }
];

const STEPS = [
  ['Ne contactați', 'Telefonic, pe WhatsApp sau lăsați numărul și vă sunăm noi.'],
  ['Venim la fața locului', 'Vedem acoperișul și stabilim exact ce e de făcut. Gratuit.'],
  ['Primiți oferta', 'Ofertă scrisă și clară, fără costuri ascunse și fără obligații.'],
  ['Executăm lucrarea', 'Echipa noastră lucrează la termenul stabilit și lasă totul curat.']
];

const WHY = [
  ['Echipă proprie', 'Nu dăm lucrarea mai departe la subcontractori.'],
  ['Garanție scrisă', 'Garanția la manoperă e trecută în ofertă.'],
  ['Materiale de calitate', 'Lucrăm cu materiale alese să țină ani de zile.'],
  ['Firmă înregistrată', 'Meisterdach GmbH SRL, CUI RO51313339.']
];

const PAGES = [
  {
    path: '',
    home: true,
    h1: 'Montaj și reparații acoperișuri',
    zone: 'zo',
    title: 'Montaj și reparații acoperișuri{z} – ofertă gratuită | HidroAcoperiș',
    desc: 'Acoperiș nou, montaj tablă, reparații, hidroizolații și jgheaburi. Echipă proprie, ofertă gratuită la fața locului. Sunați: 0742 431 066.',
    lead: 'Acoperiș nou, tablă, reparații, hidroizolații și jgheaburi. Venim la fața locului și primiți ofertă gratuită.',
    wa: 'Bună ziua, aș dori o ofertă pentru acoperiș.',
    svc: '',
    faq: [
      ['Oferta este gratuită?', 'Da. Venim la fața locului, vedem acoperișul și primiți oferta scrisă fără niciun cost și fără obligații.'],
      ['În ce zone lucrați?', 'Lucrăm în județele Mureș, Cluj și Sibiu. Sunați-ne și vă spunem imediat dacă ajungem la dumneavoastră.'],
      ['Cât de repede puteți veni?', 'Răspundem în aceeași zi. De obicei venim la fața locului în 1–2 zile lucrătoare; la infiltrații urgente încercăm să venim cât mai repede.'],
      ['Vindeți materiale?', 'Nu. Ne ocupăm de montaj și reparații. Vă spunem exact ce materiale sunt necesare pentru lucrare.'],
      ['Oferiți garanție?', 'Da, garanție scrisă la manoperă, trecută în ofertă.']
    ]
  },
  {
    path: 'acoperis-nou',
    h1: 'Acoperiș nou și înlocuire acoperiș',
    zone: 'zj',
    title: 'Acoperiș nou și înlocuire acoperiș{z} – ofertă gratuită | HidroAcoperiș',
    desc: 'Montaj acoperiș nou complet: structură din lemn, astereală, învelitoare. Înlocuim și acoperișuri vechi. Ofertă gratuită: 0742 431 066.',
    lead: 'Montăm acoperișul complet, de la structura din lemn până la ultima coamă. Înlocuim și acoperișuri vechi.',
    wa: 'Bună ziua, aș dori o ofertă pentru un acoperiș nou.',
    svc: 'Acoperiș nou / înlocuire',
    work: [
      ['Structură din lemn', 'Căpriori, pane, cosoroabe, montate și tratate corect.'],
      ['Astereală și folie anticondens', 'Pentru un acoperiș etanș și ventilat.'],
      ['Șipci și contrașipci', 'Ventilare corectă sub învelitoare.'],
      ['Montaj învelitoare', 'Tablă tip țiglă, tablă fălțuită sau cutată.'],
      ['Coame, dolii, bordaje', 'Toate detaliile care țin apa afară.'],
      ['Înlocuire acoperiș vechi', 'Demontăm, evacuăm resturile și montăm acoperișul nou.']
    ],
    faq: [
      ['Puteți înlocui complet un acoperiș vechi?', 'Da. Demontăm învelitoarea veche, verificăm și refacem structura acolo unde e nevoie, apoi montăm acoperișul nou.'],
      ['Cât durează un acoperiș nou?', 'Depinde de suprafață, de structură și de vreme. Termenul exact îl primiți în scris, odată cu oferta.'],
      ['Ce învelitoare recomandați?', 'Depinde de casă și de buget. La fața locului vă explicăm pe scurt variantele potrivite, fără să vă împingem spre cea mai scumpă.'],
      ['Oferta este gratuită?', 'Da. Venim, măsurăm și primiți oferta scrisă fără cost și fără obligații.']
    ]
  },
  {
    path: 'montaj-tabla',
    h1: 'Montaj tablă',
    zone: 'zj',
    title: 'Montaj tablă{z} – ofertă gratuită | HidroAcoperiș',
    desc: 'Montaj tablă tip țiglă, cutată și fălțuită, cu toate accesoriile. Echipă proprie, ofertă gratuită la fața locului: 0742 431 066.',
    lead: 'Montăm tablă tip țiglă, cutată sau fălțuită, cu toate accesoriile. Lucrare curată, fără infiltrații.',
    wa: 'Bună ziua, aș dori o ofertă pentru montaj tablă.',
    svc: 'Montaj tablă',
    work: [
      ['Tablă tip țiglă', 'Pentru case, montată pe șipci, cu prindere corectă.'],
      ['Tablă cutată', 'Pentru case, anexe, garaje și hale.'],
      ['Tablă fălțuită', 'Click sau dublu fălțuită, pentru un aspect modern.'],
      ['Accesorii și detalii', 'Coame, dolii, bordaje, sorțuri la coș și la perete.'],
      ['Înlocuire tablă veche', 'Scoatem tabla ruginită sau deteriorată și montăm tablă nouă.'],
      ['Folie și șipci', 'Folie anticondens și șipci noi sub tablă, unde e nevoie.']
    ],
    faq: [
      ['Vindeți și tablă?', 'Nu. Ne ocupăm doar de montaj. Vă spunem exact ce tablă și ce accesorii trebuie, ca să le luați de unde doriți.'],
      ['Se poate monta tablă peste acoperișul vechi?', 'Uneori da, dacă structura e bună. Verificăm la fața locului și vă spunem sincer dacă merită.'],
      ['Ce tip de tablă se potrivește casei mele?', 'Vă explicăm diferențele dintre tabla tip țiglă, cutată și fălțuită și ce se potrivește acoperișului dumneavoastră.'],
      ['Oferta este gratuită?', 'Da. Venim, măsurăm și primiți oferta scrisă fără cost și fără obligații.']
    ]
  },
  {
    path: 'reparatii-acoperis',
    h1: 'Reparații acoperiș',
    zone: 'zj',
    title: 'Reparații acoperiș{z} – intervenții rapide | HidroAcoperiș',
    desc: 'Reparații acoperiș: infiltrații, țigle și tablă deteriorate, coame, dolii, urgențe după furtună. Răspundem în aceeași zi: 0742 431 066.',
    lead: 'Vă plouă în casă? Găsim cauza infiltrației și o reparăm repede, inclusiv după furtună.',
    wa: 'Bună ziua, am nevoie de o reparație la acoperiș.',
    svc: 'Reparații acoperiș',
    work: [
      ['Infiltrații', 'Pete pe tavan, picurare, pereți umezi: găsim sursa, nu doar simptomul.'],
      ['Țigle sparte sau deplasate', 'Înlocuim și fixăm țiglele afectate.'],
      ['Tablă desprinsă sau ruginită', 'Refixăm sau înlocuim panourile deteriorate.'],
      ['Coame și dolii', 'Refacem etanșarea coamelor și a doliilor.'],
      ['Coș de fum și străpungeri', 'Etanșăm racordurile la coș, aerisiri și ferestre de mansardă.'],
      ['Urgențe după furtună', 'Acoperiș ridicat de vânt, țigle căzute, tablă smulsă.']
    ],
    faq: [
      ['Veniți și pentru o reparație mică?', 'Da. Venim și pentru câteva țigle sau o singură infiltrație.'],
      ['Cât de repede puteți veni?', 'Răspundem în aceeași zi. La infiltrații și după furtună încercăm să venim cât mai repede.'],
      ['Ce fac până ajungeți?', 'Puneți un vas sub picurare, mutați lucrurile din zonă și, dacă puteți, faceți câteva poze. Trimiteți-ni-le pe WhatsApp și vă spunem ce urmează.'],
      ['Reparați și acoperișuri vechi?', 'Da. Vă spunem sincer dacă merită reparat sau dacă e mai bine de înlocuit.']
    ]
  },
  {
    path: 'hidroizolatii',
    h1: 'Hidroizolații cu bitum',
    zone: 'zj',
    title: 'Hidroizolații cu bitum{z} – ofertă gratuită | HidroAcoperiș',
    desc: 'Hidroizolații cu membrane bituminoase pentru terase, blocuri, hale și acoperișuri plate. 10 ani garanție. Ofertă gratuită: 0742 431 066.',
    lead: 'Hidroizolații cu membrane bituminoase pentru terase, blocuri și hale. Ofertă scrisă înainte de start.',
    trust: ['Ofertă gratuită', '10 ani garanție', 'Echipă proprie'],
    wa: 'Bună ziua, aș dori o ofertă pentru hidroizolație.',
    svc: 'Hidroizolații cu bitum',
    image: true,
    work: [
      ['Blocuri', 'Lucrări coordonate cu asociația de proprietari, fără să deranjăm locatarii.'],
      ['Terase', 'Terase circulabile și necirculabile, cu membrane rezistente la trafic și intemperii.'],
      ['Hale industriale', 'Suprafețe mari, termene stabilite clar, echipă pregătită pentru lucrări mari.'],
      ['Case cu acoperiș plat', 'Acoperișuri plate, balcoane și copertine.'],
      ['Garaje și anexe', 'Soluții durabile cu bitum pentru garaje, magazii și anexe.'],
      ['Reparații infiltrații', 'Găsim și remediem sursa infiltrației, nu doar simptomul.']
    ],
    faq: [
      ['Ce garanție oferiți?', 'Oferim 10 ani garanție pe lucrările de hidroizolație. Detaliile sunt trecute în scris, în ofertă.'],
      ['Prețul se schimbă după ce începe lucrarea?', 'Nu. Primiți oferta scrisă după evaluarea gratuită, înainte de începerea lucrării. Nu apar costuri ascunse.'],
      ['Lucrați și la blocuri sau hale mari?', 'Da, avem echipă și experiență pentru lucrări mari: acoperișuri de blocuri, terase mari și hale.'],
      ['Cât de repede puteți veni?', 'De obicei evaluarea are loc în 1–2 zile lucrătoare. La infiltrații urgente încercăm să venim chiar în aceeași zi.']
    ]
  },
  {
    path: 'sistem-pluvial',
    h1: 'Montaj jgheaburi și burlane',
    zone: 'zj',
    title: 'Montaj jgheaburi și burlane{z} – sistem pluvial | HidroAcoperiș',
    desc: 'Montaj, reparații și înlocuire jgheaburi și burlane. Etanșare îmbinări care curg. Ofertă gratuită la fața locului: 0742 431 066.',
    lead: 'Montăm, reparăm și înlocuim jgheaburi și burlane, ca apa să plece de pe casă, nu prin pereți și fundație.',
    wa: 'Bună ziua, aș dori o ofertă pentru jgheaburi și burlane.',
    svc: 'Sistem pluvial',
    work: [
      ['Sistem pluvial nou', 'Jgheaburi, burlane, cârlige și racorduri, montate cu panta corectă.'],
      ['Înlocuire jgheaburi vechi', 'Scoatem sistemul vechi și montăm unul nou.'],
      ['Îmbinări care curg', 'Etanșăm îmbinările, colțarele și capacele.'],
      ['Jgheaburi lăsate sau desprinse', 'Refixăm cârligele și refacem panta.'],
      ['Burlane desprinse', 'Prindem burlanele și refacem racordurile.'],
      ['Scurgere corectă', 'Verificăm ca apa să nu stagneze și să nu ajungă la fundație.']
    ],
    faq: [
      ['Reparați doar o porțiune de jgheab?', 'Da. Dacă restul sistemului e bun, reparăm doar porțiunea afectată.'],
      ['De ce curge apa pe lângă jgheab?', 'De obicei din cauza pantei greșite, a cârligelor lăsate sau a îmbinărilor neetanșe. Verificăm și remediem cauza.'],
      ['Vindeți jgheaburi?', 'Nu. Ne ocupăm de montaj și reparații. Vă spunem exact ce piese trebuie.'],
      ['Oferta este gratuită?', 'Da. Venim, vedem și primiți oferta fără cost și fără obligații.']
    ]
  }
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const waHref = msg => `${WA}?text=${encodeURIComponent(msg)}`;

function header(p) {
  const links = SERVICES.map(s => `<a href="/${s.slug}/">${esc(s.name)}</a>`).join('');
  return `<header class="hdr${p.home ? ' hdr-home' : ''}"><div class="wrap">
<a class="logo" href="/">Hidro<b>Acoperiș</b></a>
${p.home ? `<nav class="nav" aria-label="Servicii">${links}</nav>` : ''}
<div class="hdr-cta">
<a class="hdr-tel" href="tel:${TEL}" aria-label="Sunați: ${TEL_TXT}">${ICON.tel}<span>${TEL_TXT}</span></a>
<a class="hdr-wa" href="${waHref(p.wa)}" target="_blank" rel="noopener">${ICON.wa}<span>WhatsApp</span></a>
${p.home ? `<details class="mnav"><summary aria-label="Meniu"><span></span></summary><nav aria-label="Servicii">${links}</nav></details>` : ''}
</div></div></header>`;
}

function hero(p) {
  const trust = p.trust || ['Ofertă gratuită', 'Garanție la manoperă', 'Echipă proprie'];
  return `<section class="hero"><div class="wrap">
<h1>${esc(p.h1)}<span class="${p.zone}"></span></h1>
<p class="lead">${esc(p.lead)}</p>
<ul class="trust">${trust.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
<div class="btns">
<a class="btn btn-call" href="tel:${TEL}">${ICON.tel}Sună acum</a>
<a class="btn btn-wa" href="${waHref(p.wa)}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
<button type="button" class="btn btn-cb dsk" data-cb>${ICON.cb}Te sunăm noi</button>
</div>
<p class="same-day">Răspundem în aceeași zi · <button type="button" class="linkbtn" data-cb style="color:#fff">sau vă sunăm noi</button></p>
</div></section>`;
}

function work(p) {
  if (p.home) {
    return `<section class="sec soft" id="servicii"><div class="wrap">
<h2>Serviciile noastre</h2>
<div class="cards">${SERVICES.map(s => `<a class="card" href="/${s.slug}/"><h3>${esc(s.name)}</h3><p>${esc(s.card)}</p><span class="more">Detalii și ofertă →</span></a>`).join('')}</div>
</div></section>`;
  }
  const img = p.image ? `<figure class="photo"><img src="/assets/img/hidroizolatie-760.webp" srcset="/assets/img/hidroizolatie-480.webp 480w, /assets/img/hidroizolatie-760.webp 760w" sizes="(min-width:1080px) 760px, 100vw" width="760" height="475" loading="lazy" decoding="async" alt="Terasă cu hidroizolație din membrană bituminoasă"></figure>` : '';
  return `<section class="sec soft"><div class="wrap">
<h2>Ce facem</h2>
${img}
<ul class="list">${p.work.map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('')}</ul>
</div></section>
<!-- POZE LUCRĂRI: scoateți atributul hidden și adăugați poze reale (înainte/după), format WebP, cu width/height și loading="lazy". -->
<section class="sec" hidden><div class="wrap"><h2>Lucrări realizate</h2><div class="cards"></div></div></section>`;
}

function steps() {
  return `<section class="sec"><div class="wrap">
<h2>Cum lucrăm</h2>
<ol class="steps">${STEPS.map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('')}</ol>
</div></section>`;
}

function why() {
  return `<section class="sec soft"><div class="wrap">
<h2>De ce noi</h2>
<div class="why">${WHY.map(([b, s]) => `<div><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('')}</div>
</div></section>`;
}

function faq(p) {
  return `<section class="sec faq"><div class="wrap">
<h2>Întrebări frecvente</h2>
${p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
</div></section>`;
}

function final(p) {
  return `<section class="sec final"><div class="wrap">
<h2>Cereți oferta gratuită</h2>
<p>Sunați-ne, scrieți-ne pe WhatsApp sau lăsați numărul și vă sunăm noi. Răspundem în aceeași zi.</p>
<div class="btns">
<a class="btn btn-call" href="tel:${TEL}">${ICON.tel}Sună acum</a>
<a class="btn btn-wa" href="${waHref(p.wa)}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
<button type="button" class="btn btn-cb" data-cb>${ICON.cb}Te sunăm noi</button>
</div>
<a class="tel-big" href="tel:${TEL}">${TEL_TXT}</a>
</div></section>`;
}

function footer() {
  return `<footer class="ftr"><div class="wrap">
<div class="cols">
<div><h2 class="fh">HidroAcoperiș</h2><p style="margin:0 0 8px">Montaj și reparații acoperișuri în județele Mureș, Cluj și Sibiu.</p><a href="tel:${TEL}">${TEL_TXT}</a></div>
<div><h2 class="fh">Servicii</h2><ul>${SERVICES.map(s => `<li><a href="/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul></div>
<div><h2 class="fh">Firmă</h2><ul><li>Meisterdach GmbH SRL</li><li>CUI RO51313339</li><li><button type="button" class="linkbtn" data-legal>Informații legale</button></li><li><button type="button" class="linkbtn" data-cookies>Setări cookies</button></li></ul></div>
</div>
<div class="copy"><span>© ${new Date().getFullYear()} HidroAcoperiș · Meisterdach GmbH SRL</span></div>
</div></footer>`;
}

function bar(p) {
  return `<nav class="bar" aria-label="Contact rapid">
<a class="b-call" href="tel:${TEL}">${ICON.tel}Sună</a>
<a class="b-wa" href="${waHref(p.wa)}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
<button type="button" class="b-cb" data-cb>${ICON.cb}Te sunăm noi</button>
</nav>`;
}

function dialogs(p) {
  const select = p.home ? `<div class="fld"><label for="cb-lucrare">Ce lucrare? <small>(opțional)</small></label>
<select id="cb-lucrare" name="lucrare"><option value="">Alegeți…</option>${SERVICES.map(s => `<option>${esc(s.name)}</option>`).join('')}<option>Altceva</option></select></div>` : '';
  return `<dialog id="cb" aria-labelledby="cb-h"><div class="dlg">
<button type="button" class="x" data-close aria-label="Închide">×</button>
<h3 id="cb-h">Vă sunăm noi</h3>
<p class="sub" id="cb-sub">Lăsați numărul și vă sunăm în cel mai scurt timp.</p>
<form novalidate>
<div class="fld"><label for="cb-tel">Telefon</label><input id="cb-tel" name="telefon" type="tel" inputmode="tel" autocomplete="tel" placeholder="07xx xxx xxx" required aria-describedby="cb-err"><p class="err" id="cb-err" aria-live="polite"></p></div>
<div class="fld"><label for="cb-nume">Nume <small>(opțional)</small></label><input id="cb-nume" name="nume" type="text" autocomplete="name"></div>
${select}
<div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
<div id="ts"></div>
<div class="fail" hidden>Nu am putut trimite cererea. Vă rugăm sunați-ne direct sau scrieți-ne pe WhatsApp:
<a class="btn btn-call" style="margin-top:10px;width:100%" href="tel:${TEL}">${ICON.tel}${TEL_TXT}</a>
<a class="btn btn-wa" style="margin-top:8px;width:100%" href="${waHref(p.wa)}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a></div>
<button type="submit" class="btn btn-call">Sunați-mă înapoi</button>
<p class="note">Folosim numărul doar ca să vă sunăm pentru această cerere.</p>
</form>
<div class="ok" hidden><div class="ic">✓</div><h3 style="padding:0">Mulțumim!</h3><p class="sub">Vă sunăm în cel mai scurt timp.</p><button type="button" class="btn btn-cb" data-close>Închide</button></div>
</div></dialog>
<dialog id="exit" aria-labelledby="exit-h"><div class="dlg">
<button type="button" class="x" data-close aria-label="Închide">×</button>
<h3 id="exit-h">Aveți o întrebare despre acoperiș?</h3>
<p class="sub">Vorbiți direct cu noi. Oferta e gratuită și fără obligații.</p>
<a class="btn btn-call" href="tel:${TEL}">${ICON.tel}Sună acum: ${TEL_TXT}</a>
<a class="btn btn-wa" href="${waHref(p.wa)}" target="_blank" rel="noopener">${ICON.wa}Scrie pe WhatsApp</a>
<button type="button" class="btn btn-cb" data-cb>${ICON.cb}Te sunăm noi</button>
</div></dialog>
<dialog id="legal" aria-labelledby="legal-h"><div class="dlg legal">
<button type="button" class="x" data-close aria-label="Închide">×</button>
<h3 id="legal-h">Informații legale</h3>
<dl>
<dt>Denumire societate</dt><dd>Meisterdach GmbH SRL</dd>
<dt>Date de înregistrare</dt><dd>CUI: RO51313339<br>Nr. Reg. Com.: J2025011664001<br>EUID: ROONRC.J2025011664001<br>Data înregistrării: 18.02.2025</dd>
<dt>Sediu social</dt><dd>Sat Bolintineni, nr. 6/A, 547456, Județul Mureș, România</dd>
<dt>Reprezentant legal</dt><dd>R. Rostas (Administrator)</dd>
<dt>Contact</dt><dd>Telefon: <a href="tel:${TEL}">${TEL_TXT}</a></dd>
<dt>Cookies</dt><dd>Folosim cookie-uri Google Ads pentru măsurarea anunțurilor doar dacă vă dați acordul. Puteți schimba alegerea oricând din „Setări cookies”.</dd>
</dl>
</div></dialog>
<div class="ck" id="ck" hidden role="region" aria-label="Cookies">
<p>Folosim cookie-uri pentru a măsura eficiența anunțurilor noastre. Sunteți de acord?</p>
<div class="row"><button type="button" class="ref">Refuz</button><button type="button" class="acc">Accept</button></div>
</div>`;
}

function jsonLd(p) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: 'HidroAcoperiș',
    legalName: 'Meisterdach GmbH SRL',
    telephone: TEL,
    url: SITE + '/' + (p.path ? p.path + '/' : ''),
    address: { '@type': 'PostalAddress', streetAddress: 'Sat Bolintineni, nr. 6/A', postalCode: '547456', addressRegion: 'Mureș', addressCountry: 'RO' },
    areaServed: ['Județul Mureș', 'Județul Cluj', 'Județul Sibiu'].map(n => ({ '@type': 'AdministrativeArea', name: n })),
    vatID: 'RO51313339'
  };
  if (!p.home) data.makesOffer = { '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.h1 } };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function page(p) {
  const url = SITE + '/' + (p.path ? p.path + '/' : '');
  const title = p.title.replace('{z}', '');
  return `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0f1d2e">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230f1d2e'/%3E%3Cpath d='M5 17 16 7l11 10h-3v8H8v-8z' fill='%23e8590c'/%3E%3C/svg%3E">
<script>${headJs}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${AW}"></script>
<style>${css}</style>
${jsonLd(p)}
</head>
<body data-wa="${esc(p.wa)}" data-svc="${esc(p.svc)}" data-title="${esc(p.title)}">
${header(p)}
<main>
${hero(p)}
${work(p)}
${steps()}
${why()}
${faq(p)}
${final(p)}
</main>
${footer()}
${bar(p)}
${dialogs(p)}
<script src="/assets/site.js?v=${VER}" defer></script>
</body>
</html>
`;
}

for (const p of PAGES) {
  const file = join(ROOT, 'public', p.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(p));
  console.log('scris', file.replace(ROOT + '/', ''));
}
