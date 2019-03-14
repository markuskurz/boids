export default class Boid {
  constructor(canvas) {
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

  draw() {
    this.context.beginPath();
    this.context.fillStyle = 'blue';
    this.context.rect(this.position.x, this.position.y, this.size, this.size);
    this.context.fill();
    this.context.closePath();
  }

  updatePosition(deltaT) {
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
