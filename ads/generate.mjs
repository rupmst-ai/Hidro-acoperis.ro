// Generează fișierele CSV pentru Google Ads Editor (Cont → Import → Din fișier).
// Rulare: node ads/generate.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'csv');
mkdirSync(OUT, { recursive: true });
const SITE = 'https://hidro-acoperis.ro';

// Buget zilnic în moneda contului: de verificat înainte de activare.
const COUNTIES = [
  { key: 'mures', name: 'Mureș', loc: 'Mures County, Romania', budget: 20, cities: ['targu mures', 'reghin', 'sighisoara', 'tarnaveni'], city1: 'Târgu Mureș' },
  { key: 'cluj', name: 'Cluj', loc: 'Cluj County, Romania', budget: 25, cities: ['cluj', 'cluj napoca', 'floresti', 'turda', 'dej', 'gherla'], city1: 'Cluj-Napoca' },
  { key: 'sibiu', name: 'Sibiu', loc: 'Sibiu County, Romania', budget: 20, cities: ['sibiu', 'medias', 'cisnadie', 'avrig'], city1: 'Sibiu' }
];

// Ore în fusul contului (Germania) = ora României minus 1. RO: L–S 07–20.
const SCHEDULE = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  .map(d => `(${d}[06:00-19:00])`).join(';');

const GROUPS = [
  { name: 'Reparatii acoperis', path: 'reparatii-acoperis', p1: 'reparatii',
    pin: z => `Reparații Acoperiș în ${z}`, city: c => `Reparații Acoperiș ${c}`,
    heads: ['Acoperișul Curge? Sunați-ne', 'Reparăm Infiltrații Rapid', 'Reparații Țiglă și Tablă'],
    kw: ['reparatii acoperis', 'reparatie acoperis', 'acoperis curge', 'infiltratii acoperis', 'firma acoperisuri', 'dulgher acoperis', 'tinichigiu', 'reparatii acoperisuri case'],
    citykw: ['reparatii acoperis', 'firma acoperisuri'],
    d: 'Acoperiș care curge? Venim să vedem și vă spunem clar ce trebuie făcut. Ofertă gratuită.' },
  { name: 'Acoperis nou', path: 'acoperis-nou', p1: 'acoperis-nou',
    pin: z => `Montaj Acoperiș Nou în ${z}`, city: c => `Acoperiș Nou în ${c}`,
    heads: ['Înlocuire Acoperiș Vechi', 'Structură Lemn și Învelitoare', 'Acoperiș Complet la Cheie'],
    kw: ['acoperis nou', 'montaj acoperis', 'inlocuire acoperis', 'refacere acoperis', 'constructie acoperis', 'acoperis casa'],
    citykw: ['montaj acoperis', 'acoperis nou'],
    d: 'Acoperiș nou complet: structură din lemn și învelitoare. Înlocuim și acoperișuri vechi.' },
  { name: 'Montaj tabla', path: 'montaj-tabla', p1: 'montaj-tabla',
    pin: z => `Montaj Tablă în ${z}`, city: c => `Montaj Tablă în ${c}`,
    heads: ['Montaj Tablă Tip Țiglă', 'Tablă Cutată și Fălțuită', 'Montaj cu Toate Accesoriile'],
    kw: ['montaj tabla', 'montaj tigla metalica', 'montaj tabla acoperis', 'montaj tabla faltuita', 'montator tabla'],
    citykw: ['montaj tabla'],
    d: 'Montaj tablă tip țiglă, cutată și fălțuită, cu toate accesoriile. Echipă proprie.' },
  { name: 'Hidroizolatii', path: 'hidroizolatii', p1: 'hidroizolatii',
    pin: z => `Hidroizolații în ${z}`, city: c => `Hidroizolații în ${c}`,
    heads: ['10 Ani Garanție Hidroizolații', 'Hidroizolații cu Bitum', 'Terase, Blocuri și Hale'],
    kw: ['hidroizolatie terasa', 'hidroizolatie bloc', 'hidroizolatie acoperis', 'hidroizolatii', 'membrana bituminoasa montaj', 'hidroizolatie acoperis plat'],
    citykw: ['hidroizolatii', 'hidroizolatie terasa'],
    d: 'Hidroizolații cu membrane bituminoase pentru terase, blocuri și hale. 10 ani garanție.' },
  { name: 'Jgheaburi', path: 'sistem-pluvial', p1: 'jgheaburi',
    pin: z => `Jgheaburi și Burlane în ${z}`, city: c => `Jgheaburi în ${c}`,
    heads: ['Montaj Jgheaburi și Burlane', 'Reparăm Jgheaburi Care Curg', 'Sistem Pluvial Complet'],
    kw: ['montaj jgheaburi', 'reparatii jgheaburi', 'montaj burlane', 'jgheaburi si burlane montaj', 'inlocuire jgheaburi'],
    citykw: ['montaj jgheaburi'],
    d: 'Montaj, reparații și înlocuire jgheaburi și burlane. Etanșăm îmbinările care curg.' }
];

