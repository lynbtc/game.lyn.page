/* ═══════════════════════════════════════════
   Skoledi — secret game layer + fun details

   Click the Skoledi logo 5 times fast →
   game selection overlay. Escape to return.
   Logo 5x from game view → back to portal.

   Also: tiny alternating easter eggs in the
   page details that change over time.
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── State ──

    var mode = 'portal';   // 'portal' | 'games' | 'playing'
    var games = [];
    var clickTimestamps = [];

    // ── DOM refs ──

    var logo = document.getElementById('logo-trigger');
    var portalContent = document.getElementById('portal-content');
    var gameLayer = document.getElementById('game-layer');
    var gameGrid = document.getElementById('game-grid');
    var iframeWrap = document.getElementById('game-iframe-wrap');
    var iframe = document.getElementById('game-iframe');
    var backBtn = document.getElementById('game-back-btn');

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

    // ── Secret trigger: 5 rapid clicks on any logo ──

    var CLICK_THRESHOLD = 5;
    var CLICK_WINDOW = 1200;

    var logoGames = document.getElementById('logo-trigger-games');

    function handleLogoClick() {
        var now = Date.now();
        clickTimestamps.push(now);

        clickTimestamps = clickTimestamps.filter(function (t) {
            return now - t < CLICK_WINDOW;
        });

        if (clickTimestamps.length >= CLICK_THRESHOLD) {
            clickTimestamps = [];
            toggleSecret();
        }
    }

    logo.addEventListener('click', handleLogoClick);
    if (logoGames) logoGames.addEventListener('click', handleLogoClick);

    // Touch: use touchend for faster response on mobile (no 300ms delay)
    logo.addEventListener('touchend', function (e) {
        e.preventDefault();
        handleLogoClick();
    });
    if (logoGames) {
        logoGames.addEventListener('touchend', function (e) {
            e.preventDefault();
            handleLogoClick();
        });
    }

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
            document.body.style.overflow = '';
        }, 10);
    }

    function showGames() {
        mode = 'games';
        pushState('games');
        portalContent.style.opacity = '0';
        setTimeout(function () {
            portalContent.style.display = 'none';
            gameLayer.style.display = 'block';
            gameLayer.offsetHeight;
            gameLayer.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }, 200);
    }

    function launchGame(index) {
        var game = games[index];
        if (!game) return;
        mode = 'playing';
        pushState('playing');
        gameLayer.classList.remove('visible');
        setTimeout(function () {
            gameLayer.style.display = 'none';
            iframeWrap.style.display = 'block';
            iframeWrap.offsetHeight;
            iframeWrap.classList.add('visible');
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

    // ── Back / close buttons & Escape key ──

    var closeBtn = document.getElementById('game-close-btn');

    backBtn.addEventListener('click', function () {
        showPortal();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            showPortal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (mode === 'playing' || mode === 'games') {
                showPortal();
            }
        }
    });

    // ── Android back button / browser back ──
    // Push history state when entering game modes so the
    // hardware back button navigates within the app.

    function pushState(newMode) {
        try {
            history.pushState({ mode: newMode }, '');
        } catch (e) {}
    }

    window.addEventListener('popstate', function (e) {
        if (mode === 'playing' || mode === 'games') {
            showPortal();
        }
    });

    // ── Portal content transitions ──

    portalContent.style.transition = 'opacity 0.2s ease';

    /* ═══════════════════════════════════════════
       FUN ALTERNATING DETAILS
       Small things that change to keep the page
       alive if you look closely.
       ═══════════════════════════════════════════ */

    // 1. Screen badge emoji cycles through subjects
    var badges = ['⭐', '📐', '📏', '🔢', '📊', '🧮', '✏️', '💡', '🎯', '🏆'];
    var badgeEl = document.getElementById('screen-badge');
    if (badgeEl) {
        setInterval(function () {
            badgeEl.textContent = badges[Math.floor(Math.random() * badges.length)];
        }, 4000);
    }

    // 2. Formula in the laptop screen changes
    var formulas = [
        'a² + b² = c²',
        'E = mc²',
        'π ≈ 3,14159',
        'Δ = b² − 4ac',
        'f(x) = mx + b',
        'A = πr²',
        'sin²θ + cos²θ = 1',
        '∑ = n(n+1)/2',
        'V = 4/3 πr³',
        'x = −b ± √Δ / 2a',
    ];
    var formulaEl = document.getElementById('screen-formula');
    if (formulaEl) {
        setInterval(function () {
            formulaEl.style.opacity = '0';
            formulaEl.style.transition = 'opacity 0.3s';
            setTimeout(function () {
                formulaEl.textContent = formulas[Math.floor(Math.random() * formulas.length)];
                formulaEl.style.opacity = '1';
            }, 300);
        }, 7000);
    }

    // 3. The "løste opgaver" stat ticks up slowly like a live counter
    var tasksEl = document.getElementById('stat-tasks');
    if (tasksEl) {
        var taskCount = 14238471;
        setInterval(function () {
            taskCount += Math.floor(Math.random() * 3) + 1;
            tasksEl.textContent = taskCount.toLocaleString('da-DK');
        }, 2200);
    }

    // 4. Schools stat occasionally bumps up by 1
    var schoolsEl = document.getElementById('stat-schools');
    if (schoolsEl) {
        var schoolCount = 1847;
        setInterval(function () {
            if (Math.random() < 0.15) {
                schoolCount++;
                schoolsEl.textContent = schoolCount.toLocaleString('da-DK');
            }
        }, 12000);
    }

})();
