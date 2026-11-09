// DE/EN toggle for /direct-trade/, /next-run/ and their thanks pages. Start language from ?lang=de, no storage (§ 25 TDDDG).
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
}

document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
  btn.addEventListener('click', function () { setLang(btn.getAttribute('data-set-lang')); });
});
setLang(new URLSearchParams(location.search).get('lang') === 'de' ? 'de' : 'en');
