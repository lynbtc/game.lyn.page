# Skoledi

A fake Danish school portal that secretly contains browser games.

The landing page looks exactly like a real school portal (Aula/Skoleintra). No visible game elements. A secret trigger reveals a game selection layer.

**[skoledi.lyn.page](https://skoledi.lyn.page)**

---

## the secret

Click the **Skoledi** logo 5 times fast. The main content area transforms into a game selection grid. Games load inside the portal — the header and sidebar stay visible at all times.

Press **Escape** to return to the game grid. Click the logo 5x again to return to the boring school portal.

## games

| game | path | description |
|---|---|---|
| LYN Runner | `/runner/` | Endless runner. Stack one bitcoin. |

Games are registered in `games.json` and rendered dynamically.

## contributing

Want to add a game? Here's how:

1. **Fork this repo**
2. **Create a subdirectory** for your game (e.g. `/snake/`)
3. **Build your game** as static HTML — no frameworks, no build step
4. **Add an entry** to `games.json`:
   ```json
   {
     "name": "Your Game",
     "path": "/your-game/",
     "description": "Short description.",
     "thumbnail": "/your-game/preview.png"
   }
   ```
5. **Test it** — the game must work within a constrained content area (not fullscreen). The portal header and sidebar are always visible.
6. **Open a PR**

### game guidelines

- Static HTML only. No build tools, no frameworks.
- Must work inside an iframe within the portal's main content area.
- Keep file sizes reasonable — no massive assets.
- Game should be playable on both desktop and mobile.

## project structure

```
/index.html      ← school portal (Danish)
/style.css       ← portal stylesheet
/skoledi.js      ← secret trigger, game layer, clock
/games.json      ← game registry
/runner/         ← LYN runner (first game)
```

## run locally

Serve from any static file server. The simplest option:

```
npx serve .
```

Or just open `index.html` in a browser (note: `fetch()` for games.json requires a server).

## deploy

Push to `main` — Netlify auto-deploys. No build command needed.

## tech

- Static HTML, CSS, vanilla JS
- No frameworks, no dependencies, no build tools
- Same-origin iframes for game loading
- Danish language throughout the portal UI

## license

MIT

---

[lyn.page](https://lyn.page)