const COMMON = z => [
  `Acoperișuri în Județul ${z}`,
  'Venim Gratuit la Fața Locului',
  'Ofertă Scrisă, Fără Obligații',
  'Echipă Proprie de Acoperișuri',
  'Garanție Scrisă la Manoperă',
  'Răspundem în Aceeași Zi',
  'Fără Costuri Ascunse',
  'Sunați Acum Pentru Ofertă'
];
const DESC = z => [
  `Montaj și reparații acoperișuri în județul ${z}. Venim, măsurăm, primiți oferta gratuită.`,
  'Echipă proprie, garanție scrisă la manoperă, fără costuri ascunse. Sunați sau scrieți-ne.',
  'Ofertă scrisă înainte de începerea lucrării. Răspundem în aceeași zi.'
];

const NEG = ['angajare', 'locuri de munca', 'job', 'joburi', 'curs', 'cum sa', 'tutorial', 'singur', 'youtube', 'pdf', 'proiect', 'autocad', 'desen',
  'dedeman', 'hornbach', 'leroy merlin', 'brico', 'olx', 'emag', 'vand', 'vanzare', 'cumpar', 'depozit', 'second hand', 'folosit', 'gratis',
  'fundatie', 'subsol', 'piscina', 'baie', 'auto', 'masina'];

const cmp = c => `RO - ${c.name} - Search`;
const camp = c => `${cmp(c)}`;
const url = (g, c) => `${SITE}/${g.path}/`;

// ---------- CSV ----------
const errors = [];
function csv(file, headers, rows) {
  const q = v => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
  const body = [headers.join(','), ...rows.map(r => headers.map(h => q(r[h])).join(','))].join('\r\n');
  writeFileSync(join(OUT, file), '﻿' + body + '\r\n');
  console.log(file, rows.length, 'rânduri');
}
const chk = (s, max, what) => { if ([...s].length > max) errors.push(`${what} prea lung (${[...s].length}>${max}): ${s}`); return s; };

// 1. Campanii
csv('1-campanii.csv',
  ['Campaign', 'Campaign Type', 'Networks', 'Budget', 'Budget type', 'Bid Strategy Type', 'Languages', 'Ad Schedule', 'Final URL suffix', 'Campaign Status'],
  COUNTIES.map(c => ({
    'Campaign': camp(c), 'Campaign Type': 'Search', 'Networks': 'Google search', 'Budget': c.budget, 'Budget type': 'Daily',
    'Bid Strategy Type': 'Maximize clicks', 'Languages': 'All', 'Ad Schedule': SCHEDULE,
    'Final URL suffix': `judet=${c.key}`, 'Campaign Status': 'Paused'
  })));

// 2. Locații
csv('2-locatii.csv', ['Campaign', 'Location'], COUNTIES.map(c => ({ Campaign: camp(c), Location: c.loc })));

// 3. Grupuri de anunțuri
const ag = [];
for (const c of COUNTIES) for (const g of GROUPS) ag.push({ Campaign: camp(c), 'Ad Group': g.name, 'Ad Group Status': 'Enabled' });
csv('3-grupuri.csv', ['Campaign', 'Ad Group', 'Ad Group Status'], ag);

