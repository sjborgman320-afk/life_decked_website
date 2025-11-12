// Ensure shared config lives on window.__API_CFG__ (do not redeclare API_CFG)
window.__API_CFG__ = window.__API_CFG__ || (window.API_CONFIG || window.API_Config || window.apiConfig);

const apiKey = window.__API_CFG__.api_key_shared
//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbXJxeWltb3Z5dWRyYWtzZnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDcyNDMsImV4cCI6MjA0MzAyMzI0M30.1N7mOdA8CyiVL1HcBgR67Er53F109HckXpUXnpJfv2s";

const url = window.__API_CFG__.contact_url;
//const headers = window.__API_CFG__.contact_headers;
const headers = {
  "apikey": apiKey,
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json",
  "Prefer": "return=minimal"
};

document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const body = {
    product: "Life_Decked Website",
    first_name: document.getElementById('firstName').value,
    last_name: document.getElementById('lastName').value || null,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    body: document.getElementById('body').value,
  };

  console.log(body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text(); // or response.json() if needed
    console.log("Insert successful:", data);
  } catch (error) {
    console.error("Insert failed:", error);
  }
});

/*
// Ensure shared config lives on window.__API_CFG__ (do not redeclare API_CFG)
window.__API_CFG__ = window.__API_CFG__ || (window.API_CONFIG || window.API_Config || window.apiConfig);

// contact-form.js
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    product: "Life_Decked Website",
    first_name: document.getElementById('firstName').value,
    last_name: document.getElementById('lastName').value || null,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    body: document.getElementById('body').value,
  };
  const data_json = JSON.stringify(data);
console.log(data_json);
  try {
    const response = await fetch(window.__API_CFG__.contact_url, {
      method: 'POST',
     // headers: window.__API_CFG__.contact_headers      ,
     header: {'Content-Type': 'application/json',
        'apikey': window.__API_CFG__.Anon_key,
        'Authorization': 'Bearer ${window.__API_CFG__.Anon_key}',
        'Prefer': 'return=representation'
     },
      body: data_json
    });


    /*
contact_headers: {
        'Content-Type': 'application/json',
        'apikey': Anon_key,
        'Authorization': `Bearer ${Anon_key}`,
        'Prefer': 'return=representation'
      },
    */
/*
    if (response.ok) {
      alert('Message sent successfully!');
      document.getElementById('contactForm').reset();
    } else {
      alert('Failed to send message.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
  }
});

*/