// ============================================================================
// Mother's Day Platformer
// A short, hand-rolled HTML5 Canvas platformer for Mother's Day.
// ============================================================================

// --- Personalization (edit these before sharing) ----------------------------
const DAUGHTER_NAME = "Emma";      // PERSONALIZE
const HUSBAND_NAME  = "Sebastian"; // PERSONALIZE
const TITLE         = "A House Full of Love";

// --- Canvas -----------------------------------------------------------------
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const W = canvas.width;
const H = canvas.height;
canvas.focus();

// --- Input ------------------------------------------------------------------
const keys = {};
const justPressed = {};
const CONSUME_CODES = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyW','KeyA','KeyS','KeyD','KeyE'];
window.addEventListener('keydown', e => {
  if (!keys[e.code]) justPressed[e.code] = true;
  keys[e.code] = true;
  if (CONSUME_CODES.includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });
function pressed(...codes) {
  for (const c of codes) {
    if (justPressed[c]) { justPressed[c] = false; return true; }
  }
  return false;
}
function held(...codes) { return codes.some(c => keys[c]); }

// --- Sprite parsing ---------------------------------------------------------
// Each sprite is a multiline string. '.' or ' ' = transparent.
// '0'-'9' = palette indices 0-9, 'A'-'Z' = 10-35.
function parseSprite(str) {
  const lines = str.split('\n').map(l => l.replace(/\s+$/, ''));
  while (lines.length && lines[0].length === 0) lines.shift();
  while (lines.length && lines[lines.length - 1].length === 0) lines.pop();
  const h = lines.length;
  const w = Math.max(...lines.map(l => l.length));
  const pixels = [];
  for (const line of lines) {
    const row = new Array(w).fill(-1);
    for (let x = 0; x < line.length; x++) {
      const c = line[x];
      if (c === '.' || c === ' ') row[x] = -1;
      else if (c >= '0' && c <= '9') row[x] = c.charCodeAt(0) - 48;
      else row[x] = c.toUpperCase().charCodeAt(0) - 55;
    }
    pixels.push(row);
  }
  return { w, h, pixels };
}

function drawSprite(sprite, palette, x, y, scale, flip = false) {
  ctx.save();
  if (flip) {
    ctx.translate(Math.round(x + sprite.w * scale), Math.round(y));
    ctx.scale(-1, 1);
  } else {
    ctx.translate(Math.round(x), Math.round(y));
  }
  for (let py = 0; py < sprite.h; py++) {
    for (let px = 0; px < sprite.w; px++) {
      const idx = sprite.pixels[py][px];
      if (idx < 0) continue;
      const color = palette[idx];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(px * scale, py * scale, scale, scale);
    }
  }
  ctx.restore();
}

// --- Palettes ---------------------------------------------------------------
const MOM_PAL = [
  null,
  '#dfba7e', '#9b7e54',
  '#f3c9a5', '#d99e7a',
  '#ffffff', '#d6d6e0',
  '#3e6da6', '#27466b',
  '#5a3a22',
  '#1a1a1a',
  '#ef7a99',
];

const DAUGHTER_PAL = [
  null,
  '#8a5e3a', '#4a2e18',
  '#f3c9a5', '#d99e7a',
  '#5a3a22',
  '#f29bc0', '#fcd0e0',
  '#222222',
  '#1a1a1a',
  '#ffffff',
  '#ef7a99',
];

const HUSBAND_PAL = [
  null,
  '#6e4a2a', '#3e2818',
  '#e8b591', '#c98e6c',
  '#3e7fb8',
  '#4f8b5c', '#365e3f',
  '#b89968', '#7d6440',
  '#3a2818',
  '#1a1a1a',
  '#ef7a99',
];

// --- Sprites ----------------------------------------------------------------
// MOM (14 × 22)
const MOM_STAND = parseSprite(`
....11111.....
...1122221....
..112222221...
..122333321...
..123333321...
..123A33A21...
..123333321...
..1233BB321...
.122333333221.
122..3333..221
12255555555221
12555555555521
12555555555521
.255555555552.
...55555555...
...77777777...
...77777777...
...777..777...
...777..777...
...777..777...
...777..777...
...999..999...
`);

const MOM_STEP = parseSprite(`
....11111.....
...1122221....
..112222221...
..122333321...
..123333321...
..123A33A21...
..123333321...
..1233BB321...
.122333333221.
122..3333..221
12255555555221
12555555555521
12555555555521
.255555555552.
...55555555...
...77777777...
...77777777...
....777777....
....77..77....
....77..77....
....99..99....
....99..99....
`);

const MOM_HUG = parseSprite(`
....11111.....
...1122221....
..112222221...
..122333321...
..123333321...
..123A33A21...
..123333321...
..1233BB321...
.122333333221.
122..3333..221
33555555555533
33555555555533
.35555555553..
.25555555552..
...55555555...
...77777777...
...77777777...
...777..777...
...777..777...
...777..777...
...777..777...
...999..999...
`);

// DAUGHTER (12 × 18)
const DAUGHTER_STAND = parseSprite(`
...111111...
..11122211..
.1122222211.
.1233333321.
.1235335321.
.1233333321.
..123BB321..
.1233333321.
126666666621
166666666661
166677776661
166666666661
.2666666662.
..66666666..
...33..33...
...AA..AA...
...88..88...
...88..88...
`);

const DAUGHTER_STEP = parseSprite(`
...111111...
..11122211..
.1122222211.
.1233333321.
.1235335321.
.1233333321.
..123BB321..
.1233333321.
126666666621
166666666661
166677776661
166666666661
.2666666662.
..66666666..
....3333....
....AAAA....
...88..88...
...888888...
`);

const DAUGHTER_HUG = parseSprite(`
...111111...
..11122211..
.1122222211.
.1233333321.
.1235335321.
.1233333321.
..123BB321..
.1233333321.
3.66666666.3
3666666666.3
666677776666
666666666666
.6666666666.
..66666666..
...33..33...
...AA..AA...
...88..88...
...88..88...
`);

// HUSBAND (14 × 26)
const HUSBAND_STAND = parseSprite(`
....111111....
...11222211...
...12222221...
....333333....
....353353....
....333333....
.....3CC3.....
.....3333.....
.....3333.....
...666666666..
..66666666666.
..66666666666.
..66666666666.
..66666666666.
..66666666666.
...888888888..
...888888888..
...888..8888..
...333..3333..
...333..3333..
...333..3333..
...333..3333..
...333..3333..
...333..3333..
...AAA..AAAA..
...AAA..AAAA..
`);

const HUSBAND_STEP = parseSprite(`
....111111....
...11222211...
...12222221...
....333333....
....353353....
....333333....
.....3CC3.....
.....3333.....
.....3333.....
...666666666..
..66666666666.
..66666666666.
..66666666666.
..66666666666.
..66666666666.
...888888888..
...888888888..
....8888888...
....333333....
....33..3.....
....33..3.....
....33..33....
....33..33....
....33..33....
....AA..AA....
....AAAAAAA...
`);

const HUSBAND_HUG = parseSprite(`
....111111....
...11222211...
...12222221...
....333333....
....353353....
....333333....
.....3CC3.....
.....3333.....
.....3333.....
33.666666666.3
3366666666666.
3666666666666.
.66666666666..
..66666666666.
..66666666666.
...888888888..
...888888888..
...888..8888..
...333..3333..
...333..3333..
...333..3333..
...333..3333..
...333..3333..
...333..3333..
...AAA..AAAA..
...AAA..AAAA..
`);

// --- Sprite metadata --------------------------------------------------------
const SPRITE_SCALE = 4;

const MOM = {
  stand: MOM_STAND, step: MOM_STEP, hug: MOM_HUG,
  pal: MOM_PAL, scale: SPRITE_SCALE,
  w: MOM_STAND.w * SPRITE_SCALE, h: MOM_STAND.h * SPRITE_SCALE, // 56 × 88
};
const DAUGHTER = {
  stand: DAUGHTER_STAND, step: DAUGHTER_STEP, hug: DAUGHTER_HUG,
  pal: DAUGHTER_PAL, scale: SPRITE_SCALE,
  w: DAUGHTER_STAND.w * SPRITE_SCALE, h: DAUGHTER_STAND.h * SPRITE_SCALE, // 48 × 72
};
const HUSBAND = {
  stand: HUSBAND_STAND, step: HUSBAND_STEP, hug: HUSBAND_HUG,
  pal: HUSBAND_PAL, scale: SPRITE_SCALE,
  w: HUSBAND_STAND.w * SPRITE_SCALE, h: HUSBAND_STAND.h * SPRITE_SCALE, // 56 × 104
};

// --- Level layout -----------------------------------------------------------
// Three floors. y values are the standing surface (top of platform).
const FLOOR1_Y = 510;
const FLOOR2_Y = 360;
const FLOOR3_Y = 210;

const platforms = [
  // Floor 1 (full ground)
  { x: 0, y: FLOOR1_Y, w: W, h: 30 },

  // Floor 2: gap on right for stairs (x=440..760)
  { x: 0,   y: FLOOR2_Y, w: 440, h: 14 },
  { x: 760, y: FLOOR2_Y, w: 200, h: 14 },

  // Stairs floor 1 -> floor 2 (going up to the right)
  { x: 440, y: 480, w: 60, h: 30 },
  { x: 500, y: 450, w: 60, h: 30 },
  { x: 560, y: 420, w: 60, h: 30 },
  { x: 620, y: 390, w: 60, h: 30 },
  { x: 680, y: 360, w: 80, h: 30 }, // joins floor 2 right segment

  // Floor 3: gap on left for stairs (x=180..490)
  { x: 0,   y: FLOOR3_Y, w: 180, h: 14 },
  { x: 490, y: FLOOR3_Y, w: 470, h: 14 },

  // Stairs floor 2 -> floor 3 (going up to the left)
  { x: 430, y: 330, w: 60, h: 30 },
  { x: 370, y: 300, w: 60, h: 30 },
  { x: 310, y: 270, w: 60, h: 30 },
  { x: 250, y: 240, w: 60, h: 30 },
  { x: 100, y: 210, w: 150, h: 30 }, // joins floor 3 left segment
];

// No side walls: the player can walk off either screen edge and wrap
// around to the opposite side at the same height. This is what lets her
// reach the right segment of floor 2 (which would otherwise require
// dropping down to floor 1 and climbing the right-hand staircase).
const walls = [];

// All collision rectangles
const solids = [...platforms, ...walls];

// --- Doors ------------------------------------------------------------------
// w=58, h=110, base on the floor surface.
const DOOR_W = 58;
const DOOR_H = 110;

function makeDoor(id, x, surfaceY) {
  return {
    id,
    x,
    y: surfaceY - DOOR_H,
    w: DOOR_W,
    h: DOOR_H,
    open: false,
    contents: null, // 'daughter' | 'husband' | 'cat' | 'flowers' | 'cake' | 'card'
    surfaceY,
  };
}

const doors = [
  makeDoor(0,  90, FLOOR1_Y),
  makeDoor(1, 240, FLOOR1_Y),
  makeDoor(2, 110, FLOOR2_Y),
  makeDoor(3, 820, FLOOR2_Y),
  makeDoor(4, 580, FLOOR3_Y),
  makeDoor(5, 760, FLOOR3_Y),
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function assignDoorContents() {
  const order = shuffle(doors.map((_, i) => i));
  doors[order[0]].contents = 'daughter';
  doors[order[1]].contents = 'husband';
  const decoys = ['cat', 'flowers', 'cake', 'card'];
  for (let i = 0; i < 4; i++) {
    doors[order[2 + i]].contents = decoys[i];
  }
}

// --- Player -----------------------------------------------------------------
const player = {
  x: 80,
  y: FLOOR1_Y - MOM.h,
  vx: 0,
  vy: 0,
  w: MOM.w,
  h: MOM.h,
  facing: 1,
  onGround: false,
  walkTimer: 0,
  walkFrame: 0,
};

// --- Family -----------------------------------------------------------------
const family = {
  daughter: { found: false, doorIdx: -1, x: 0, y: 0, anchorX: 0, anchorY: 0, hugX: 0, hugY: 0, walkFrame: 0, walkTimer: 0, facing: 1, hugging: false },
  husband:  { found: false, doorIdx: -1, x: 0, y: 0, anchorX: 0, anchorY: 0, hugX: 0, hugY: 0, walkFrame: 0, walkTimer: 0, facing: -1, hugging: false },
};

// --- Game state -------------------------------------------------------------
const state = {
  phase: 'play',     // 'play' | 'ending' | 'celebration'
  promptDoor: -1,
  endingTimer: 0,
  textAlpha: 0,
  confetti: [],
  toast: null,       // { text, until } for short messages on door reveals
  speech: null,      // { text, startTime } for the opening speech bubble
};

// --- Physics ----------------------------------------------------------------
const GRAVITY = 0.55;
const MOVE_SPEED = 4;
const JUMP_V = -12;
const MAX_FALL = 14;

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// --- Confetti ---------------------------------------------------------------
const CONFETTI_COLORS = ['#ff8fb3','#ffd479','#a3e2c1','#c9b6ff','#9fd6f5','#ffb38a','#ffffff'];
function makeConfetti() {
  return {
    x: Math.random() * W,
    y: -10,
    vx: (Math.random() - 0.5) * 2.5,
    vy: 1 + Math.random() * 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.25,
    size: 4 + Math.floor(Math.random() * 4),
    sway: Math.random() * Math.PI * 2,
  };
}

// --- Update -----------------------------------------------------------------
function updatePlay() {
  // Horizontal input
  player.vx = 0;
  if (held('ArrowLeft', 'KeyA'))  { player.vx = -MOVE_SPEED; player.facing = -1; }
  if (held('ArrowRight', 'KeyD')) { player.vx =  MOVE_SPEED; player.facing =  1; }

  // Jump
  if (pressed('Space', 'ArrowUp', 'KeyW') && player.onGround) {
    player.vy = JUMP_V;
    player.onGround = false;
  }

  // Gravity
  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL);

  // Move X with collision
  player.x += player.vx;
  for (const s of solids) {
    if (rectsOverlap(player, s)) {
      if (player.vx > 0) player.x = s.x - player.w;
      else if (player.vx < 0) player.x = s.x + s.w;
    }
  }
  // Wrap around the screen edges (Pac-Man style) so the right segment of
  // floor 2 is reachable by walking off the right edge.
  if (player.x > W) player.x = -player.w;
  else if (player.x + player.w < 0) player.x = W;

  // Move Y with collision
  player.y += player.vy;
  let landed = false;
  for (const s of solids) {
    if (rectsOverlap(player, s)) {
      if (player.vy > 0) {
        player.y = s.y - player.h;
        player.vy = 0;
        landed = true;
      } else if (player.vy < 0) {
        player.y = s.y + s.h;
        player.vy = 0;
      }
    }
  }
  player.onGround = landed;

  // Walk animation
  if (player.vx !== 0 && player.onGround) {
    player.walkTimer++;
    if (player.walkTimer >= 8) {
      player.walkFrame ^= 1;
      player.walkTimer = 0;
    }
  } else {
    player.walkFrame = 0;
    player.walkTimer = 0;
  }

  // Door interaction
  state.promptDoor = -1;
  for (let i = 0; i < doors.length; i++) {
    const d = doors[i];
    if (rectsOverlap(player, d)) {
      state.promptDoor = i;
      if (pressed('KeyE', 'ArrowDown', 'KeyS')) {
        if (!d.open) openDoor(d);
      }
      break;
    }
  }

  // Toast timeout
  if (state.toast && performance.now() > state.toast.until) {
    state.toast = null;
  }

  // Dismiss the opening speech bubble after a few seconds, or once she
  // starts moving (and the player has had a moment to read it).
  if (state.speech) {
    const elapsed = performance.now() - state.speech.startTime;
    if (elapsed > 5000 || (elapsed > 700 && player.vx !== 0)) {
      state.speech = null;
    }
  }
}

function openDoor(d) {
  d.open = true;
  if (d.contents === 'daughter') {
    family.daughter.found = true;
    family.daughter.doorIdx = d.id;
    family.daughter.anchorX = d.x + (d.w - DAUGHTER.w) / 2;
    family.daughter.anchorY = d.surfaceY - DAUGHTER.h;
    family.daughter.x = family.daughter.anchorX;
    family.daughter.y = family.daughter.anchorY;
    showToast(`${DAUGHTER_NAME}!`);
  } else if (d.contents === 'husband') {
    family.husband.found = true;
    family.husband.doorIdx = d.id;
    family.husband.anchorX = d.x + (d.w - HUSBAND.w) / 2;
    family.husband.anchorY = d.surfaceY - HUSBAND.h;
    family.husband.x = family.husband.anchorX;
    family.husband.y = family.husband.anchorY;
    showToast(`${HUSBAND_NAME}!`);
  } else {
    showToast(decoyMessage(d.contents));
  }
  if (family.daughter.found && family.husband.found) {
    state.phase = 'ending';
    state.endingTimer = 0;
    state.toast = null;
  }
}

function decoyMessage(kind) {
  switch (kind) {
    case 'cat':     return "Just the cat napping...";
    case 'flowers': return "A bouquet for you!";
    case 'cake':    return "Breakfast in bed!";
    case 'card':    return "A handmade card!";
    default:        return "Empty room!";
  }
}

function showToast(text) {
  state.toast = { text, until: performance.now() + 1600 };
}

// --- Ending sequence --------------------------------------------------------
function updateEnding() {
  state.endingTimer++;

  // On first frame of ending, compute hug positions on floor 1, centered around mom's spot.
  if (state.endingTimer === 1) {
    // Move mom to a comfortable spot if she's mid-air or on a higher floor.
    // (In practice she'll be on whichever floor she opened the last door from.)
    // We'll keep her where she is and bring family to her location on the same floor.
    const momCenter = player.x + player.w / 2;
    const momSurface = player.y + player.h; // her feet
    family.daughter.hugX = momCenter - 70 - DAUGHTER.w / 2;
    family.daughter.hugY = momSurface - DAUGHTER.h;
    family.daughter.facing = 1;
    family.husband.hugX = momCenter + 70 - HUSBAND.w / 2;
    family.husband.hugY = momSurface - HUSBAND.h;
    family.husband.facing = -1;
    // Starting positions = where they were standing in their doorways
    family.daughter.startX = family.daughter.anchorX;
    family.daughter.startY = family.daughter.anchorY;
    family.husband.startX = family.husband.anchorX;
    family.husband.startY = family.husband.anchorY;
  }

  // Travel: 90-frame ease from doorway to hug position, with walk animation
  const TRAVEL = 90;
  const t = Math.min(1, state.endingTimer / TRAVEL);
  const ease = t * t * (3 - 2 * t); // smoothstep
  for (const f of [family.daughter, family.husband]) {
    if (f.found) {
      f.x = f.startX + (f.hugX - f.startX) * ease;
      f.y = f.startY + (f.hugY - f.startY) * ease;
      f.facing = (f.hugX > f.startX) ? 1 : -1;
      if (state.endingTimer < TRAVEL) {
        f.walkTimer++;
        if (f.walkTimer >= 8) { f.walkFrame ^= 1; f.walkTimer = 0; }
      } else {
        f.walkFrame = 0;
        f.hugging = true;
      }
    }
  }

  // After arriving, spawn confetti and fade in text
  if (state.endingTimer > TRAVEL) {
    if (state.endingTimer % 3 === 0 && state.confetti.length < 220) {
      for (let i = 0; i < 4; i++) state.confetti.push(makeConfetti());
    }
    state.textAlpha = Math.min(1, (state.endingTimer - TRAVEL) / 60);
  }

  // Update confetti
  for (const c of state.confetti) {
    c.sway += 0.08;
    c.x += c.vx + Math.sin(c.sway) * 0.4;
    c.y += c.vy;
    c.vy = Math.min(c.vy + 0.03, 3.5);
    c.rot += c.vrot;
  }
  state.confetti = state.confetti.filter(c => c.y < H + 30);
}

// --- Drawing ----------------------------------------------------------------
function drawBackground() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#bfe4f6');
  grad.addColorStop(1, '#f6d3e3');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Distant clouds
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  drawCloud(120, 60, 1.0);
  drawCloud(720, 40, 0.8);
  drawCloud(440, 100, 0.6);

  // Ground line outside the house (grass strip)
  ctx.fillStyle = '#7fc56b';
  ctx.fillRect(0, FLOOR1_Y + 30, W, H - (FLOOR1_Y + 30));
}