// 4. Cuvinte cheie
const kws = [];
for (const c of COUNTIES) for (const g of GROUPS) {
  const seen = new Set();
  const add = (k, t) => { const id = k + t; if (seen.has(id)) return; seen.add(id); kws.push({ Campaign: camp(c), 'Ad Group': g.name, Keyword: k, 'Criterion Type': t }); };
  for (const k of g.kw) { add(k, 'Phrase'); add(k, 'Exact'); }
  for (const k of g.citykw) for (const city of c.cities) add(`${k} ${city}`, 'Phrase');
}
csv('4-cuvinte-cheie.csv', ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type'], kws);

// 5. Cuvinte negative (la nivel de campanie)
const negs = [];
for (const c of COUNTIES) for (const k of NEG) negs.push({ Campaign: camp(c), Keyword: k, 'Criterion Type': 'Campaign Negative Broad' });
csv('5-negative.csv', ['Campaign', 'Keyword', 'Criterion Type'], negs);

// 6. Anunțuri RSA
const H = Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`);
const D = Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`);
const ads = [];
for (const c of COUNTIES) for (const g of GROUPS) {
  const pinned = chk(g.pin(c.name), 30, 'Titlu');
  const heads = [pinned, ...g.heads, ...COMMON(c.name)];
  const cityHead = g.city(c.city1);
  if (c.city1 !== c.name && [...cityHead].length <= 30) heads.splice(1, 0, cityHead);
  const descs = [g.d, ...DESC(c.name)];
  const r = { Campaign: camp(c), 'Ad Group': g.name, 'Ad type': 'Responsive search ad', 'Final URL': url(g, c),
    'Path 1': chk(g.p1, 15, 'Cale'), 'Path 2': chk(c.key, 15, 'Cale'), 'Headline 1 position': 1, Status: 'Enabled' };
  heads.slice(0, 15).forEach((h, i) => r[H[i]] = chk(h, 30, 'Titlu'));
  descs.slice(0, 4).forEach((d, i) => r[D[i]] = chk(d, 90, 'Descriere'));
  ads.push(r);
}
csv('6-anunturi.csv', ['Campaign', 'Ad Group', 'Ad type', ...H, 'Headline 1 position', ...D, 'Path 1', 'Path 2', 'Final URL', 'Status'], ads);

// 7. Sitelinks
const SL = [
  ['Reparații acoperiș', 'reparatii-acoperis', 'Infiltrații, țiglă, tablă', 'Venim să vedem gratuit'],
  ['Acoperiș nou', 'acoperis-nou', 'Structură și învelitoare', 'Înlocuim acoperișuri vechi'],
  ['Montaj tablă', 'montaj-tabla', 'Tip țiglă, cutată, fălțuită', 'Cu toate accesoriile'],
  ['Hidroizolații', 'hidroizolatii', 'Terase, blocuri și hale', '10 ani garanție'],
  ['Jgheaburi și burlane', 'sistem-pluvial', 'Montaj și reparații', 'Etanșăm îmbinările']
];
const sl = [];
for (const c of COUNTIES) for (const [t, p, d1, d2] of SL)
  sl.push({ Campaign: camp(c), 'Link Text': chk(t, 25, 'Sitelink'), 'Description Line 1': chk(d1, 35, 'Sitelink desc'), 'Description Line 2': chk(d2, 35, 'Sitelink desc'), 'Final URL': `${SITE}/${p}/` });
csv('7-sitelinks.csv', ['Campaign', 'Link Text', 'Description Line 1', 'Description Line 2', 'Final URL'], sl);

// 8. Callouts
const CO = ['Ofertă gratuită', 'Echipă proprie', 'Garanție scrisă', 'Fără costuri ascunse', 'Răspundem în aceeași zi', 'Venim la fața locului'];
const co = [];
for (const c of COUNTIES) for (const t of CO) co.push({ Campaign: camp(c), 'Callout text': chk(t, 25, 'Callout') });
csv('8-callouts.csv', ['Campaign', 'Callout text'], co);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('OK – toate textele respectă limitele Google.');
