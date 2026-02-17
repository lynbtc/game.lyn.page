/* ═══════════════════════════════════════════
   Skoledi — secret game layer controller

   Click the Skoledi logo 5 times fast to
   reveal the game selection grid. Press
   Escape or the back button to return.
   Click the logo 5x again from game view
   to return to the school portal.
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── State ──

    let mode = 'portal';   // 'portal' | 'games' | 'playing'
    let games = [];
    let clickTimestamps = [];

    // ── DOM refs ──

    const logo = document.getElementById('logo-trigger');
    const portalContent = document.getElementById('portal-content');
    const gameLayer = document.getElementById('game-layer');
    const gameGrid = document.getElementById('game-grid');
    const iframeWrap = document.getElementById('game-iframe-wrap');
    const iframe = document.getElementById('game-iframe');
    const backBtn = document.getElementById('game-back-btn');

    // ── Clock ──

    const clockEl = document.getElementById('header-clock');

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = h + ':' + m;
    }

    updateClock();
    setInterval(updateClock, 10000);

    // ── Date display ──

    const dateEl = document.getElementById('welcome-date');
    if (dateEl) {
        const now = new Date();
        const days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
        const months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni',
                        'juli', 'august', 'september', 'oktober', 'november', 'december'];
        dateEl.textContent = days[now.getDay()] + ' d. ' +
            now.getDate() + '. ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }

    // ── Load games registry ──

    fetch('/games.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            games = data;
            renderGameGrid();
        })
        .catch(function () {
            games = [];
        });

    // ── Render game selection grid ──

    function renderGameGrid() {
        gameGrid.innerHTML = '';
        games.forEach(function (game, i) {
            var card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-index', i);

            var thumb = document.createElement('div');
            thumb.className = 'game-card-thumb';
            if (game.thumbnail) {
                var img = document.createElement('img');
                img.src = game.thumbnail;
                img.alt = game.name;
                thumb.appendChild(img);
            }

            var info = document.createElement('div');
            info.className = 'game-card-info';

            var name = document.createElement('div');
            name.className = 'game-card-name';
            name.textContent = game.name;

            var desc = document.createElement('div');
            desc.className = 'game-card-desc';
            desc.textContent = game.description;

            info.appendChild(name);
            info.appendChild(desc);
            card.appendChild(thumb);
            card.appendChild(info);

            card.addEventListener('click', function () {
                launchGame(i);
            });

            gameGrid.appendChild(card);
        });
    }

    // ── Secret trigger: 5 rapid clicks on logo ──

    var CLICK_THRESHOLD = 5;
    var CLICK_WINDOW = 1200; // ms — all 5 clicks within this window

    logo.addEventListener('click', function () {
        var now = Date.now();
        clickTimestamps.push(now);

        // Keep only clicks within the time window
        clickTimestamps = clickTimestamps.filter(function (t) {
            return now - t < CLICK_WINDOW;
        });

        if (clickTimestamps.length >= CLICK_THRESHOLD) {
            clickTimestamps = [];
            toggleSecret();
        }
    });

    // ── Mode switching ──

    function toggleSecret() {
        if (mode === 'portal') {
            showGames();
        } else {
            showPortal();
        }
    }

    function showPortal() {
        mode = 'portal';
        iframe.src = 'about:blank';
        iframeWrap.classList.remove('visible');
        iframeWrap.style.display = 'none';
        gameLayer.classList.remove('visible');
        setTimeout(function () {
            gameLayer.style.display = 'none';
            portalContent.style.display = 'block';
            portalContent.offsetHeight;
            portalContent.style.opacity = '1';
        }, 10);
    }

    function showGames() {
        mode = 'games';
        portalContent.style.opacity = '0';
        setTimeout(function () {
            portalContent.style.display = 'none';
            gameLayer.style.display = 'block';
            // Force reflow
            gameLayer.offsetHeight;
            gameLayer.classList.add('visible');
        }, 200);
    }

    function launchGame(index) {
        var game = games[index];
        if (!game) return;
        mode = 'playing';
        gameLayer.classList.remove('visible');
        setTimeout(function () {
            gameLayer.style.display = 'none';
            iframeWrap.classList.add('visible');
            iframeWrap.style.display = 'block';
            iframe.src = game.path;
        }, 200);
    }

    function exitGame() {
        if (mode !== 'playing') return;
        mode = 'games';
        iframe.src = 'about:blank';
        iframeWrap.classList.remove('visible');
        iframeWrap.style.display = 'none';
        gameLayer.style.display = 'block';
        gameLayer.offsetHeight;
        gameLayer.classList.add('visible');
    }

    // ── Back button & Escape key ──

    backBtn.addEventListener('click', function () {
        exitGame();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (mode === 'playing') {
                exitGame();
            } else if (mode === 'games') {
                showPortal();
            }
        }
    });

    // ── Schedule highlight: mark current period ──

    (function highlightSchedule() {
        var entries = document.querySelectorAll('.schedule-entry');
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        var currentMinutes = h * 60 + m;

        entries.forEach(function (entry) {
            var timeStr = entry.getAttribute('data-start');
            if (!timeStr) return;
            var parts = timeStr.split(':');
            var startMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            var endStr = entry.getAttribute('data-end');
            var endParts = endStr ? endStr.split(':') : null;
            var endMin = endParts ? parseInt(endParts[0]) * 60 + parseInt(endParts[1]) : startMin + 45;

            if (currentMinutes >= startMin && currentMinutes < endMin) {
                entry.classList.add('now');
            }
        });
    })();

})();