function drawCloud(cx, cy, scale) {
  const r = 18 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r, cy + 4, r * 0.9, 0, Math.PI * 2);
  ctx.arc(cx - r, cy + 4, r * 0.85, 0, Math.PI * 2);
  ctx.arc(cx + r * 1.6, cy - 2, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawHouse() {
  // House outline backdrop (interior wall behind floors)
  // Floor 3 wall (top)
  ctx.fillStyle = '#f4d8c0';
  ctx.fillRect(8, FLOOR3_Y - 110, W - 16, 110);
  // Floor 2 wall
  ctx.fillStyle = '#e6c8e0';
  ctx.fillRect(8, FLOOR2_Y - 110, W - 16, 110);
  // Floor 1 wall
  ctx.fillStyle = '#d8e8f4';
  ctx.fillRect(8, FLOOR1_Y - 110, W - 16, 110);

  // Wallpaper trim stripes
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (const fy of [FLOOR1_Y, FLOOR2_Y, FLOOR3_Y]) {
    ctx.fillRect(8, fy - 18, W - 16, 4);
  }

  // Roof (triangle on top)
  ctx.fillStyle = '#a55a55';
  ctx.beginPath();
  ctx.moveTo(0, FLOOR3_Y - 110);
  ctx.lineTo(W / 2, FLOOR3_Y - 170);
  ctx.lineTo(W, FLOOR3_Y - 110);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#874642';
  ctx.fillRect(0, FLOOR3_Y - 114, W, 6);

  // Outer house walls
  ctx.fillStyle = '#7c5a3f';
  ctx.fillRect(0, FLOOR3_Y - 110, 8, FLOOR1_Y - (FLOOR3_Y - 110) + 30);
  ctx.fillRect(W - 8, FLOOR3_Y - 110, 8, FLOOR1_Y - (FLOOR3_Y - 110) + 30);
}

function drawDecorations() {
  // Floor 1: window, side table, family portrait
  drawWindow(480, 420, 80, 70);
  drawSideTable(360, 478);
  drawPortrait(640, 420, 70, 70, 'family');

  // Floor 2: heart portrait between the two staircases (clear of stair steps)
  drawPortrait(540, 270, 70, 70, 'heart');

  // Floor 3: window and a flower portrait
  drawWindow(180, 120, 80, 70);
  drawPortrait(400, 120, 70, 70, 'flower');
}

function drawWindow(x, y, w, h) {
  // Outer frame
  ctx.fillStyle = '#7c5a3f';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  // Glass with sky gradient
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#9ed3ec');
  grad.addColorStop(1, '#cce6f5');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
  // Cross frame
  ctx.fillStyle = '#a07a55';
  ctx.fillRect(x + w / 2 - 2, y, 4, h);
  ctx.fillRect(x, y + h / 2 - 2, w, 4);
  // Sill
  ctx.fillStyle = '#5a3f29';
  ctx.fillRect(x - 6, y + h + 2, w + 12, 4);
  // Curtains
  ctx.fillStyle = '#e88aac';
  ctx.fillRect(x - 8, y - 4, 8, h + 8);
  ctx.fillRect(x + w, y - 4, 8, h + 8);
  ctx.fillStyle = '#c46b8c';
  ctx.fillRect(x - 8, y - 4, 2, h + 8);
  ctx.fillRect(x + w + 6, y - 4, 2, h + 8);
}

function drawPortrait(x, y, w, h, kind) {
  // Outer frame
  ctx.fillStyle = '#6f4a26';
  ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
  ctx.fillStyle = '#caa073';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  // Inner painting background
  ctx.fillStyle = '#fbe4d4';
  ctx.fillRect(x, y, w, h);
  if (kind === 'heart') {
    drawHeart(x + w / 2, y + h / 2 - 4, Math.min(w, h) * 0.5, '#ff5f8a');
  } else if (kind === 'flower') {
    drawFlowerHead(x + w / 2, y + h / 2, '#ff95c0');
    drawFlowerHead(x + w * 0.3, y + h * 0.65, '#ffd07a');
    drawFlowerHead(x + w * 0.72, y + h * 0.65, '#c9a0ff');
  } else if (kind === 'family') {
    // Three little stylized heads to suggest a family photo
    ctx.fillStyle = '#dfba7e';                 // mom (dirty blonde)
    ctx.beginPath(); ctx.arc(x + w * 0.30, y + h * 0.55, h * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a2418';                 // daughter (dark brown)
    ctx.beginPath(); ctx.arc(x + w * 0.55, y + h * 0.65, h * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a10';                 // husband (darker)
    ctx.beginPath(); ctx.arc(x + w * 0.78, y + h * 0.50, h * 0.20, 0, Math.PI * 2); ctx.fill();
    // Suggestion of bodies
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + w * 0.22, y + h * 0.78, w * 0.16, h * 0.22);
    ctx.fillStyle = '#f29bc0';
    ctx.fillRect(x + w * 0.48, y + h * 0.82, w * 0.14, h * 0.18);
    ctx.fillStyle = '#4f8b5c';
    ctx.fillRect(x + w * 0.68, y + h * 0.74, w * 0.20, h * 0.26);
  }
}

function drawSideTable(x, y) {
  // Table top
  ctx.fillStyle = '#7c5a3f';
  ctx.fillRect(x, y, 60, 6);
  ctx.fillStyle = '#5a3f29';
  ctx.fillRect(x, y + 5, 60, 1);
  // Legs
  ctx.fillRect(x + 4, y + 6, 5, 26);
  ctx.fillRect(x + 51, y + 6, 5, 26);
  // Cross brace
  ctx.fillRect(x + 6, y + 22, 48, 3);
  // Vase
  ctx.fillStyle = '#7fb6d6';
  ctx.fillRect(x + 22, y - 14, 16, 14);
  ctx.fillStyle = '#5a8aa6';
  ctx.fillRect(x + 22, y - 14, 16, 3);
  // Flowers in vase
  drawFlowerHead(x + 30, y - 24, '#ff95c0');
  drawFlowerHead(x + 22, y - 18, '#ffd07a');
  drawFlowerHead(x + 38, y - 18, '#c9a0ff');
  ctx.strokeStyle = '#3a8a4a';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x + 30, y - 22); ctx.lineTo(x + 30, y - 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 22, y - 16); ctx.lineTo(x + 28, y - 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 38, y - 16); ctx.lineTo(x + 32, y - 14); ctx.stroke();
}

function drawPlatforms() {
  // Floors with a wood-look top stripe
  for (const p of platforms) {
    if (p.h <= 14 && p.y === FLOOR2_Y) drawFloorBoard(p);
    else if (p.h <= 14 && p.y === FLOOR3_Y) drawFloorBoard(p);
    else if (p.y === FLOOR1_Y) {
      // Ground (floor 1)
      ctx.fillStyle = '#caa37a';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#a0764f';
      ctx.fillRect(p.x, p.y, p.w, 4);
    } else {
      // Stair step
      ctx.fillStyle = '#caa37a';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#8a6440';
      ctx.fillRect(p.x, p.y, p.w, 3);
    }
  }
}

function drawFloorBoard(p) {
  ctx.fillStyle = '#caa37a';
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = '#8a6440';
  ctx.fillRect(p.x, p.y, p.w, 3);
}

function drawDoor(d) {
  // Door frame
  ctx.fillStyle = '#6b3f24';
  ctx.fillRect(d.x - 4, d.y - 4, d.w + 8, d.h + 4);

  if (d.open) {
    // Open door: dark interior + the door swung to the side
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(d.x, d.y, d.w, d.h);
    // The door panel hinged on the right
    ctx.fillStyle = '#8b5a35';
    ctx.fillRect(d.x + d.w - 14, d.y, 14, d.h);
    ctx.fillStyle = '#5a3a22';
    ctx.fillRect(d.x + d.w - 14, d.y, 2, d.h);
    // Reveal contents (centered under the doorway)
    drawDoorReveal(d);
  } else {
    // Closed door panel
    ctx.fillStyle = '#9a6a40';
    ctx.fillRect(d.x, d.y, d.w, d.h);
    // Two raised panels
    ctx.fillStyle = '#7a4f2e';
    ctx.fillRect(d.x + 8, d.y + 12, d.w - 16, 36);
    ctx.fillRect(d.x + 8, d.y + 60, d.w - 16, 36);
    ctx.fillStyle = '#c08a5a';
    ctx.fillRect(d.x + 10, d.y + 14, d.w - 20, 32);
    ctx.fillRect(d.x + 10, d.y + 62, d.w - 20, 32);
    // Doorknob
    ctx.fillStyle = '#ffd479';
    ctx.fillRect(d.x + 10, d.y + d.h / 2 - 2, 5, 5);
  }

  // If a family member was found here, draw a heart above the door
  if (d.open && (d.contents === 'daughter' || d.contents === 'husband')) {
    drawHeart(d.x + d.w / 2, d.y - 14, 10, '#ff5f8a');
  }
}

function drawDoorReveal(d) {
  if (d.contents === 'daughter' || d.contents === 'husband') return; // family drawn separately
  const cx = d.x + d.w / 2;
  const baseY = d.y + d.h - 6;
  switch (d.contents) {
    case 'cat':     drawCat(cx, baseY); break;
    case 'flowers': drawFlowers(cx, baseY); break;
    case 'cake':    drawCake(cx, baseY); break;
    case 'card':    drawCard(cx, baseY); break;
  }
}

function drawCat(cx, baseY) {
  // Sleeping grey cat curled up
  ctx.fillStyle = '#8a8a90';
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 8, 18, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6f6f76';
  ctx.beginPath();
  ctx.arc(cx + 12, baseY - 12, 6, 0, Math.PI * 2);
  ctx.fill();
  // Ear
  ctx.fillStyle = '#8a8a90';
  ctx.beginPath();
  ctx.moveTo(cx + 9, baseY - 16);
  ctx.lineTo(cx + 12, baseY - 22);
  ctx.lineTo(cx + 15, baseY - 16);
  ctx.fill();
  // Tail curl
  ctx.strokeStyle = '#8a8a90';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx - 14, baseY - 8, 6, Math.PI, Math.PI * 0.2, false);
  ctx.stroke();
  // Closed eye (zzz)
  ctx.fillStyle = '#3a3a40';
  ctx.fillRect(cx + 13, baseY - 13, 3, 1);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#3a3a40';
  ctx.fillText('z', cx + 16, baseY - 18);
}

