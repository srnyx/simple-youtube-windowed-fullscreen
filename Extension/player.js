const v = new URLSearchParams(location.search).get('v');
if (v && /^[A-Za-z0-9_-]{11}$/.test(v))
    document.getElementById('p').src = 'https://www.youtube-nocookie.com/embed/' + v + '?autoplay=1';
