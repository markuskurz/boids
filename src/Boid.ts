export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: any;
  private mass: number;
  private position: { x: number; y: number; };
  private velocity: { x: number; y: number; };
  private orientation: number;
  private neighborhoodRadius: number;
  private size: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.size = 5;
    this.neighborhoodRadius = 100;
    this.position = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
    };
    this.velocity = {
      x: Math.random() * 0.5 * Math.sign(Math.random() - 0.5),
      y: Math.random() * 0.5 * Math.sign(Math.random() - 0.5),
    };
    this.orientation = this.getOrientation();
    this.draw();
  }

  public draw() {
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.orientation);
    this.drawShape();
    this.context.rotate(-1 * this.orientation);
    this.context.translate(-1 * this.position.x, -1 * this.position.y);
  }

  public updatePosition(deltaT: number) {
    this.position.x = this.position.x + (this.velocity.x * deltaT);
    this.position.y = this.position.y + (this.velocity.y * deltaT);
    this.wrapPosition();
    this.orientation = this.getOrientation();
  }

  private getOrientation() {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  private drawShape() {
    this.context.beginPath();
    this.context.fillStyle = 'blue';
    this.context.rect(0, 0, this.size * 5, this.size);
    this.context.fill();
    this.context.closePath();
  }

  private wrapPosition() {
    if (this.position.x > this.canvas.width) {
      this.position.x = this.position.x - this.canvas.width;
    } else if (this.position.x < 0) {
      this.position.x = this.position.x + this.canvas.width;
    }
    if (this.position.y > this.canvas.height) {
      this.position.y = this.position.y - this.canvas.height;
    } else if (this.position.y < 0) {
      this.position.y = this.position.y + this.canvas.height;
    }
  }
}