function drawFlowers(cx, baseY) {
  // Vase
  ctx.fillStyle = '#7fb6d6';
  ctx.fillRect(cx - 10, baseY - 20, 20, 18);
  ctx.fillStyle = '#5a8aa6';
  ctx.fillRect(cx - 10, baseY - 20, 20, 3);
  // Stems
  ctx.strokeStyle = '#3a8a4a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, baseY - 20); ctx.lineTo(cx, baseY - 44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, baseY - 20); ctx.lineTo(cx - 10, baseY - 38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, baseY - 20); ctx.lineTo(cx + 10, baseY - 38); ctx.stroke();
  // Flowers
  drawFlowerHead(cx, baseY - 46, '#ff6ba0');
  drawFlowerHead(cx - 12, baseY - 40, '#ffd07a');
  drawFlowerHead(cx + 12, baseY - 40, '#c9a0ff');
}

function drawFlowerHead(x, y, color) {
  ctx.fillStyle = color;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fff7a0';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawCake(cx, baseY) {
  // Plate
  ctx.fillStyle = '#e8e8ee';
  ctx.fillRect(cx - 22, baseY - 4, 44, 4);
  // Cake bottom
  ctx.fillStyle = '#f4c08a';
  ctx.fillRect(cx - 18, baseY - 22, 36, 18);
  ctx.fillStyle = '#d99a64';
  ctx.fillRect(cx - 18, baseY - 22, 36, 4);
  // Cake top frosting
  ctx.fillStyle = '#fff0f5';
  ctx.fillRect(cx - 18, baseY - 30, 36, 8);
  // Drips
  ctx.fillStyle = '#fff0f5';
  ctx.fillRect(cx - 14, baseY - 20, 4, 4);
  ctx.fillRect(cx - 2,  baseY - 20, 4, 4);
  ctx.fillRect(cx + 10, baseY - 20, 4, 4);
  // Candles
  for (const dx of [-10, 0, 10]) {
    ctx.fillStyle = '#9fd6f5';
    ctx.fillRect(cx + dx - 1, baseY - 38, 2, 8);
    // Flame
    ctx.fillStyle = '#ffd479';
    ctx.fillRect(cx + dx - 1, baseY - 42, 2, 4);
    ctx.fillStyle = '#ff7a3e';
    ctx.fillRect(cx + dx, baseY - 41, 1, 2);
  }
}

