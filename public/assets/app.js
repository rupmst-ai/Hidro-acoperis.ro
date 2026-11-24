/* HidroAcoperiș – script comun (copie a site-ului din Polonia, dachjetz.de/pl).
   Conversii Google Ads în contul nou (AW-18589674615). Notificări Telegram prin dachjetz.de/notify. */
(function () {
  'use strict';

  var AW = 'AW-18589674615';
  var LABEL = {
    whatsapp: 'x-wSCILiub0dEPfYn6BF',
    tel: 'x-wSCILiub0dEPfYn6BF',
    form: 'x-wSCILiub0dEPfYn6BF'
  };
  var FORM_URL = 'https://formspree.io/f/xvzbwbrj';
  var NOTIFY_URL = 'https://dachjetz.de/notify';
  var THANKS_URL = '/multumim/';
  var CONSENT_KEY = 'ro_consent_v1';
  var TEL_TXT = '0742 431 066';

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  function conv(label, cb) {
    var o = { send_to: AW + '/' + label };
    if (cb) { o.event_callback = cb; o.event_timeout = 1500; }
    window.gtag('event', 'conversion', o);
  }

  /* ---- gtag.js ---- */
  var gtagLoaded = false;
  function loadGtag() {
    if (gtagLoaded) return;
    gtagLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW;
    document.head.appendChild(s);
  }

  /* ---- Acord cookies (Google Consent Mode v2) ---- */
  function readConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }
  function applyConsent(c) {
    var ads = c.marketing ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
      analytics_storage: c.analytics ? 'granted' : 'denied'
    });
  }
  function saveConsent(c) {
    c.t = Date.now();
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (e) {}
    applyConsent(c);
  }

  var banner;
  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'ck';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Setări cookies');
    banner.innerHTML =
      '<h2>Vă respectăm confidențialitatea</h2>' +
      '<p>Folosim cookie-uri ca să măsurăm eficiența anunțurilor Google și să îmbunătățim site-ul. ' +
      'Le puteți accepta pe toate, le puteți refuza sau puteți alege. ' +
      'Detalii în <a href="/confidentialitate/">politica de confidențialitate</a>.</p>' +
      '<div class="ck-set" id="ckSet">' +
        '<label><input type="checkbox" checked disabled> <span><b>Necesare</b> – pentru funcționarea site-ului.</span></label>' +
        '<label><input type="checkbox" id="ckAn"> <span><b>Statistice</b> – statistici despre vizite.</span></label>' +
        '<label><input type="checkbox" id="ckMk"> <span><b>Marketing</b> – măsurarea anunțurilor Google Ads.</span></label>' +
      '</div>' +
      '<div class="ck-btns">' +
        '<button type="button" class="ck-yes" data-ck="all">Accept toate</button>' +
        '<button type="button" data-ck="none">Refuz</button>' +
        '<button type="button" data-ck="set">Setări</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]');
      if (!b) return;
      var a = b.getAttribute('data-ck');
      var set = banner.querySelector('#ckSet');
      if (a === 'all') { saveConsent({ analytics: true, marketing: true }); hideBanner(); }
      else if (a === 'none') { saveConsent({ analytics: false, marketing: false }); hideBanner(); }
      else if (a === 'set') {
        if (!set.classList.contains('on')) {
          set.classList.add('on');
          b.textContent = 'Salvează alegerea';
        } else {
          saveConsent({
            analytics: banner.querySelector('#ckAn').checked,
            marketing: banner.querySelector('#ckMk').checked
          });
          hideBanner();
        }
      }
    });
  }
  function showBanner(withSettings) {
    if (!banner) buildBanner();
    var c = readConsent();
    if (c) {
      banner.querySelector('#ckAn').checked = !!c.analytics;
      banner.querySelector('#ckMk').checked = !!c.marketing;
    }
    if (withSettings) {
      banner.querySelector('#ckSet').classList.add('on');
      banner.querySelector('[data-ck="set"]').textContent = 'Salvează alegerea';
    }
    banner.classList.add('on');
  }
  function hideBanner() { if (banner) banner.classList.remove('on'); }

  /* ---- Meniu mobil ---- */
  function initNav() {
    var btn = document.getElementById('hbg');
    var nav = document.getElementById('nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Click WhatsApp / telefon ---- */
  function linkZ(e) {
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentNode;
    if (t && t.correspondingUseElement) t = t.correspondingUseElement;
    return t && t.closest ? t.closest('a[href]') : null;
  }
  function initClicks() {
    document.addEventListener('pointerup', function (e) {
      var a = linkZ(e);
      if (a && (a.getAttribute('href') || '').trim().toLowerCase().indexOf('tel:') === 0) tg('call');
    }, true);
    document.addEventListener('click', function (e) {
      var a = linkZ(e);
      if (!a) return;
      var h = (a.getAttribute('href') || '').trim().toLowerCase();
      if (h.indexOf('tel:') === 0) { tg('call'); loadGtag(); conv(LABEL.tel); }
      else if (/^(https?:)?\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//.test(h) || h.indexOf('whatsapp://') === 0) {
        tg('whatsapp'); loadGtag(); conv(LABEL.whatsapp);
      }
      else if (a.hasAttribute('data-cookies')) { e.preventDefault(); showBanner(true); }
    }, true);
  }

  /* ---- Formular ---- */
  function initForms() {
    document.querySelectorAll('form.js-lead').forEach(function (f) {
      var err = f.querySelector('.form-err');
      var btn = f.querySelector('button[type="submit"]');
      function fail(msg) { err.textContent = msg; err.style.display = 'block'; }

      f.addEventListener('submit', function (e) {
        e.preventDefault();
        err.style.display = 'none';
        var tel = f.querySelector('[name="telefon"]');
        if (tel.value.replace(/\D/g, '').length < 9) {
          fail('Vă rugăm să scrieți un număr de telefon corect.');
          tel.focus();
          return;
        }
        if (!f.checkValidity()) { f.reportValidity(); return; }

        var fd = new FormData(f);
        fd.append('_subject', 'RO – cerere nouă: ' + (fd.get('tip_lucrare') || '') + ' – ' + (fd.get('localitate') || ''));
        fd.append('versiune', 'RO (' + REGION_NAZWA + ')');
        fd.append('pagina', location.pathname);
        fd.append('gclid', CTX.gclid);
        fd.append('campanie', CTX.campaign);

        btn.disabled = true;
        var oldTxt = btn.textContent;
        btn.textContent = 'Se trimite…';

        fetch(FORM_URL, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            tg('form', {
              nume: fd.get('nume') || '', telefon: fd.get('telefon') || '',
              adres: fd.get('localitate') || '', problem: fd.get('tip_lucrare') || ''
            });
            var poszlo = false;
            function dalej() { if (poszlo) return; poszlo = true; location.href = THANKS_URL; }
            loadGtag();
            conv(LABEL.form, dalej);
            setTimeout(dalej, 1600);
          })
          .catch(function () {
            btn.disabled = false;
            btn.textContent = oldTxt;
            fail('Formularul nu a putut fi trimis. Scrieți-ne pe WhatsApp sau sunați: ' + TEL_TXT + '.');
          });
      });
    });
  }

  /* ---- Zona din campanie: parametrul region=... din adresă ----
     Implicit București. Campania Cluj are în Google Ads region=cluj. */
  var REGIONY = {
    bucuresti: ['București', 'în București'],
    ilfov:     ['Ilfov', 'în Ilfov'],
    cluj:      ['Cluj-Napoca', 'în Cluj-Napoca']
  };

  /* Localități din cuvântul cheie (parametrul kw=... din Google Ads).
     Cine caută „reparatii acoperis floresti” vede Florești. Cheile sunt fără diacritice. */
  function L(n) { return [n, 'în ' + n]; }
  var MIASTA = {
    /* București și Ilfov */
    'bucuresti': L('București'), 'bucurești': L('București'),
    'sector 1': L('Sectorul 1'), 'sectorul 1': L('Sectorul 1'),
    'sector 2': L('Sectorul 2'), 'sectorul 2': L('Sectorul 2'),
    'sector 3': L('Sectorul 3'), 'sectorul 3': L('Sectorul 3'),
    'sector 4': L('Sectorul 4'), 'sectorul 4': L('Sectorul 4'),
    'sector 5': L('Sectorul 5'), 'sectorul 5': L('Sectorul 5'),
    'sector 6': L('Sectorul 6'), 'sectorul 6': L('Sectorul 6'),
    'ilfov': L('Ilfov'),
    'voluntari': L('Voluntari'),
    'otopeni': L('Otopeni'),
    'pantelimon': L('Pantelimon'),
    'popesti leordeni': L('Popești-Leordeni'),
    'bragadiru': L('Bragadiru'),
    'chiajna': L('Chiajna'),
    'buftea': L('Buftea'),
    'magurele': L('Măgurele'),
    'chitila': L('Chitila'),
    'corbeanca': L('Corbeanca'),
    'snagov': L('Snagov'),
    'stefanestii de jos': L('Ștefăneștii de Jos'),
    'berceni': L('Berceni'),
    'domnesti': L('Domnești'),
    'mogosoaia': L('Mogoșoaia'),
    'jilava': L('Jilava'),
    'glina': L('Glina'),
    'cernica': L('Cernica'),
    'tunari': L('Tunari'),
    'balotesti': L('Balotești'),
    'afumati': L('Afumați'),
    'dobroesti': L('Dobroești'),
    'clinceni': L('Clinceni'),
    'cornetu': L('Cornetu'),
    'darasti': L('Dărăști-Ilfov'),
    'ciorogarla': L('Ciorogârla'),
    'dragomiresti vale': L('Dragomirești-Vale'),
    'moara vlasiei': L('Moara Vlăsiei'),
    'gruiu': L('Gruiu'),
    'peris': L('Periș'),
    'ciolpani': L('Ciolpani'),
    'brănești': L('Brănești'), 'branesti': L('Brănești'),
    '1 decembrie': L('1 Decembrie'),
    'giurgiu': L('Giurgiu'),
    'oltenita': L('Oltenița'),
    'urziceni': L('Urziceni'),
    'ploiesti': L('Ploiești'),
    /* Cluj */
    'cluj': L('Cluj-Napoca'),
    'cluj napoca': L('Cluj-Napoca'),
    'floresti': L('Florești'),
    'baciu': L('Baciu'),
    'apahida': L('Apahida'),
    'gilau': L('Gilău'),
    'feleacu': L('Feleacu'),
    'turda': L('Turda'),
    'campia turzii': L('Câmpia Turzii'),
    'dej': L('Dej'),
    'gherla': L('Gherla'),
    'huedin': L('Huedin'),
    'jucu': L('Jucu'),
    'bontida': L('Bonțida'),
    'ciurila': L('Ciurila'),
    'aiton': L('Aiton'),
    'chinteni': L('Chinteni'),
    'tureni': L('Tureni'),
    'vultureni': L('Vultureni'),
    'sannicoara': L('Sânnicoară'),
    'luna de sus': L('Luna de Sus'),
    'savadisla': L('Săvădisla'),
    'petrestii de jos': L('Petreștii de Jos'),
    'cojocna': L('Cojocna'),
    'bonchida': L('Bonțida'),
    'borsa': L('Borșa'),
    'mihai viteazu': L('Mihai Viteazu'),
    'caianu': L('Căianu'),
    'iclod': L('Iclod'),
    'garbau': L('Gârbău'),
    'baisoara': L('Băișoara'),
    'belis': L('Beliș'),
    'manastireni': L('Mănăstireni'),
    'sancraiu': L('Sâncraiu')
  };
  var REGION_NAZWA = 'București';
  var MIASTO_NAZWA = '';

  /* ---- Notificare pe Telegram (dachjetz.de/notify) ---- */
  function sesja(n, key) {
    var v = '';
    try { v = new URLSearchParams(location.search).get(n) || ''; } catch (e) {}
    try {
      if (v) sessionStorage.setItem(key, v);
      else v = sessionStorage.getItem(key) || '';
    } catch (e) {}
    return v;
  }
  var CTX = {
    kw:       sesja('kw', 'ro_kw'),
    campaign: sesja('gad_campaignid', 'ro_camp'),
    device:   sesja('device', 'ro_dev'),
    gclid:    sesja('gclid', 'ro_gclid') || sesja('gbraid', 'ro_gbraid') || sesja('wbraid', 'ro_wbraid'),
    source:   sesja('utm_source', 'ro_src')
  };
  if (!CTX.source) {
    try {
      var rh = document.referrer ? new URL(document.referrer).hostname : '';
      if (rh && rh.indexOf('hidro-acoperis.ro') === -1) { CTX.source = rh; sessionStorage.setItem('ro_src', rh); }
    } catch (e) {}
  }
  var lastTg = {};
  function tg(type, lead) {
    var now = Date.now();
    if (!lead && lastTg[type] && now - lastTg[type] < 10000) return;
    lastTg[type] = now;
    var ua = navigator.userAgent;
    var body = JSON.stringify({
      type:     type,
      lead:     lead || undefined,
      town:     MIASTO_NAZWA || REGION_NAZWA,
      kw:       CTX.kw,
      campaign: CTX.campaign,
      device:   CTX.device || (/iPad|Tablet/i.test(ua) ? 't' : /Mobi|Android|iPhone/i.test(ua) ? 'm' : 'c'),
      gclid:    CTX.gclid,
      page:     location.pathname,
      source:   CTX.source
    });
    /* text/plain: cerere simplă către alt domeniu, fără verificare CORS prealabilă. */
    var ok = false;
    try { ok = !!(navigator.sendBeacon && navigator.sendBeacon(NOTIFY_URL, new Blob([body], { type: 'text/plain;charset=UTF-8' }))); } catch (e) {}
    if (!ok) {
      try {
        fetch(NOTIFY_URL, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: body })
          .catch(function () {});
      } catch (e2) {}
    }
  }

  function bezDiacritice(t) {
    t = String(t || '').toLowerCase();
    try { t = t.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) {}
    return t.replace(/[^a-z0-9]+/g, ' ').replace(/^ +| +$/g, '');
  }

  function zapisz(klucz, wart) {
    try {
      if (wart) sessionStorage.setItem(klucz, wart);
      else wart = sessionStorage.getItem(klucz) || '';
    } catch (e) {}
    return wart;
  }

  function regionKey() {
    var k = '';
    try { k = new URLSearchParams(location.search).get('region') || ''; } catch (e) {}
    return zapisz('ro_region', bezDiacritice(k).replace(/ /g, '-').slice(0, 40));
  }

  /* Localitatea din cuvântul cheie: cea mai lungă potrivire. */
  function miastoKey() {
    var kw = '';
    try { kw = new URLSearchParams(location.search).get('kw') || ''; } catch (e) {}
    kw = ' ' + bezDiacritice(kw) + ' ';
    if (kw.length <= 2) {
      /* Click nou pe anunț fără cuvânt: localitatea de dinainte nu mai contează. */
      var nowe = false;
      try { nowe = !!new URLSearchParams(location.search).get('region'); } catch (e) {}
      if (nowe) { try { sessionStorage.removeItem('ro_miasto'); } catch (e) {} return ''; }
      return zapisz('ro_miasto', '');
    }
    var best = '';
    for (var m in MIASTA) {
      if (MIASTA.hasOwnProperty(m) && m.length > best.length && kw.indexOf(' ' + bezDiacritice(m) + ' ') !== -1) best = m;
    }
    try {
      if (best) sessionStorage.setItem('ro_miasto', best);
      else sessionStorage.removeItem('ro_miasto');
    } catch (e) {}
    return best;
  }

  /* Ordinea: 1) localitatea din cuvântul cheie (kw), 2) zona campaniei (region=bucuresti / region=cluj),
     3) fără schimbări: „București și împrejurimi”. */
  function applyRegion() {
    var k = regionKey();
    var m = miastoKey();
    var r = MIASTA[m] || null;
    if (r) MIASTO_NAZWA = r[0];
    if (!r) {
      if (!k || k === 'bucuresti') return;
      r = REGIONY[k];
      if (!r) {
        var n = k.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
        r = L(n);
      }
    }
    podmien(r);
  }

  function podmien(r) {
    REGION_NAZWA = r[0];
    var locU = 'Î' + r[1].slice(1);
    function zam(t) {
      /* O singură trecere: textul nou nu mai e înlocuit încă o dată. */
      return t.replace(/[Îî]n București|București/g, function (x) {
        return x === 'în București' ? r[1] : x === 'În București' ? locU : r[0];
      });
    }
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node, list = [];
    while ((node = w.nextNode())) {
      /* Lista de localități [data-stale] și adresa ANSPDCP rămân neschimbate. */
      if (/București/.test(node.nodeValue) && !/^(SCRIPT|STYLE)$/.test(node.parentNode.nodeName) && !node.parentNode.closest('[data-stale]')) list.push(node);
    }
    list.forEach(function (nd) { nd.nodeValue = zam(nd.nodeValue); });
    Array.prototype.forEach.call(document.querySelectorAll('[placeholder*="București"]'), function (el) {
      el.setAttribute('placeholder', zam(el.getAttribute('placeholder')));
    });
    document.title = zam(document.title);
  }

  /* Pentru paginile /oferta-.../ (assets/wycena.js). */
  window.DJPL = {
    tg: tg,
    formConversion: function () {
      loadGtag();
      conv(LABEL.form);
    }
  };

  /* Bara cu reduceri pe paginile obișnuite (nu pe paginile de ofertă). */
  function pasekRabatow() {
    if (location.pathname.indexOf('/oferta-') === 0 || document.getElementById('rabaty')) return;
    var d = document.createElement('div');
    d.id = 'rabaty';
    d.setAttribute('role', 'note');
    d.style.cssText = 'background:#ff7a1a;color:#fff;text-align:center;font-weight:800;font-size:14px;line-height:1.35;padding:8px 12px';
    /* Oferta de iarnă dispare singură după 30.11.2026. */
    var iarna = new Date() < new Date(2026, 11, 1)
      ? ' &nbsp;·&nbsp; Ofertă de iarnă <span style="white-space:nowrap">−15% până la 30.11</span>' : '';
    d.innerHTML = 'Seniori <span style="white-space:nowrap">−25%</span>' + iarna + ' &nbsp;·&nbsp; Ofertă gratuită';
    document.body.insertBefore(d, document.body.firstChild);
  }

  function init() {
    pasekRabatow();
    applyRegion();
    var c = readConsent();
    if (!c) showBanner(false);
    initNav();
    initClicks();
    initForms();
    loadGtag();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
