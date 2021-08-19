import Point from './Point';
import Boid from './Boid';

export default class Swarm {
  private boids: Boid[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private mousePosition: Point;
  private debugMode: boolean;

  constructor(
    numberOfBoids: number,
    canvas: HTMLCanvasElement,
    debugMode = false
  ) {
    this.boids = [];
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.debugMode = debugMode;
    for (let i = 0; i < numberOfBoids; i += 1) {
      this.boids.push(new Boid(this.canvas, this.debugMode));
    }
  }

  public update(deltaT: number): void {
    this.clearCanvas();
    if (this.debugMode) {
      this.printFps(deltaT);
    }
    const numberOfBoids = this.boids.length;
    for (let i = 0; i < numberOfBoids; i += 1) {
      const neighbors = this.getNeighbors(this.boids[i]);
      this.boids[i].steer(neighbors, this.mousePosition);
      this.boids[i].updatePosition(deltaT);
      this.boids[i].draw();
    }
  }

  public onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition = new Point([
      event.clientX - rect.left,
      event.clientY - rect.top
    ]);
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.canvas.width = this.canvas.width;
  }

  private printFps(deltaT: number): void {
    const fps = Math.round(1000 / deltaT);
    this.context.font = '12px Arial';
    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillText(`${fps}`, 10, 20);
  }

  private getNeighbors(boid: Boid): Boid[] {
    const numberOfBoids = this.boids.length;
    const neighbors = [];
    for (let i = 0; i < numberOfBoids; i += 1) {
      const distance = boid
        .getPosition()
        .difference(this.boids[i].getPosition());

      if (distance.length() > 0 && distance.length() < 100) {
        const angle = boid.getVelocity().calculateAngle(distance);
        const collisionAngle = Math.PI * 0.25;
        if (angle < collisionAngle) {
          neighbors.push(this.boids[i]);
        }
      }
    }

    const max = 10;
    const saturation = (neighbors.length / max) * 100;
    boid.setColor(`hsl(210, ${saturation}%, 50%)`);
    return neighbors;
  }
}
