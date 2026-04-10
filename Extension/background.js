function createWindow(tab) {
    if (!tab || !tab.url || !tab.url.includes('youtube.com/watch?')) return;

    // Parse URL
    let url;
    try {
        url = new URL(tab.url);
    } catch {
        return;
    }

    // Video ID
    const videoId = url.searchParams.get('v');
    if (!videoId) return;

    // Pop-up URL
    const popupUrl = new URL(chrome.runtime.getURL('player.html'));
    popupUrl.searchParams.set('videoId', videoId);

    // t/start parameter
    const start = url.searchParams.get('t') || url.searchParams.get('start');
    if (start) popupUrl.searchParams.set('start', start);

    // Open pop-up
    void chrome.windows.create({
        url: popupUrl.toString(),
        type: 'popup',
        width: 960,
        height: 540
    });

    // Close original tab
    if (tab.id) void chrome.tabs.remove(tab.id);
}

// When extension is clicked on in toolbar
chrome.action.onClicked.addListener(createWindow);

// When keyboard shortcut is pressed
chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'windowed-fullscreen') createWindow(tab);
});
