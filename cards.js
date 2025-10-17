// Ensure shared config lives on window.__API_CFG__ (do not redeclare API_CFG)
window.__API_CFG__ = window.__API_CFG__ || (window.API_CONFIG || window.API_Config || window.apiConfig);

let allCards = [];

async function loadCards() {
  if (!window.__API_CFG__ || !window.__API_CFG__.endpoint) {
    console.error('Missing API configuration. Make sure API_CONFIG (or API_Config) is defined and has an endpoint and headers.');
    return;
  }

  try {
    const response = await fetch(window.__API_CFG__.endpoint, {
      method: 'GET',
      headers: window.__API_CFG__.headers
    });

    const cards = await response.json();
    allCards = Array.isArray(cards) ? cards : [];
    renderCards(allCards);
  } catch (error) {
    console.error('Failed to load cards:', error);
  }
}

function matchesEdition(card, editionVal) {
  if (!editionVal) return true;
  const leading = card.edition_number_leading ? String(card.edition_number_leading) : '';
  const editionNumber = card.edition_number ? String(card.edition_number).padStart(3, '0') : '';
  // match either leading or padded edition number
  return leading === editionVal || editionNumber === editionVal;
}

/**
 * Shrink a single-line element's font-size until it fits its width.
 * el: HTMLElement (should be single-line / nowrap)
 * minPx: minimum font-size in px
 */
function shrinkToFit(el, minPx = 12) {
  if (!el) return;
  el.style.whiteSpace = 'nowrap';
  el.style.overflow = 'hidden';

  // start from computed font-size (or existing inline)
  let fontSize = parseFloat(window.getComputedStyle(el).fontSize) || 16;
  // loop until fits or reaches minimum
  while (el.scrollWidth > el.clientWidth && fontSize > minPx) {
    fontSize -= 1;
    el.style.fontSize = fontSize + 'px';
  }
}

function renderCards(cards) {
  const grid = document.getElementById('card-grid');
  if (!grid) return;
  grid.innerHTML = '';

  cards.forEach(card => {
    const editionLeading = card.edition_number_leading ? String(card.edition_number_leading) : '';
    const cardNumberFormatted = card.card_number_formatted ||
      (card.card_number !== undefined && card.card_number !== null ? String(card.card_number).padStart(3, '0') : '');
    const imageFile = (editionLeading || cardNumberFormatted) ? `${editionLeading}-${cardNumberFormatted}.png` : card.card_image;

    // build an id like "ED1-005" or fallback to card.id
    const cardId = (editionLeading && cardNumberFormatted) ? `${editionLeading}-${cardNumberFormatted}` : (card.id || card.card_id || '');

    // link to cardpage.html with query, open in new tab
    const cardPageUrl = `cardpage.html?id=${encodeURIComponent(cardId)}`;

    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3 title="${card.card_name}">${card.card_name}</h3>
      <a href="${cardPageUrl}" target="_blank" rel="noopener">
        <img src="images/cards/${imageFile}" alt="${card.card_name}" />
      </a>
    `;
    grid.appendChild(div);

    // shrink the card title to fit its container
    const h = div.querySelector('h3');
    shrinkToFit(h, 12);
  });
}

// re-run shrink on window resize to adapt to layout changes
window.addEventListener('resize', () => {
  document.querySelectorAll('#card-grid .card h3').forEach(h => {
    // reset inline font-size so shrink starts from CSS base again
    h.style.fontSize = '';
    shrinkToFit(h, 12);
  });
});

function applyFilters() {
  const editionVal = (document.getElementById('edition') || {}).value || '';
  const classificationVal = (document.getElementById('classification') || {}).value || '';
  const rarityVal = (document.getElementById('rarity') || {}).value || '';

  const filtered = allCards.filter(card => {
    if (editionVal && !matchesEdition(card, editionVal)) return false;

    if (classificationVal) {
      const cardClass = String(card.classification || card.class || '').toLowerCase();
      if (cardClass !== classificationVal.toLowerCase()) return false;
    }

    if (rarityVal) {
      const cardRarity = String(card.rarity || '').toLowerCase();
      if (cardRarity !== rarityVal.toLowerCase()) return false;
    }

    return true;
  });

  renderCards(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  loadCards();

  // wire selects to filter automatically
  ['edition', 'classification', 'rarity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });
});
