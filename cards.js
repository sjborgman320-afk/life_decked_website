async function loadCards() {
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'GET',
      headers: API_CONFIG.headers
    });

    const cards = await response.json();
    renderCards(cards);
  } catch (error) {
    console.error('Failed to load cards:', error);
  }
}

function renderCards(cards) {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = '';

  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${card.name}</h3>
      <p>Trait: ${card.trait}</p>
      <p>Rarity: ${card.rarity}</p>
    `;
    grid.appendChild(div);
  });
}

function applyFilters() {
  const trait = document.getElementById('trait').value;
  const rarity = document.getElementById('rarity').value;

  // You can modify this to filter via API or client-side
  loadCards(); // Add query params if needed
}

document.addEventListener('DOMContentLoaded', loadCards);
