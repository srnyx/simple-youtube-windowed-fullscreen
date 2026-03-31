function createWindow(tab) {
    if (!tab.url || !tab.url.includes('youtube.com/watch?')) return;
    const videoId = new URL(tab.url).searchParams.get('v');
    if (!videoId) return;
    void chrome.windows.create({
        url: chrome.runtime.getURL('player.html') + '?v=' + videoId,
        type: 'popup',
        width: 960,
        height: 540
    });
    void chrome.tabs.remove(tab.id);
}

// When extension is clicked on in toolbar
chrome.action.onClicked.addListener(createWindow);

// When keyboard shortcut is pressed
chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'windowed-fullscreen') createWindow(tab);
});
