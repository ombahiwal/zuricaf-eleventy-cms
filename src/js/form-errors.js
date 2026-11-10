// Field errors as text under the field (instead of the browser bubble). Needs no markup, works on every form with a name.
(function () {
  var T = {
    en: { req: 'Please fill in this field.', mail: 'Please enter a valid email address.' },
    de: { req: 'Bitte dieses Feld ausfüllen.', mail: 'Bitte eine gültige E-Mail-Adresse eingeben.' }
  };
  function clear(el) {
    el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby');
    var e = document.getElementById(el.id + '-err'); if (e) e.remove();
  }
  document.querySelectorAll('form[name]').forEach(function (f) {
    f.noValidate = true;
    f.addEventListener('input', function (ev) { if (ev.target.id) clear(ev.target); });
    f.addEventListener('submit', function (ev) {
      var t = T[document.documentElement.lang === 'de' ? 'de' : 'en'], first = null;
      f.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (!el.id || el.type === 'hidden' || el.name === 'bot-field') return;
        clear(el);
        if (el.validity.valid) return;
        var p = document.createElement('p');
        p.className = 'err'; p.id = el.id + '-err';
        p.textContent = el.validity.valueMissing ? t.req : el.validity.typeMismatch ? t.mail : el.validationMessage;
        el.after(p);
        el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', p.id);
        first = first || el;
      });
      if (first) { ev.preventDefault(); first.focus(); }
    });
  });
})();