function drawCard(cx, baseY) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 22, baseY - 36, 44, 32);
  ctx.fillStyle = '#d8a8c8';
  ctx.fillRect(cx - 22, baseY - 36, 44, 4);
  drawHeart(cx, baseY - 18, 10, '#ff5f8a');
  ctx.fillStyle = '#5a4a4a';
  ctx.fillRect(cx - 12, baseY - 8, 24, 1);
}

function drawHeart(cx, cy, size, color) {
  ctx.fillStyle = color;
  const s = size;
  ctx.beginPath();
  ctx.arc(cx - s / 2, cy, s / 2, Math.PI, 0, false);
  ctx.arc(cx + s / 2, cy, s / 2, Math.PI, 0, false);
  ctx.lineTo(cx, cy + s);
  ctx.closePath();
  ctx.fill();
}

function drawPlayer() {
  let frame = MOM.stand;
  if (player.vx !== 0 && player.onGround) {
    frame = player.walkFrame ? MOM.step : MOM.stand;
  }
  drawSprite(frame, MOM.pal, player.x, player.y, MOM.scale, player.facing < 0);
}

function drawFamilyInDoorway(member, sprite) {
  // Idle bob
  const bob = Math.sin(performance.now() / 350) * 2;
  drawSprite(sprite.stand, sprite.pal, member.x, member.y + bob, sprite.scale, member.facing < 0);
}

