(function applyFallbackMode() {
    const url = new URL(window.location.href);
    if (url.searchParams.get('sywf_fallback') !== '1') return;

    document.documentElement.classList.add('sywf-fallback');

    // Keep the mode active but clean the marker from the address bar.
    url.searchParams.delete('sywf_fallback');
    window.history.replaceState(null, '', url.toString());
})();
