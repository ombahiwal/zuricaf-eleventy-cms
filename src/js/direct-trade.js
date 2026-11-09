// DE/EN toggle for /direct-trade/ and /direct-trade-thanks/. Start language from ?lang=de, no storage (§ 25 TDDDG).
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
  var form = document.getElementById('direct-trade');
  if (form) {
    form.elements.lang.value = lang;
    form.action = '/direct-trade-thanks/' + (lang === 'de' ? '?lang=de' : '');
  }
  var back = document.getElementById('back');
  if (back) back.href = '/direct-trade/' + (lang === 'de' ? '?lang=de' : '');
}

document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
  btn.addEventListener('click', function () { setLang(btn.getAttribute('data-set-lang')); });
});
setLang(new URLSearchParams(location.search).get('lang') === 'de' ? 'de' : 'en');
