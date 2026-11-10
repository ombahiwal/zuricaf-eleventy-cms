// DE/EN toggle for the home page, /direct-trade/, /next-run/ and their thanks pages, EUR/UGX toggle on /direct-trade/.
// Start language from ?lang=de and currency EUR from ?cur=eur, no storage (§ 25 TDDDG).
var RATE_UGX = 4586; // EUR 1 in UGX, XE mid-market 9 Nov 2026; the fine print on /direct-trade/ names the same rate
var cur = new URLSearchParams(location.search).get('cur') === 'eur' ? 'eur' : 'ugx'; // farmers first: UGX unless ?cur=eur

function money(eur, lang) {
  var loc = lang === 'de' ? 'de-DE' : 'en-GB', nb = '\u00a0';
  if (cur === 'ugx') {
    var u = eur * RATE_UGX;
    if (u >= 1e6) {
      var mio = (u / 1e6).toLocaleString(loc, { maximumFractionDigits: 1 });
      return lang === 'de' ? '≈' + nb + mio + nb + 'Mio.' + nb + 'UGX' : '≈' + nb + 'UGX' + nb + mio + nb + 'million';
    }
    var r = (Math.round(u / 100) * 100).toLocaleString(loc);
    return lang === 'de' ? '≈' + nb + r + nb + 'UGX' : '≈' + nb + 'UGX' + nb + r;
  }
  var d = eur >= 100 && eur % 1 === 0 ? 0 : 2;
  var e = eur.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d });
  return lang === 'de' ? e + nb + '€' : 'EUR' + nb + e;
}

// Example way B on /direct-trade/: all figures per kg in EUR, the one place to change them.
// Registered values: UCDA daily price 30 Oct 2026 at EUR 1 = USD 1.1172 (run 2026-09); the label date in direct-trade.njk names the same day.
// Zone limits are assumptions, under review. Static numbers in direct-trade.njk show Arabica at its start for visitors without JS.
var EX = {
  arabica: { reg: 5.59, min: 6, max: 14, start: 9, zones: [8, 10, 12] },
  robusta: { reg: 3.04, min: 4, max: 9, start: 6, zones: [5.5, 7] }
};
var EX_RATE = 1.60, EX_CESS = 0.02, EX_STORE = 0.083, EX_BASE = 0.40, EX_KG = 600; // rate for 600 kg, cess 2% of the registered value
var exVar = 'arabica', exPrice = document.getElementById('ex-price');

function r2(x) { return Math.round(x * 100) / 100; }

// way B: costs and our base share come off the sale, what is left above the registered value is split 50/50
function exCalc(p, reg) {
  var n = p - EX_RATE - EX_CESS * reg - EX_STORE - EX_BASE, above = Math.max(n - reg, 0);
  var you = r2(Math.min(n, reg) + above / 2), us = r2(EX_BASE + above / 2);
  return { price: p, reg: reg, you: you, us: us, cost: r2(p - you - us), cess: r2(EX_CESS * reg),
    above: r2(above), total: Math.round(you * EX_KG), diff: r2(Math.abs(you - reg)), wa: r2(Math.max(0.1 * p, EX_BASE)) }; // wa: our way A commission, 10% of the sale, at least the base share
}

function renderExample(lang) {
  var ex = EX[exVar], p = parseFloat(exPrice.value), v = exCalc(p, ex.reg), zone = 1;
  ex.zones.forEach(function (z) { if (p >= z) zone++; });
  document.querySelectorAll('.m[data-k]').forEach(function (el) { el.setAttribute('data-eur', v[el.getAttribute('data-k')]); });
  document.querySelectorAll('[data-zone]').forEach(function (el) { el.hidden = el.getAttribute('data-zone') !== String(zone); });
  document.querySelectorAll('[data-when]').forEach(function (el) { el.hidden = (el.getAttribute('data-when') === 'above') !== (v.you >= v.reg); });
  document.querySelectorAll('[data-set-var]').forEach(function (btn) { btn.setAttribute('aria-pressed', String(btn.getAttribute('data-set-var') === exVar)); });
  var x = 10, w = 340 / p; // bars span x 10 to 350 of the 360 viewBox
  ['you', 'us', 'cost'].forEach(function (k) {
    var bar = document.getElementById('bar-' + k);
    bar.setAttribute('x', x.toFixed(1)); bar.setAttribute('width', (v[k] * w).toFixed(1)); x += v[k] * w;
  });
  exPrice.setAttribute('aria-valuetext', money(p, lang));
  document.getElementById('sp-t').textContent = (lang === 'de' ? 'Von ' + money(p, lang) + ' je kg: ihr ' + money(v.you, lang) + ', Zuricaf ' + money(v.us, lang) + ', Logistik und Cess ' : 'Of ' + money(p, lang) + ' per kg: you ' + money(v.you, lang) + ', Zuricaf ' + money(v.us, lang) + ', logistics and cess ') + money(v.cost, lang);
}

function renderMoney() {
  var lang = document.documentElement.lang;
  if (exPrice) renderExample(lang);
  document.querySelectorAll('.m[data-eur]').forEach(function (el) {
    el.textContent = money(parseFloat(el.getAttribute('data-eur')), lang);
  });
  document.querySelectorAll('[data-set-cur]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-set-cur') === cur));
  });
}

function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en][data-de]').forEach(function (el) {
    el.innerHTML = el.getAttribute('data-' + lang);
  });
  document.querySelectorAll('[data-ph-en][data-ph-de]').forEach(function (el) {
    el.placeholder = el.getAttribute('data-ph-' + lang);
  });
  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-set-lang') === lang));
  });
  var q = lang === 'de' ? '?lang=de' : '';
  var form = document.querySelector('form[data-thanks]');
  if (form) {
    form.elements.lang.value = lang;
    form.action = form.getAttribute('data-thanks') + q;
  }
  var back = document.getElementById('back');
  if (back) back.href = back.getAttribute('data-base') + q;
  renderMoney();
}

document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
  btn.addEventListener('click', function () { setLang(btn.getAttribute('data-set-lang')); });
});
document.querySelectorAll('[data-set-cur]').forEach(function (btn) {
  btn.addEventListener('click', function () { cur = btn.getAttribute('data-set-cur'); renderMoney(); });
});
if (exPrice) {
  document.getElementById('ex-ctl').hidden = false;
  exPrice.addEventListener('input', renderMoney);
  document.querySelectorAll('[data-set-var]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ex = EX[exVar = btn.getAttribute('data-set-var')];
      exPrice.min = ex.min; exPrice.max = ex.max; exPrice.value = ex.start;
      renderMoney();
    });
  });
}
setLang(new URLSearchParams(location.search).get('lang') === 'de' ? 'de' : 'en');
