// config.js
// Minimal API config — update endpoint to your real API or a local JSON file (e.g. "./data/cards.json")
window.API_CONFIG = {
  // Use a full URL (https://...) or a relative path (./data/cards.json).
  // If using a local file, run a local server (see note below).
  endpoint: 'https://clmrqyimovyudraksfze.supabase.co/rest/v1/life_decked_card_details_view?select=*',
  headers: {
    'APIKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbXJxeWltb3Z5dWRyYWtzZnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDcyNDMsImV4cCI6MjA0MzAyMzI0M30.1N7mOdA8CyiVL1HcBgR67Er53F109HckXpUXnpJfv2s',
    'Content-Type': 'application/json'
    // add Authorization or other headers if your API requires them
  },

  // Optional: single-card fetch helpers (used by cardpages.js)
  // singleCardUrlTemplate: 'https://api.example.com/cards/{edition}/{card}',
  // singleCardPath: 'card' // will attempt `${endpointBase}/card?edition=...&card=...`
};

// Keep a single shared reference used by other scripts
window.__API_CFG__ = window.__API_CFG__ || window.API_CONFIG;
