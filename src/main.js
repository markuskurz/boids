import Swarm from './Swarm';

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'mainCanvas');
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  return canvas;
}

function setupSwarm() {
  const canvas = createCanvas();
  document.body.appendChild(canvas);
  return new Swarm(100, canvas);
}

let lastTimestamp = null;
let deltaT = 0;

const swarm = setupSwarm();


function runSimulation(timestamp) {
  deltaT = timestamp - lastTimestamp;
  swarm.update(deltaT);
  lastTimestamp = timestamp;
  window.requestAnimationFrame(runSimulation);
}

function gameLoop(swarm) {
  window.requestAnimationFrame(runSimulation);
}

gameLoop(swarm);
