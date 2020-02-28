export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private position: { x: number; y: number };
  private velocity: { x: number; y: number };
  private speed: number;
  private orientation: number;
  private neighborhoodRadius: number;
  private size: { x: number; y: number };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.size = { x: 20, y: 15 };
    this.speed = 0.2;
    this.neighborhoodRadius = 100;
    this.position = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height
    };
    this.velocity = {
      x: Math.random() * this.speed * Math.sign(Math.random() - this.speed),
      y: Math.random() * this.speed * Math.sign(Math.random() - this.speed)
    };
    this.orientation = this.getOrientation();
    this.draw();
  }

  public draw(): void {
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.orientation);
    this.drawShape();
    this.context.rotate(-1 * this.orientation);
    this.context.translate(-1 * this.position.x, -1 * this.position.y);
  }

  public updatePosition(deltaT: number): void {
    this.position.x = this.position.x + this.velocity.x * deltaT;
    this.position.y = this.position.y + this.velocity.y * deltaT;
    this.wrapPosition();
    this.orientation = this.getOrientation();
  }

  public calculateDistance(point: { x: number; y: number }): number {
    const distance = Math.sqrt(
      Math.pow(this.position.x - point.x, 2) +
        Math.pow(this.position.y - point.y, 2)
    );
    return distance;
  }

  public getPosition(): { x: number; y: number } {
    return this.position;
  }

  public getVelocity(): { x: number; y: number } {
    return this.velocity;
  }

  public steer(neighbors: Boid[]): void {
    if (neighbors.length < 1) {
      return;
    }
    const separationVelocity = this.separate(neighbors);
    const alignmentVelocity = this.align(neighbors);

    this.velocity.x += separationVelocity.x / 5000 + alignmentVelocity.x / 10;
    this.velocity.y += separationVelocity.y / 5000 + alignmentVelocity.y / 10;
    this.velocity = this.normalizeVelocity(this.velocity);

    this.velocity.x *= this.speed;
    this.velocity.y *= this.speed;
  }

  private getOrientation(): number {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  private drawShape(): void {
    this.context.beginPath();
    this.context.fillStyle = 'blue';
    // this.context.rect(0, 0, this.size * 5, this.size);
    this.context.beginPath();
    this.context.moveTo(-this.size.x / 2, -this.size.y / 2);
    this.context.lineTo(this.size.x, 0);
    this.context.lineTo(-this.size.x / 2, this.size.y / 2);
    this.context.lineTo(-this.size.x / 3, 0);
    this.context.closePath();
    this.context.fill();
    this.context.closePath();
  }

  private wrapPosition(): void {
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

  private normalizeVelocity(velocity: {
    x: number;
    y: number;
  }): { x: number; y: number } {
    const speed = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2));
    velocity.x /= speed;
    velocity.y /= speed;
    return velocity;
  }

  private separate(neighbors: Boid[]): { x: number; y: number } {
    const steeringVelocity = {
      x: 0,
      y: 0
    };
    for (let i = 0; i < neighbors.length; i += 1) {
      steeringVelocity.x -= neighbors[i].getPosition().x - this.position.x;
      steeringVelocity.y -= neighbors[i].getPosition().y - this.position.y;
    }
    return steeringVelocity;
  }

  private align(neighbors: Boid[]): { x: number; y: number } {
    const alignmentVelocity = {
      x: 0,
      y: 0
    };
    for (let i = 0; i < neighbors.length; i += 1) {
      alignmentVelocity.x += neighbors[i].getVelocity().x;
      alignmentVelocity.y += neighbors[i].getVelocity().y;
    }

    alignmentVelocity.x /= neighbors.length;
    alignmentVelocity.y /= neighbors.length;

    return alignmentVelocity;
  }
}
