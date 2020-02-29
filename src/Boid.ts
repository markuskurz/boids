import Vector from './Vector';

export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private color: string;
  private position: Vector;
  private velocity: Vector;
  private speed: number;
  private orientation: number;
  private neighborhoodRadius: number;
  private collisionRadius: number;
  private size: Vector;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.color = 'blue';
    this.size = new Vector([20, 15]);
    this.speed = 0.2;
    this.neighborhoodRadius = 100;
    this.collisionRadius = 200;
    this.position = new Vector([
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height
    ]);
    this.velocity = new Vector([
      Math.random() * this.speed * Math.sign(Math.random() - this.speed),
      Math.random() * this.speed * Math.sign(Math.random() - this.speed)
    ]);
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

  private move(deltaT: number): Vector {
    const offset = this.velocity.scale(deltaT);
    return this.position.add(offset);
  }

  public getPosition(): Vector {
    return this.position;
  }

  public getVelocity(): Vector {
    return this.velocity;
  }

  public steer(neighbors: Boid[], mousePosition: Vector): void {
    const borderAvoidanceVelocity = this.avoidBorders().scale(0.0001);

    this.velocity = this.velocity.add(borderAvoidanceVelocity);
    this.velocity = this.velocity.normalize();

    const mouseAvoidanceVelocity = this.avoidMouse(mousePosition).scale(0.005);
    this.velocity = this.velocity.add(mouseAvoidanceVelocity);
    this.velocity = this.velocity.normalize();

    if (neighbors.length > 1) {
      const separationVelocity = this.calculateSeparation(neighbors).scale(
        0.001
      );
      this.velocity = this.velocity.add(separationVelocity);
      const alignmentVelocity = this.calculateAlignment(neighbors).scale(1);
      this.velocity = this.velocity.add(alignmentVelocity);
      const cohesionVelocity = this.calculateCohesion(neighbors).scale(0.1);
      this.velocity = this.velocity.add(cohesionVelocity);

      this.velocity = this.velocity.normalize();
    }

    this.velocity = this.velocity.scale(this.speed);
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

  private avoidBorders(): Vector {
    let steeringVelocityX = 0;
    let steeringVelocityY = 0;
    if (this.position.x + this.collisionRadius > this.canvas.width) {
      const distance = this.canvas.width - this.position.x;
      steeringVelocityX = (this.collisionRadius - distance) * -1;
    } else if (this.position.x - this.collisionRadius < 0) {
      const distance = this.position.x;
      steeringVelocityX = this.collisionRadius - distance;
    }

    if (this.position.y + this.collisionRadius > this.canvas.height) {
      const distance = this.canvas.height - this.position.y;
      steeringVelocityY = (this.collisionRadius - distance) * -1;
    } else if (this.position.y - this.collisionRadius < 0) {
      const distance = this.position.y;
      steeringVelocityY = this.collisionRadius - distance;
    }

    return new Vector([steeringVelocityX, steeringVelocityY]);
  }

  private avoidMouse(mousePosition: Vector): Vector {
    if (!mousePosition) {
      return new Vector([0, 0]);
    }
    const distanceVector = this.position.subtract(mousePosition);
    const distanceToMouse = distanceVector.length();
    if (distanceToMouse < this.neighborhoodRadius) {
      return distanceVector;
    }
    return new Vector([0, 0]);
  }

  private calculateSeparation(neighbors: Boid[]): Vector {
    let steeringVelocity = new Vector([0, 0]);
    for (let i = 0; i < neighbors.length; i += 1) {
      const direction = this.position.subtract(neighbors[i].getPosition());
      steeringVelocity = steeringVelocity.add(direction);
    }
    steeringVelocity = steeringVelocity.scale(1 / neighbors.length);
    return steeringVelocity;
  }

  private calculateAlignment(neighbors: Boid[]): Vector {
    let alignmentVelocity = new Vector([0, 0]);
    for (let i = 0; i < neighbors.length; i += 1) {
      alignmentVelocity = alignmentVelocity.add(neighbors[i].getVelocity());
    }
    alignmentVelocity = alignmentVelocity.scale(1 / neighbors.length);
    return alignmentVelocity;
  }

  private calculateCohesion(neighbors: Boid[]): Vector {
    let centerOfMass = new Vector([0, 0]);
    for (let i = 0; i < neighbors.length; i += 1) {
      centerOfMass = centerOfMass.add(neighbors[i].getPosition());
    }
    centerOfMass = centerOfMass.scale(1 / neighbors.length);
    const cohesionVector = this.position.subtract(centerOfMass);
    return cohesionVector;
  }
}
