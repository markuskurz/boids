export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private position: { x: number; y: number };
  private velocity: { x: number; y: number };
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
      y: Math.random() * this.canvas.height
    };
    this.velocity = {
      x: Math.random() * 0.5 * Math.sign(Math.random() - 0.5),
      y: Math.random() * 0.5 * Math.sign(Math.random() - 0.5)
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

  public steer(neighbors: Boid[]): void {
    if (neighbors.length < 1) {
      return;
    }
    this.separate(neighbors);
    this.normalizeVelocity();
  }

  private getOrientation(): number {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  private drawShape(): void {
    this.context.beginPath();
    this.context.fillStyle = 'blue';
    this.context.rect(0, 0, this.size * 5, this.size);
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

  private normalizeVelocity(): void {
    const speed = Math.sqrt(
      Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)
    );
    this.velocity.x /= speed;
    this.velocity.y /= speed;
    this.velocity.x *= 0.5;
    this.velocity.y *= 0.5;
  }

  private separate(neighbors: Boid[]): void {
    const steeringVelocity = {
      x: 0,
      y: 0
    };
    for (let i = 0; i < neighbors.length; i += 1) {
      steeringVelocity.x += neighbors[i].getPosition().x - this.position.x;
      steeringVelocity.y += neighbors[i].getPosition().y - this.position.y;
    }
    this.velocity.x -= 0.001 * steeringVelocity.x;
    this.velocity.y -= 0.001 * steeringVelocity.y;
  }
}
