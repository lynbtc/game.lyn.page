# Skoledi

Fake Danish school portal that secretly contains browser games.
Deployed at skoledi.lyn.page via Netlify. Static HTML, no build step.

## Structure

```
/index.html      ← school portal (Danish, looks like Aula/Skoleintra)
/style.css       ← portal styles
/skoledi.js      ← secret trigger logic, game layer, clock
/games.json      ← game registry [{name, path, description, thumbnail}]
/runner/          ← LYN runner game (first game)
```

## How it works

- Landing page is a 100% convincing Danish school portal. No game elements visible.
- Click the Skoledi logo 5 times fast → reveals game selection grid.
- Games load in an iframe inside the main content area. Header + sidebar stay visible.
- Escape returns to game grid. Logo 5x from any game state returns to portal.
- Games are registered in games.json and rendered dynamically.

## Adding a new game

1. Create a subdirectory (e.g. `/mygame/`) with its own index.html
2. Add an entry to games.json
3. The game must work within a constrained content area (not fullscreen)

## Tech constraints

- Static HTML only. No frameworks, no build tools.
- Same-origin iframes (no cross-origin restrictions).
- Danish language throughout the portal UI.
- No password gate on this site.

## Deploy

Push to main → Netlify auto-deploys. No build command needed.
