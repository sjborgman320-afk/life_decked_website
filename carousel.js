// Simple random rotating card display for the main screen
(function () {
  const cfg = window.__API_CFG__ || window.API_CONFIG || window.API_Config || window.apiConfig || {};
  const container = document.getElementById('random-carousel');
  const INTERVAL_MS = 4000;
  const SLIDE_COUNT = 8; // how many unique cards to cycle through before reshuffle

  if (!container) return;

  function imageFileName(card) {
    const ed = card.edition_number_leading ? String(card.edition_number_leading) : '';
    const formatted = card.card_number_formatted ||
      (card.card_number !== undefined && card.card_number !== null ? String(card.card_number).padStart(3, '0') : '');
    return (ed || formatted) ? `${ed}-${formatted}.png` : (card.card_image || '');
  }

  function renderSlide(card) {
    const img = imageFileName(card);
    container.innerHTML = `
      <article class="carousel-slide fade-in">
        <div class="carousel-media">
          ${img ? `<img src="images/cards/${img}" alt="${escapeHtml(card.card_name || '')}">` : `<div class="no-image">No image</div>`}
        </div>
        <div class="carousel-caption">
          <h3 title="${escapeHtml(card.card_name || '')}">${card.card_name || 'Untitled'}</h3>
          <p class="meta">${card.edition_name || card.edition_number || ''} • #${card.card_number_formatted || String(card.card_number || '').padStart(3,'0')}</p>
        </div>
      </article>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  async function fetchCards() {
    if (!cfg.endpoint) return [];
    try {
      const res = await fetch(cfg.endpoint, { headers: cfg.headers || {} });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('carousel: failed to fetch cards', e);
      return [];
    }
  }

  function pickSequence(cards, n) {
    // shuffle then take n (or all if fewer)
    const copy = cards.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  }

  async function start() {
    container.classList.add('carousel-ready');
    const cards = await fetchCards();
    if (!cards.length) {
      container.innerHTML = '<div class="carousel-placeholder">No featured cards available.</div>';
      return;
    }

    let seq = pickSequence(cards, SLIDE_COUNT);
    let idx = 0;
    let paused = false;
    let timer = null;

    function showNext() {
      if (!seq.length) return;
      renderSlide(seq[idx]);
      idx++;
      if (idx >= seq.length) {
        seq = pickSequence(cards, SLIDE_COUNT);
        idx = 0;
      }
    }

    function play() {
      if (timer) clearInterval(timer);
      showNext();
      timer = setInterval(() => { if(!paused) showNext(); }, INTERVAL_MS);
    }

    container.addEventListener('mouseenter', () => paused = true);
    container.addEventListener('mouseleave', () => paused = false);
    container.addEventListener('focusin', () => paused = true);
    container.addEventListener('focusout', () => paused = false);

    play();
  }

  // start after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();