async function loadCards() {
  const response = await fetch('https://your-api.com/cards', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  const cards = await response.json();
  renderCards(cards);
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
