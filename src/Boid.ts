export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private color: string;
  private position: { x: number; y: number };
  private velocity: { x: number; y: number };
  private speed: number;
  private orientation: number;
  private neighborhoodRadius: number;
  private collisionRadius: number;
  private size: { x: number; y: number };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.color = 'blue';
    this.size = { x: 20, y: 15 };
    this.speed = 0.2;
    this.neighborhoodRadius = 100;
    this.collisionRadius = 200;
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
    this.drawFieldOfVision();
    this.context.rotate(-1 * this.orientation);
    this.context.translate(-1 * this.position.x, -1 * this.position.y);
  }

  public updatePosition(deltaT: number): void {
    this.position = this.move(deltaT);
    this.orientation = this.getOrientation();
  }

  private move(deltaT: number): { x: number; y: number } {
    const newPosition = {
      x: 0,
      y: 0
    };
    newPosition.x = this.position.x + this.velocity.x * deltaT;
    newPosition.y = this.position.y + this.velocity.y * deltaT;
    return newPosition;
  }

  public calculateDistance(point: { x: number; y: number }): number {
    const distance = Math.sqrt(
      Math.pow(this.position.x - point.x, 2) +
        Math.pow(this.position.y - point.y, 2)
    );
    return distance;
  }

  public calculateDistanceVector(point: {
    x: number;
    y: number;
  }): { x: number; y: number } {
    const distanceVector = {
      x: point.x - this.position.x,
      y: point.y - this.position.y
    };
    return distanceVector;
  }

  public getPosition(): { x: number; y: number } {
    return this.position;
  }

  public getVelocity(): { x: number; y: number } {
    return this.velocity;
  }

  public steer(neighbors: Boid[]): void {
    const avoidanceVelocity = this.avoidBorders();

    this.velocity.x += avoidanceVelocity.x / 5000;
    this.velocity.y += avoidanceVelocity.y / 5000;

    this.velocity = this.normalizeVelocity(this.velocity);

    if (neighbors.length > 1) {
      const separationVelocity = this.calculateSeparation(neighbors);
      const alignmentVelocity = this.calculateAlignment(neighbors);
      const cohesionVelocity = this.calculateCohesion(neighbors);

      this.velocity.x +=
        separationVelocity.x / 5000 +
        alignmentVelocity.x / 5 +
        cohesionVelocity.x / 3000;
      this.velocity.y +=
        separationVelocity.y / 5000 +
        alignmentVelocity.y / 5 +
        cohesionVelocity.y / 3000;
      this.velocity = this.normalizeVelocity(this.velocity);
    }

    this.velocity.x *= this.speed;
    this.velocity.y *= this.speed;
  }

  private getOrientation(): number {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  private drawShape(): void {
    this.context.fillStyle = this.color;
    // this.context.rect(0, 0, this.size * 5, this.size);
    this.context.beginPath();
    this.context.moveTo(-this.size.x / 2, -this.size.y / 2);
    this.context.lineTo(this.size.x, 0);
    this.context.lineTo(-this.size.x / 2, this.size.y / 2);
    this.context.lineTo(-this.size.x / 3, 0);
    this.context.closePath();
    this.context.fill();
    this.context.moveTo(0, 0);
  }

  private drawFieldOfVision(): void {
    this.context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.context.beginPath();
    this.context.arc(0, 0, this.neighborhoodRadius, 0, 2 * Math.PI);
    this.context.stroke();

    this.context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.context.beginPath();
    this.context.arc(0, 0, this.collisionRadius, 0, 2 * Math.PI);
    this.context.stroke();
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

  private avoidBorders(): { x: number; y: number } {
    const steeringVelocity = {
      x: 0,
      y: 0
    };
    if (this.position.x + this.collisionRadius > this.canvas.width) {
      const distance = this.canvas.width - this.position.x;
      steeringVelocity.x = (this.collisionRadius - distance) * -1;
    } else if (this.position.x - this.collisionRadius < 0) {
      const distance = this.position.x;
      steeringVelocity.x = this.collisionRadius - distance;
    }

    if (this.position.y + this.collisionRadius > this.canvas.height) {
      const distance = this.canvas.height - this.position.y;
      steeringVelocity.y = (this.collisionRadius - distance) * -1;
    } else if (this.position.y - this.collisionRadius < 0) {
      const distance = this.position.y;
      steeringVelocity.y = this.collisionRadius - distance;
    }

    return steeringVelocity;
  }

  private calculateSeparation(neighbors: Boid[]): { x: number; y: number } {
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

  private calculateAlignment(neighbors: Boid[]): { x: number; y: number } {
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

  private calculateCohesion(neighbors: Boid[]): { x: number; y: number } {
    const centerOfMass = {
      x: 0,
      y: 0
    };
    for (let i = 0; i < neighbors.length; i += 1) {
      centerOfMass.x += neighbors[i].getPosition().x;
      centerOfMass.y += neighbors[i].getPosition().y;
    }

    centerOfMass.x /= neighbors.length;
    centerOfMass.y /= neighbors.length;

    const cohesionVector = this.calculateDistanceVector(centerOfMass);
    return cohesionVector;
  }
}
