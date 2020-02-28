import Boid from './Boid';

export default class Swarm {
  private boids: Boid[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(numberOfBoids: number, canvas: HTMLCanvasElement) {
    this.boids = [];
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    for (let i = 0; i < numberOfBoids; i += 1) {
      this.boids.push(new Boid(this.canvas));
    }
  }

  public update(deltaT: number): void {
    this.clearCanvas();
    const numberOfBoids = this.boids.length;
    for (let i = 0; i < numberOfBoids; i += 1) {
      this.boids[i].updatePosition(deltaT);
      this.boids[i].draw();
    }
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.canvas.width = this.canvas.width;
  }
}
