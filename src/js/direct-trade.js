// DE/EN toggle for /direct-trade/, /next-run/ and their thanks pages, EUR/UGX toggle on /direct-trade/.
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

function renderMoney() {
  var lang = document.documentElement.lang;
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
setLang(new URLSearchParams(location.search).get('lang') === 'de' ? 'de' : 'en');
