# A House Full of Love — Mother's Day Platformer

A short browser game for Mother's Day. A blonde-haired mom walks through a
three-floor house and opens doors. Two of them hide her family — find both,
get a hug, watch the confetti fall.

## Play it

Open `index.html` in any modern browser. No install, no build step.

For sharing without a server (e.g. emailing a folder), the game runs straight
from `file://` — your wife can just double-click `index.html`.

For a hosted link, push this repo to GitHub and turn on **Pages** under the
repo's Settings → Pages → Deploy from branch → root.

## Controls

- **Move:** Arrow keys or **A / D**
- **Jump:** **Space** (or **W** / **↑**)
- **Open a door:** **E** (or **↓** / **S**) when standing in front of one

## Personalize before sharing

Open `game.js` and edit the two constants near the top:

```js
const DAUGHTER_NAME = "Sweetheart"; // PERSONALIZE
const HUSBAND_NAME  = "Honey";      // PERSONALIZE
```

These show up on door reveals and in the celebration subtitle.

## How it's built

Plain HTML5 Canvas + vanilla JavaScript — no dependencies, no build step.
Sprites are tiny pixel grids parsed from text and drawn pixel-by-pixel.
Physics is a basic AABB platformer with gravity and jumping. The two family
doors are randomized every page load.

Files:

- `index.html` — canvas + control hint
- `style.css` — page styling
- `game.js` — everything else (sprites, level, physics, ending sequence)
