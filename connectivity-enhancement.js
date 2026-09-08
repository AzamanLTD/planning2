(() => {
  'use strict';

  const bannerId = 'azmConnectivityBanner';

  function isTesting() {
    return !!document.querySelector('.test-shell');
  }

  function render() {
    const existing = document.getElementById(bannerId);
    if (!isTesting() || navigator.onLine) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const banner = document.createElement('div');
    banner.id = bannerId;
    banner.className = 'connectivity-banner offline';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'assertive');
    banner.innerHTML = '<strong>Connection lost.</strong> This practice run remains active locally. Reconnect when possible; your saved answers are not discarded.';
    document.body.appendChild(banner);
  }

  function announceOnline() {
    const banner = document.getElementById(bannerId);
    if (!banner) return;
    banner.className = 'connectivity-banner online';
    banner.textContent = 'Connection restored.';
    setTimeout(() => banner.remove(), 1800);
  }

  window.addEventListener('offline', render);
  window.addEventListener('online', announceOnline);

  const observer = new MutationObserver(render);
  observer.observe(document.body, { childList: true, subtree: true });
  render();
})();
