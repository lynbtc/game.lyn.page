# Skoledi

Fake Danish school portal (looks like Skoledu.dk) that secretly contains browser games.
Deployed at skoledi.lyn.page via Netlify. Static HTML, no build step.

## Structure

```
/index.html      ← landing page (matches Skoledu's design — logo, hero, green blob)
/style.css       ← portal styles (Skoledu's exact color palette)
/skoledi.js      ← secret trigger logic, game layer, fun alternating details
/games.json      ← game registry [{name, path, description, thumbnail}]
/runner/          ← LYN runner game (first game)
```

## How it works

- Landing page looks exactly like Skoledu.dk but says "Skoledi". Same colors, layout, vibe.
- Small fun details: formulas cycle in the laptop mockup, task counter ticks up, emoji badges rotate.
- Click the Skoledi logo 5 times fast → fullscreen game selection overlay.
- Games load in a fullscreen iframe. Back button or Escape returns to game grid.
- Logo 5x from any game state returns to the landing page.
- Games are registered in games.json and rendered dynamically.

## Adding a new game

1. Create a subdirectory (e.g. `/mygame/`) with its own index.html
2. Add an entry to games.json
3. The game gets fullscreen iframe space

## Tech constraints

- Static HTML only. No frameworks, no build tools.
- Same-origin iframes (no cross-origin restrictions).
- Danish language throughout.
- No password gate on this site.

## Deploy

Push to main → Netlify auto-deploys. No build command needed.
