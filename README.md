# LYN. runner

A minimal endless runner. Stack ₿100,000,000. One bitcoin.

**[play →](https://game.lyn.page)**

---

## what

Three-lane browser game built for [LYN.](https://lyn.page) — a modular sauna system with integrated bitcoin mining.

Run. Dodge obstacles. Collect bitcoin. Reach one full bitcoin (₿100,000,000 per [BIP 177](https://bips.dev/177/)) and you win.

## how to play

| input | action |
|---|---|
| ← → | switch lanes |
| ↑ | jump |
| ↓ | slide |
| swipe | mobile controls |

Collect coins to build streaks. Streaks increase your hashrate multiplier (up to ×5). Coin values scale with distance.

## run locally

Open `index.html` in a browser. That's it — zero dependencies, no build step.

## deploy

Single static file. Drop on Netlify, Vercel, GitHub Pages, or any web server.

## scoring (BIP 177)

Score follows [BIP 177](https://bips.dev/177/) — bitcoin's base unit is the standard unit of account. Displayed as `₿N,NNN,NNN` with comma formatting. Legacy BTC notation shown on game over for reference.

| distance | coin value |
|---|---|
| 0–200m | ₿10,000 |
| 200–600m | ₿50,000 |
| 600–1,200m | ₿100,000 |
| 1,200–2,500m | ₿250,000 |
| 2,500–5,000m | ₿500,000 |
| 5,000m+ | ₿1,000,000 |

## stack

Single `index.html`. Canvas rendering. No frameworks, no dependencies, no build tools.

- IBM Plex Sans / Mono + Inter
- Dark mode only
- Mobile + desktop
- High score persisted via localStorage

## license

MIT — do whatever you want.

---

[lyn.page](https://lyn.page)
