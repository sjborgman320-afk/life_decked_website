// Fetch and insert header.html into the page (with graceful fallback)
(async function loadHeader() {
  const containerId = 'site-header-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.prepend(container);
  }

  // If page is opened via file://, avoid fetch (browsers block fetch to local files).
  if (location.protocol === 'file:') {
    console.warn('Running from file:// — skipping fetch of header.html and using fallback header.');
    container.innerHTML = `
      <header class="site-header">
        <h1>Life Decked Card Library</h1>
      </header>
    `;
    return;
  }

  try {
    const resp = await fetch('./header.html', { cache: 'no-cache' });
    if (!resp.ok) throw new Error('Header fetch failed: ' + resp.status);
    const html = await resp.text();
    container.innerHTML = html;
  } catch (err) {
    console.warn('Could not load header.html:', err);
    container.innerHTML = `
      <header class="site-header">
        <h1>Life Decked Card Library</h1>
      </header>
    `;
  }
})();