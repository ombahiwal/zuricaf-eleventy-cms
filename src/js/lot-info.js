  /* ── Language toggle ── */
  var currentLang = 'en';

  function setLang(lang) {
    currentLang = lang;
    // Toggle button styles
    document.getElementById('btn-en').classList.toggle('lang-btn--active', lang === 'en');
    document.getElementById('btn-lg').classList.toggle('lang-btn--active', lang === 'lg');
    // Swap all data-en / data-lg text nodes
    document.querySelectorAll('[data-en][data-lg]').forEach(function(el) {
      el.innerHTML = el.getAttribute('data-' + lang);
    });
    // Swap placeholders
    document.querySelectorAll('[data-ph-en][data-ph-lg]').forEach(function(el) {
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });
  }

  /* ── Lots ── */
  var visibleLots = 1;
  var MAX_LOTS = 5;

  function addLot() {
    if (visibleLots >= MAX_LOTS) return;
    visibleLots++;
    var block = document.getElementById('lot-' + visibleLots);
    if (block) {
      block.style.display = '';
      block.querySelectorAll('input,select,textarea').forEach(function(el) { el.disabled = false; });
      var firstDetails = block.querySelector('details');
      if (firstDetails) firstDetails.open = true;
      // Apply current language to new lot
      if (currentLang !== 'en') setLang(currentLang);
    }
    if (visibleLots >= MAX_LOTS) document.getElementById('add-lot-btn').style.display = 'none';
    if (window.lucide) lucide.createIcons();
  }

  function removeLot(n) {
    var block = document.getElementById('lot-' + n);
    if (block) {
      block.style.display = 'none';
      block.querySelectorAll('input,select,textarea').forEach(function(el) {
        el.disabled = true;
        if (el.type !== 'checkbox') el.value = '';
        if (el.type === 'checkbox') el.checked = false;
      });
    }
    visibleLots = Math.max(1, visibleLots - 1);
    document.getElementById('add-lot-btn').style.display = '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lot-extra').forEach(function(block) {
      block.querySelectorAll('input,select,textarea').forEach(function(el) { el.disabled = true; });
    });
    if (window.lucide) lucide.createIcons();
  });

  /* ── Handler wiring (formerly inline onclick) ── */
  document.querySelectorAll('[data-set-lang]').forEach(function(btn) {
    btn.addEventListener('click', function() { setLang(btn.getAttribute('data-set-lang')); });
  });
  document.querySelectorAll('[data-remove-lot]').forEach(function(btn) {
    btn.addEventListener('click', function() { removeLot(Number(btn.getAttribute('data-remove-lot'))); });
  });
  var addLotBtn = document.getElementById('add-lot-btn');
  if (addLotBtn) addLotBtn.addEventListener('click', addLot);
