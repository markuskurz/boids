import Swarm from './Swarm';

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'mainCanvas');
  canvas.setAttribute('width', window.innerWidth.toString());
  canvas.setAttribute('height', window.innerHeight.toString());
  return canvas;
}

function setupSwarm() {
  const canvas = createCanvas();
  document.body.appendChild(canvas);
  return new Swarm(10, canvas);
}

let lastTimestamp: number = null;
let deltaT: number = 0;

const swarm = setupSwarm();


function runSimulation(timestamp: number) {
  deltaT = timestamp - lastTimestamp;
  swarm.update(deltaT);
  lastTimestamp = timestamp;
  window.requestAnimationFrame(runSimulation);
}

function gameLoop(swarm: Swarm) {
  window.requestAnimationFrame(runSimulation);
}

gameLoop(swarm);