function drawFamilyTraveling(member, sprite) {
  const frame = member.walkFrame ? sprite.step : sprite.stand;
  drawSprite(frame, sprite.pal, member.x, member.y, sprite.scale, member.facing < 0);
}

function drawFamilyHug(member, sprite) {
  const bob = Math.sin(performance.now() / 280) * 1.5;
  drawSprite(sprite.hug, sprite.pal, member.x, member.y + bob, sprite.scale, member.facing < 0);
}

function drawMomHug() {
  const bob = Math.sin(performance.now() / 320) * 1.5;
  drawSprite(MOM.hug, MOM.pal, player.x, player.y + bob, MOM.scale, player.facing < 0);
}

function drawConfetti() {
  for (const c of state.confetti) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
    ctx.restore();
  }
}

function roundRectPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawSpeechBubble() {
  if (!state.speech) return;
  const elapsed = performance.now() - state.speech.startTime;
  // Fade in over the first 200ms, fade out over the last 400ms
  const fadeIn = Math.min(1, elapsed / 200);
  const fadeOut = Math.min(1, (5000 - elapsed) / 400);
  const alpha = Math.max(0, Math.min(fadeIn, fadeOut));
  if (alpha <= 0) return;

  const text = state.speech.text;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const padX = 14, padY = 8;
  const tw = ctx.measureText(text).width;
  const bw = tw + padX * 2;
  const bh = 16 + padY * 2;

  // Anchor: tip of tail near the top of mom's head
  const ax = player.x + player.w / 2;
  const ay = player.y + 6;

  // Bubble sits above-and-slightly-right of mom; clamp to canvas
  let bx = ax + 18;
  let by = ay - bh - 18;
  if (bx + bw > W - 8) bx = W - 8 - bw;
  if (bx < 8) bx = 8;
  if (by < 8) by = 8;

  // Bubble body
  roundRectPath(bx, by, bw, bh, 10);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#3a2a30';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tail (triangle from bubble bottom to anchor)
  const tailBaseX = Math.max(bx + 12, Math.min(bx + bw - 28, ax - 14));
  ctx.beginPath();
  ctx.moveTo(tailBaseX, by + bh);
  ctx.lineTo(ax, ay);
  ctx.lineTo(tailBaseX + 16, by + bh);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  // Re-stroke just the two diagonal sides of the tail (not the top edge,
  // which is the bubble's bottom and is already a thick stroke)
  ctx.beginPath();
  ctx.moveTo(tailBaseX, by + bh);
  ctx.lineTo(ax, ay);
  ctx.moveTo(tailBaseX + 16, by + bh);
  ctx.lineTo(ax, ay);
  ctx.strokeStyle = '#3a2a30';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Cover the bubble bottom seam under the tail with a small white stripe
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(tailBaseX + 1, by + bh - 1, 15, 2);

  // Text
  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + padX, by + bh / 2);
  ctx.restore();
  ctx.textBaseline = 'alphabetic';
}

