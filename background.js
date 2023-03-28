chrome.action.onClicked.addListener(tab => {
    if (!tab.url || !tab.url.includes('youtube.com/watch?')) return;
    void chrome.windows.create({
        url: `https://youtube.com/embed/` + new URL(tab.url).searchParams.get('v'),
        type: 'popup',
        width: 960,
        height: 540
    });
    void chrome.tabs.remove(tab.id);
});
