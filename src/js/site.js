document.addEventListener('DOMContentLoaded', function() {
  if (window.lucide) lucide.createIcons();
});

/* Hover border (formerly inline onmouseover/onmouseout on the home page) */
document.querySelectorAll('[data-hover-border]').forEach(function(el) {
  el.addEventListener('mouseover', function() { el.style.borderColor = el.getAttribute('data-hover-border'); });
  el.addEventListener('mouseout', function() { el.style.borderColor = el.getAttribute('data-hover-border-off'); });
});
