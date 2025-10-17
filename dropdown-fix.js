// When a dropdown is about to open, check if it would overflow the viewport and add .right to flip it.
(function () {
  function adjustMenu(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) return;
    // temporarily make visible to measure
    const prevDisplay = menu.style.display;
    menu.style.display = 'block';
    menu.style.visibility = 'hidden';
    menu.style.left = ''; menu.style.right = '';

    const rect = menu.getBoundingClientRect();
    const parentRect = dropdown.getBoundingClientRect();
    // if menu right edge goes beyond viewport, flip to right
    if (rect.right > window.innerWidth && rect.width < parentRect.left + rect.width) {
      menu.classList.add('right');
    } else {
      menu.classList.remove('right');
    }

    // restore visibility state
    menu.style.display = prevDisplay || '';
    menu.style.visibility = '';
  }

  document.querySelectorAll('.dropdown').forEach(dd => {
    dd.addEventListener('mouseenter', () => adjustMenu(dd));
    dd.addEventListener('focusin', () => adjustMenu(dd));
    // Also adjust on window resize to keep things correct
    window.addEventListener('resize', () => adjustMenu(dd));
  });
})();