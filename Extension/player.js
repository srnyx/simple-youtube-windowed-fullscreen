function isValidVideoId(videoId) {
    return /^[\w-]{11}$/.test(videoId);
}

function getEmbedUrl(params, videoId) {
    if (!isValidVideoId(videoId)) return [];

    // URL
    const embedUrl = new URL(`https://youtube.com/embed/${videoId}`);
    embedUrl.searchParams.set('autoplay', '1');
    embedUrl.searchParams.set('modestbranding', '1');
    embedUrl.searchParams.set('playsinline', '1');
    embedUrl.searchParams.set('enablejsapi', '1');

    // t/start parameter
    const start = params.get('start');
    if (start) embedUrl.searchParams.set('start', start);

    return embedUrl.toString();
}

function getFallbackUrl(params, videoId) {
    if (!isValidVideoId(videoId)) return 'https://youtube.com';

    // URL
    const watchUrl = new URL('https://youtube.com/watch');
    watchUrl.searchParams.set('v', videoId);
    watchUrl.searchParams.set('sywf_fallback', '1');

    // t/start parameter
    const start = params.get('start');
    if (start) watchUrl.searchParams.set('t', start);

    return watchUrl.toString();
}

function parseMessageData(data) {
    if (typeof data === 'object' && data) return data;
    if (typeof data !== 'string') return null;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

function isPlayableState(value) {
    return value === 0 || value === 1 || value === 2 || value === 3 || value === 5;
}

(function initPlayer() {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('videoId') || '';
    const fallbackUrl = getFallbackUrl(params, videoId);
    const player = document.getElementById('player');

    if (!player) {
        window.location.replace(fallbackUrl);
        return;
    }

    const cleanup = () => {
        window.clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
    };

    let settled = false;

    // Embed success
    const succeed = () => {
        if (settled) return;
        settled = true;
        cleanup();
        player.style.display = 'block';
    };

    // Embed failed, use fallback
    const fail = () => {
        if (settled) return;
        settled = true;
        cleanup();
        window.location.replace(fallbackUrl);
    };

    const onMessage = (event) => {
        if (event.source !== player.contentWindow) return;

        // Check if YouTube
        try {
            const host = new URL(event.origin).hostname.toLowerCase();
            if (!(host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com'))) {
                return;
            }
        } catch {
            return;
        }

        const data = parseMessageData(event.data);
        if (!data || !data.event) return;

        // Error
        if (data.event === 'onError') {
            fail();
            return;
        }

        // State change
        if (data.event === 'onStateChange' && isPlayableState(data.info)) {
            succeed();
            return;
        }

        // Info delivery
        if (data.event === 'infoDelivery' && data.info && isPlayableState(data.info.playerState)) {
            succeed();
        }
    };

    const timeout = window.setTimeout(fail, 6000);
    window.addEventListener('message', onMessage);

    player.addEventListener('load', () => {
        const frame = player.contentWindow;
        if (!frame) return;

        frame.postMessage(JSON.stringify({ event: 'listening', channel: 'widget' }), '*');
        frame.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*');
        frame.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onError'] }), '*');
    }, { once: true });

    player.src = getEmbedUrl(params, videoId);
})();
