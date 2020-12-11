const DEFAULT_OPTIONS = {
  FLAKE_COUNT: 1000,
  MAX_FLAKE_SIZE: 3,
  MAX_SY: 1.5,
  MIN_SY: 0.5,
  MAX_SX: 0.5,
};

function drawFlake(c, flake) {
  const { x, y, size } = flake;
  c.fillStyle = '#fffb';
  c.beginPath();
  c.ellipse(x, y, size / 2, size / 2, 0, 0, 7);
  c.fill();
}

export function drawSnow(c, flakes) {
  c.save();
  c.resetTransform();
  for (const flake of flakes) {
    drawFlake(c, flake);
  }
  c.restore();
}

function createNewFlake(c, options, yRange = 0) {
  const x = Math.random() * c.canvas.width;
  const y = Math.random() * yRange;
  const size = Math.random() * options.MAX_FLAKE_SIZE + 1;
  const sy = Math.random() * (options.MAX_SY - options.MIN_SY) + options.MIN_SY;
  const sx = (Math.random() * 2 - 1) * options.MAX_SX;
  return { x, y, size, sy, sx, options };
}

export function initSnow(c, opts = {}) {
  const options = Object.assign({}, DEFAULT_OPTIONS, opts);
  const flakes = [];
  for (let i = 0; i < options.FLAKE_COUNT; i += 1) {
    const flake = createNewFlake(c, options, -c.canvas.height);
    flakes.push(flake);
  }
  return flakes;
}

function isTransparent(c, x, y) {
  const pixelData = c.getImageData(x, y, 1, 1).data;
  return pixelData[3] < 250;
}

function moveFlake(c, flake) {
  if (flake.sy <= 0) return false; // the flake has settled

  const w = c.canvas.width;
  const nextY = flake.y + flake.sy;
  const nextX = (flake.x + flake.sx + w) % w;
  if (isTransparent(c, nextX, nextY)) {
    flake.x = nextX;
    flake.y = nextY;
    return true;
  } else {
    flake.sx *= (flake.sy - 1) / flake.sy;
    flake.sy -= 1;
    return moveFlake(c, flake);
  }
}

function isOutOfBounds(c, flake) {
  return flake.y > c.canvas.height;
}

// returns flakes that have settled, replacing them in `flakes` with new ones at the top of the canvas
export function moveSnow(c, flakes) {
  const settledFlakes = [];
  for (let i = 0; i < flakes.length; i += 1) {
    const flake = flakes[i];
    const moved = moveFlake(c, flake);
    if (isOutOfBounds(c, flake)) {
      flakes[i] = createNewFlake(c, flake.options);
    } else if (!moved) {
      // the flake has settled
      settledFlakes.push(flake);
      // replace it with a fresh flake
      flakes[i] = createNewFlake(c, flake.options);
    }
  }
  return settledFlakes;
}

export function saveCanvasPicture(c) {
  return c.getImageData(0, 0, c.canvas.width, c.canvas.height);
}

export function restoreCanvasPicture(c, savedPicture) {
  c.save();
  c.resetTransform();

  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  c.putImageData(savedPicture, 0, 0);

  c.restore();
}
