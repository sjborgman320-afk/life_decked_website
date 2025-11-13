// Normalize possible global names (safe: won't redeclare if other scripts run the same)
var API_CFG = window.__API_CFG__ || (window.__API_CFG__ = (window.API_CONFIG || window.API_Config || window.apiConfig));
 
function fail(msg) {
  const container = document.getElementById('card-container');
  if (container) container.innerText = msg;
  else console.error(msg);
}

function parseId(id) {
  if (!id) return null;
  const parts = id.split('-');
  return { editionLeading: parts[0], cardNum: parts.slice(1).join('-') };
}

/**
 * Find a matching card object from an array using edition_number_leading and card_number_formatted.
 */
function findCardByFields(cards, editionLeading, cardNumberFormatted) {
  return cards.find(c => {
    const ed = c.edition_number_leading !== undefined && c.edition_number_leading !== null
      ? String(c.edition_number_leading)
      : '';
    const formatted = c.card_number_formatted ||
      (c.card_number !== undefined && c.card_number !== null ? String(c.card_number).padStart(3, '0') : '');
    return String(ed) === String(editionLeading) && String(formatted) === String(cardNumberFormatted);
  });
}

async function loadCardByFields(editionLeading, cardNumberFormatted) {
  if (!API_CFG || !API_CFG.endpoint) {
    fail('Missing API configuration. Ensure config.js sets window.API_CONFIG with endpoint and headers.');
    return;
  }

  try {
    const resp = await fetch(API_CFG.endpoint, { method: 'GET', headers: API_CFG.headers });
    if (!resp.ok) throw new Error(`API returned ${resp.status}`);
    const cards = await resp.json();

    const found = findCardByFields(cards, editionLeading, cardNumberFormatted);
    if (!found) { fail('Card not found'); return; }
    renderCard(found);
  } catch (err) {
    fail('Failed to load card: ' + (err && err.message ? err.message : err));
  }
}

async function loadCardFromId(id) {
  const key = parseId(id);
  if (!key) { fail('Invalid card id'); return; }

  // reuse the fields-based loader
  return loadCardByFields(key.editionLeading, key.cardNum);
}

function renderCard(card) {
  const container = document.getElementById('card-container');
  if (!container) return;

  const editionLeading = card.edition_number_leading ? String(card.edition_number_leading) : '';
  const cardNumberFormatted = card.card_number_formatted ||
    (card.card_number !== undefined && card.card_number !== null ? String(card.card_number).padStart(3, '0') : '');
  //const imageFile = (editionLeading || cardNumberFormatted) ? `${editionLeading}-${cardNumberFormatted}.png` : (card.card_image || '');
    const imageFile = window.API_CONFIG.storage_url +"/" + String(editionLeading).trim() + "/" + String(card.class_sort).trim() + "-"+ String(card.classification).trim() + "/Full_Card/" + ((editionLeading && cardNumberFormatted) ? `${editionLeading}-${cardNumberFormatted}.png` : card.card_image);
console.log(imageFile);
   const backupimag = window.API_CONFIG.storage_url + '/Life_Decked_Back.png';
  // build a list of extra fields to show (only present fields)
  const extras = [
    { label: 'Artist', value: card.artist },
    { label: 'Release', value: card.release_date || card.edition_name },
    { label: 'Type', value: card.type || card.classification },
    { label: 'Cost', value: card.cost },
    { label: 'Upkeep', value: card.upkeep },
    { label: 'Rarity', value: card.rarity },
    { label: 'Stats', value: card.stats || (card.attack && card.defense ? `ATK ${card.attack} / DEF ${card.defense}` : '') },
    { label: 'Flavor', value: card.flavor_text || card.card_text_02 }
  ].filter(x => x.value !== undefined && x.value !== null && String(x.value).trim() !== '');

  // render
  container.innerHTML = `
    <h1>${card.card_name || 'Card'}</h1>
    <dl>
      <dt><strong>Edition:</strong></dt><dd>${card.edition_name || card.edition_number || ''}</dd>
      <dt><strong>Card #:</strong></dt><dd>${cardNumberFormatted}</dd>
    </dl>
 
        <img src="${imageFile}" alt="${card.card_name}" 
     onerror="this.onerror=null;this.src='${backupimag}';" />
    <p>${card.card_text_01 || ''}</p>
    ${extras.length ? '<hr>' : ''}
    ${extras.map(e => `<p><strong>${e.label}:</strong> ${e.value}</p>`).join('')}
    <p><a href="./cards.html">Back to list</a></p>
  `;
}

// entry
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);

  // prefer explicit field params
  const editionParam = params.get('edition_number_leading');
  const formattedParam = params.get('card_number_formatted');

  if (editionParam && formattedParam) {
    loadCardByFields(editionParam, formattedParam);
    return;
  }

  // fallback to legacy id query param (e.g. ?id=ED-005)
  const id = params.get('id');
  if (id) {
    loadCardFromId(id);
    return;
  }

  fail('No card identifier provided. Provide edition_number_leading and card_number_formatted or legacy id.');

});
