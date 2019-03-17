export default class Boid {
  canvas: HTMLCanvasElement;
  context: any;
  position: { x: number; y: number; };
  maxSpeed: number;
  velocity: { x: number; y: number; };
  size: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.position = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
    };
    this.maxSpeed = 0.5;
    this.velocity = {
      x: Math.random() * this.maxSpeed * Math.sign(Math.random() - 0.5),
      y: Math.random() * this.maxSpeed * Math.sign(Math.random() - 0.5),
    };
    this.size = 5;
    this.draw();
  }

  getAngle() {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  draw() {
    this.context.translate(this.position.x, this.position.y);
    const angle = this.getAngle();
    this.context.rotate(angle);
    this.drawShape();
    this.context.rotate(-1 * angle);
    this.context.translate(-1 * this.position.x, -1 * this.position.y);
  }

  drawShape() {
    this.context.beginPath();
    this.context.fillStyle = 'red';
    this.context.rect(0, 0, this.size * 5, this.size);
    this.context.fill();
    this.context.closePath();
  }

  updatePosition(deltaT: number) {
    this.position.x = this.position.x + (this.velocity.x * deltaT);
    this.position.y = this.position.y + (this.velocity.y * deltaT);
    if (this.position.x > this.canvas.width - this.size || this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = this.position.x + (this.velocity.x * deltaT);
    }
    if (this.position.y > this.canvas.height - this.size || this.position.y < 0) {
      this.velocity.y *= -1;
      this.position.y = this.position.y + (this.velocity.y * deltaT);
    }
  }
}