function drawHud() {
  // Door prompt
  if (state.phase === 'play' && state.promptDoor >= 0) {
    const d = doors[state.promptDoor];
    const text = d.open ? '' : 'E to open';
    if (text) {
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const tw = ctx.measureText(text).width + 14;
      const tx = d.x + d.w / 2 - tw / 2;
      const ty = d.y - 30;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(tx, ty, tw, 22);
      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, d.x + d.w / 2, ty + 11);
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }
  }

  // Toast
  if (state.toast) {
    const t = state.toast;
    const remaining = (t.until - performance.now()) / 1600;
    const alpha = Math.min(1, remaining * 2);
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const tw = ctx.measureText(t.text).width + 28;
    const tx = W / 2 - tw / 2;
    const ty = 40;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(tx, ty, tw, 36);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(t.text, W / 2, ty + 18);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // Status: how many family members found
  if (state.phase === 'play') {
    const found = (family.daughter.found ? 1 : 0) + (family.husband.found ? 1 : 0);
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(12, 12, 168, 28);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Family found: ${found} / 2`, 22, 26);
    ctx.textBaseline = 'alphabetic';
  }
}

function drawEndingText() {
  if (state.textAlpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = state.textAlpha;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("Happy Mother's Day!", W / 2 + 3, 120 + 3);

  // Pink fill
  const grad = ctx.createLinearGradient(0, 80, 0, 160);
  grad.addColorStop(0, '#ffd6e7');
  grad.addColorStop(1, '#ff5f8a');
  ctx.fillStyle = grad;
  ctx.fillText("Happy Mother's Day!", W / 2, 120);

  // Subtitle
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`with love, ${DAUGHTER_NAME} & ${HUSBAND_NAME}`, W / 2, 160);

  ctx.restore();
  ctx.textAlign = 'start';
}

function drawTitleBar() {
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  const text = TITLE;
  const tw = ctx.measureText(text).width + 16;
  ctx.fillRect(W - tw - 12, 12, tw, 22);
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, W - tw / 2 - 12, 23);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

// --- Main draw --------------------------------------------------------------
function draw() {
  drawBackground();
  drawHouse();
  drawDecorations();
  drawPlatforms();

  // Draw doors and door reveals (decoys drawn here; family handled below)
  for (const d of doors) drawDoor(d);

  // Draw family members standing in their doorways (during play, not ending travel)
  if (state.phase === 'play') {
    if (family.daughter.found) drawFamilyInDoorway(family.daughter, DAUGHTER);
    if (family.husband.found) drawFamilyInDoorway(family.husband, HUSBAND);
  }

  // Draw player
  if (state.phase === 'play') {
    drawPlayer();
  } else if (state.phase === 'ending') {
    // Mom in hug pose if family arrived; otherwise stand
    const arrived = state.endingTimer > 90;
    if (arrived) drawMomHug();
    else drawPlayer();
    // Family travels then hugs
    if (arrived) {
      drawFamilyHug(family.daughter, DAUGHTER);
      drawFamilyHug(family.husband, HUSBAND);
    } else {
      drawFamilyTraveling(family.daughter, DAUGHTER);
      drawFamilyTraveling(family.husband, HUSBAND);
    }
  }

  drawConfetti();
  if (state.phase === 'play') drawSpeechBubble();
  drawHud();
  drawTitleBar();
  if (state.phase === 'ending') drawEndingText();
}

// --- Game loop --------------------------------------------------------------
function loop() {
  if (state.phase === 'play') updatePlay();
  else if (state.phase === 'ending') updateEnding();
  draw();
  requestAnimationFrame(loop);
}

// --- Init -------------------------------------------------------------------
function init() {
  assignDoorContents();
  state.speech = { text: "Where is everyone...?", startTime: performance.now() };
  loop();
}

init();
