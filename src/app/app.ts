import Swarm from './Swarm';

interface MyWindow extends Window {
  requestAnimationFrame(callback: FrameRequestCallback): number;
  innerWidth: number;
  innerHeight: number;
}

interface MyDocument extends Document {
  createElement(nodeName: string): HTMLCanvasElement;
  addEventListener(event: string, callback: object, useCapture?: boolean): void;
  hasFocus(): boolean;
}

declare const window: MyWindow;
declare const document: MyDocument;

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'mainCanvas');
  canvas.setAttribute('width', window.innerWidth.toString());
  canvas.setAttribute('height', window.innerHeight.toString());
  return canvas;
}

function setupSwarm(): Swarm {
  const canvas = createCanvas();
  document.body.appendChild(canvas);
  return new Swarm(20, canvas, true);
}

let lastTimestamp: number = null;
let deltaT = 0;

const swarm = setupSwarm();

function runSimulation(timestamp: number): void {
  deltaT = timestamp - lastTimestamp;
  if (document.hasFocus()) {
    swarm.update(deltaT);
  }
  lastTimestamp = timestamp;
  window.requestAnimationFrame(runSimulation);
}

function gameLoop(): void {
  document.addEventListener('mousemove', (e: MouseEvent) =>
    swarm.onMouseMove(e)
  );
  window.requestAnimationFrame(runSimulation);
}

gameLoop();
