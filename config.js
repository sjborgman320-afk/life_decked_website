// config.js
// Minimal API config — update endpoint to your real API or a local JSON file (e.g. "./data/cards.json")
const api_key_shared = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbXJxeWltb3Z5dWRyYWtzZnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDcyNDMsImV4cCI6MjA0MzAyMzI0M30.1N7mOdA8CyiVL1HcBgR67Er53F109HckXpUXnpJfv2s";
const Anon_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbXJxeWltb3Z5dWRyYWtzZnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDcyNDMsImV4cCI6MjA0MzAyMzI0M30.1N7mOdA8CyiVL1HcBgR67Er53F109HckXpUXnpJfv2s";


window.API_CONFIG = {
  // Use a full URL (https://...) or a relative path (./data/cards.json).
  // If using a local file, run a local server (see note below).
  project_name: 'Life Decked',
  base_project_url: 'https://clmrqyimovyudraksfze.supabase.co',
  storage_url: '${this.base_project_url}/storage/v1/object/public/${this.project_name}',
  contact_url: '${this.base_project_url}/rest/v1/contact_url',
  api_key_shared: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbXJxeWltb3Z5dWRyYWtzZnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDcyNDMsImV4cCI6MjA0MzAyMzI0M30.1N7mOdA8CyiVL1HcBgR67Er53F109HckXpUXnpJfv2s",

endpoint: '${this.base_project_url}/rest/v1/life_decked_card_details_view?select=*',
  //endpoint: 'https://clmrqyimovyudraksfze.supabase.co/rest/v1/life_decked_card_details_view?select=*',
  headers: {
    'APIKey': api_key_shared,
    'Content-Type': 'application/json'
    // add Authorization or other headers if your API requires them
  },
contact_headers: {
        'Content-Type': 'application/json',
        'apikey': Anon_key,
        'Authorization': `Bearer ${Anon_key}`,
        'Prefer': 'return=representation'
      },
  // Optional: single-card fetch helpers (used by cardpages.js)
  // singleCardUrlTemplate: 'https://api.example.com/cards/{edition}/{card}',
  // singleCardPath: 'card' // will attempt `${endpointBase}/card?edition=...&card=...`
};
window.API_CONFIG.storage_url = `${window.API_CONFIG.base_project_url}/storage/v1/object/public/Life_Decked`;
window.API_CONFIG.endpoint = `${window.API_CONFIG.base_project_url}/rest/v1/life_decked_card_details_view?select=*`;
window.API_CONFIG.contact_url = `${window.API_CONFIG.base_project_url}/rest/v1/contact_url`;
//window.API_CONFIG.headers = `${window.API_CONFIG.headers}`;

// Keep a single shared reference used by other scripts
window.__API_CFG__ = window.__API_CFG__ || window.API_CONFIG;
