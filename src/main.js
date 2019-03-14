function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'mainCanvas');
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  return canvas;
}

document.body.appendChild(createCanvas());
