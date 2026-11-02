/* Script central: conversii Google Ads, banner cookies, popup-uri, formular "Te sunăm noi".
   Consent Mode, gtag config, citirea ?judet= și gclid se fac inline în <head> (src/head.js). */
(function () {
  'use strict';

  var AW = 'AW-17044870869';
  var CONV = {
    call: AW + '/rrY2CMqh2vYcENWt0L8_',
    wa: AW + '/oURWCJjz5PYcENWt0L8_',
    form: AW + '/zz_4CN-B2_YcENWt0L8_'
  };
  // Cheia publică Cloudflare Turnstile (site key). Goală = Turnstile oprit, rămâne doar honeypot.
  var TURNSTILE_SITEKEY = '';

  var PHONE_WA = '40742431066';
  var ZONE = { mures: 'Mureș', cluj: 'Cluj', sibiu: 'Sibiu' };
  var d = document, html = d.documentElement, body = d.body;
  var judet = html.getAttribute('data-j') || '';

  function ss(k, v) {
    try {
      if (v === undefined) return sessionStorage.getItem(k) || '';
      sessionStorage.setItem(k, v);
    } catch (e) { return ''; }
  }
  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }

  /* ---------- Conversii ---------- */
  var lastFired = {};
  function conversion(type, extra) {
    var now = Date.now();
    // Protecție la dublu-click / atingeri repetate
    if (lastFired[type] && now - lastFired[type] < 5000) return;
    lastFired[type] = now;
    if (typeof gtag !== 'function') return;
    var p = { send_to: CONV[type], transport_type: 'beacon' };
    if (extra) for (var k in extra) p[k] = extra[k];
    gtag('event', 'conversion', p);
  }

  // Un singur listener pentru toate linkurile tel: și wa.me (header, hero, bară, popup-uri, final)
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) conversion('call');
    else if (h.indexOf('wa.me/') !== -1) conversion('wa');
  }, true);

  /* ---------- Zonă (județ) în titlul documentului și în mesajul WhatsApp ---------- */
  if (judet && body.getAttribute('data-title')) {
    d.title = body.getAttribute('data-title').replace('{z}', ' în județul ' + ZONE[judet]);
  }
  var waMsg = body.getAttribute('data-wa') || 'Bună ziua, aș dori o ofertă.';
  if (judet) waMsg = waMsg.replace(/\.$/, '') + ' (județul ' + ZONE[judet] + ').';
  $$('a[href*="wa.me/"]').forEach(function (a) {
    a.href = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(waMsg);
  });

  /* ---------- Dialoguri ---------- */
  function openDlg(dlg) {
    if (!dlg || dlg.open) return;
    $$('dialog[open]').forEach(function (o) { o.close(); });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || (e.target.closest && e.target.closest('[data-close]'))) dlg.close();
    });
  });

  /* ---------- Informații legale ---------- */
  $$('[data-legal]').forEach(function (b) {
    b.addEventListener('click', function () { openDlg($('#legal')); });
  });

  /* ---------- Banner cookies (Consent Mode v2) ---------- */
  var ck = $('#ck');
  function setConsent(val) {
    ls('ck', val);
    var g = val === 'granted' ? 'granted' : 'denied';
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { ad_storage: g, analytics_storage: g, ad_user_data: g, ad_personalization: g });
    }
    if (ck) ck.hidden = true;
  }
  if (ck) {
    if (!ls('ck')) ck.hidden = false;
    $('.acc', ck).addEventListener('click', function () { setConsent('granted'); });
    $('.ref', ck).addEventListener('click', function () { setConsent('denied'); });
    $$('[data-cookies]').forEach(function (b) {
      b.addEventListener('click', function () { ck.hidden = false; });
    });
  }

  /* ---------- Turnstile (încărcat doar la deschiderea formularului) ---------- */
  var tsToken = '', tsLoaded = false;
  function loadTurnstile() {
    if (!TURNSTILE_SITEKEY || tsLoaded) return;
    tsLoaded = true;
    window.__tsReady = function () {
      try {
        window.turnstile.render('#ts', {
          sitekey: TURNSTILE_SITEKEY,
          appearance: 'interaction-only',
          callback: function (t) { tsToken = t; },
          'expired-callback': function () { tsToken = ''; },
          'error-callback': function () { tsToken = ''; }
        });
      } catch (e) {}
    };
    var s = d.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsReady';
    s.async = true;
    d.head.appendChild(s);
  }
  function waitToken(ms) {
    return new Promise(function (res) {
      if (!TURNSTILE_SITEKEY || tsToken) return res(tsToken);
      var t0 = Date.now();
      (function poll() {
        if (tsToken || Date.now() - t0 > ms) return res(tsToken);
        setTimeout(poll, 150);
      })();
    });
  }

  /* ---------- Formular "Te sunăm noi" ---------- */
  var cb = $('#cb');
  $$('[data-cb]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openDlg(cb);
      loadTurnstile();
      var tel = $('#cb-tel');
      if (tel && !('ontouchstart' in window)) setTimeout(function () { tel.focus(); }, 50);
    });
  });

  // Telefon românesc: 07xx / 02xx / 03xx, cu sau fără +40 / 0040. Întoarce E.164 sau ''.
  function phoneE164(raw) {
    var n = String(raw || '').replace(/[\s.\-()\/]/g, '');
    var m = n.match(/^(?:\+40|0040|40|0)?([237]\d{8})$/);
    return m ? '+40' + m[1] : '';
  }

  if (cb) {
    var form = $('form', cb), tel = $('#cb-tel', cb), err = $('#cb-err', cb),
        btn = $('button[type=submit]', cb), fail = $('.fail', cb), sending = false;

    tel.addEventListener('input', function () {
      if (tel.getAttribute('aria-invalid') === 'true' && phoneE164(tel.value)) {
        tel.removeAttribute('aria-invalid'); err.textContent = '';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var e164 = phoneE164(tel.value);
      if (!e164) {
        tel.setAttribute('aria-invalid', 'true');
        err.textContent = 'Introduceți un număr valid, de ex. 0742 123 456.';
        tel.focus();
        return;
      }
      sending = true;
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Se trimite…';
      fail.hidden = true;

      var nameEl = $('#cb-nume', cb), svcEl = $('#cb-lucrare', cb);
      var name = nameEl ? nameEl.value.trim() : '';
      var service = svcEl ? svcEl.value : (body.getAttribute('data-svc') || '');

      waitToken(3000).then(function (token) {
        return fetch('/api/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: e164,
            service: service,
            judet: judet,
            page: location.pathname,
            pageTitle: d.title,
            gclid: ss('gclid'),
            gbraid: ss('gbraid'),
            wbraid: ss('wbraid'),
            website: $('input[name=website]', cb).value,
            token: token || ''
          })
        });
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok || !j.ok) throw new Error('send');
          // Enhanced conversions: datele se trimit înainte de evenimentul de conversie
          if (typeof gtag === 'function') {
            var ud = { phone_number: e164 };
            if (name) {
              var parts = name.split(/\s+/);
              ud.address = { first_name: parts[0], last_name: parts.slice(1).join(' '), country: 'RO' };
            }
            gtag('set', 'user_data', ud);
          }
          conversion('form', { transaction_id: j.id || String(Date.now()) });
          ss('sent', '1');
          form.hidden = true;
          $('#cb-h', cb).hidden = true;
          $('#cb-sub', cb).hidden = true;
          $('.ok', cb).hidden = false;
        });
      }).catch(function () {
        fail.hidden = false;
        btn.disabled = false;
        btn.textContent = label;
        sending = false;
      });
    });
  }

  /* ---------- Popup la ieșire: doar desktop, o dată pe sesiune ---------- */
  var exitDlg = $('#exit');
  if (exitDlg && window.matchMedia && matchMedia('(min-width:900px) and (pointer:fine)').matches) {
    var armedAt = Date.now() + 6000;
    d.addEventListener('mouseout', function (e) {
      if (e.relatedTarget || e.clientY > 0 || Date.now() < armedAt) return;
      if (ss('exit') || ss('sent') || d.querySelector('dialog[open]')) return;
      ss('exit', '1');
      openDlg(exitDlg);
    });
  }
})();
