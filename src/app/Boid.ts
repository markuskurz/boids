import { Vector, initializeRandomVector } from './Vector';
import Point from './Point';

export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private debugMode: boolean;
  private color: string;
  private position: Point;
  private velocity: Vector;
  private speed: number;
  private orientation: number;
  private neighborhoodRadius: number;
  private collisionRadius: number;
  private collisionAngle: number;
  private size: number[];

  constructor(canvas: HTMLCanvasElement, debugMode = false) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.debugMode = debugMode;
    this.color = 'gray';
    this.size = [20, 15];
    this.speed = 0.25;
    this.neighborhoodRadius = 100;
    this.collisionRadius = 200;
    this.collisionAngle = Math.PI * 0.25;
    this.position = new Point([
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height
    ]);
    this.velocity = initializeRandomVector(this.speed);
    this.orientation = this.velocity.getOrientation();
    this.draw();
  }

  public draw(): void {
    this.context.translate(
      this.position.getCoordinates()[0],
      this.position.getCoordinates()[1]
    );
    this.context.rotate(this.orientation);
    this.drawShape();
    if (this.debugMode) {
      this.drawFieldOfVision();
    }
    this.context.rotate(-1 * this.orientation);
    this.context.translate(
      -1 * this.position.getCoordinates()[0],
      -1 * this.position.getCoordinates()[1]
    );
  }

  public updatePosition(deltaT: number): void {
    this.position = this.move(deltaT);
    this.orientation = this.velocity.getOrientation();
  }

  private move(deltaT: number): Point {
    const offset = this.velocity.scale(deltaT);
    return this.position.move(offset);
  }

  public getPosition(): Point {
    return this.position;
  }

  public getVelocity(): Vector {
    return this.velocity;
  }

  public steer(neighbors: Boid[], mousePosition: Point): void {
    const borderAvoidanceVelocity = this.avoidBorders().scale(0.05);
    this.velocity = this.velocity.add(borderAvoidanceVelocity);

    const mouseAvoidanceVelocity = this.avoidMouse(mousePosition).scale(0.001);
    this.velocity = this.velocity.add(mouseAvoidanceVelocity);
    this.velocity = this.velocity.normalize();

    if (neighbors.length > 0) {
      const separationVelocity = this.calculateSeparation(neighbors)
        .normalize()
        .scale(0.05);
      this.velocity = this.velocity.add(separationVelocity);
      const alignmentVelocity = this.calculateAlignment(neighbors)
        .normalize()
        .scale(0.05);
      this.velocity = this.velocity.add(alignmentVelocity);
      const cohesionVelocity = this.calculateCohesion(neighbors)
        .normalize()
        .scale(0.01);
      this.velocity = this.velocity.add(cohesionVelocity);
    }

    this.velocity = this.velocity.normalize();
    this.velocity = this.velocity.scale(this.speed);
  }

  private drawShape(): void {
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(-this.size[0] / 2, -this.size[1] / 2);
    this.context.lineTo(this.size[0], 0);
    this.context.lineTo(-this.size[0] / 2, this.size[1] / 2);
    this.context.lineTo(-this.size[0] / 3, 0);
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
    this.context.moveTo(0, 0);
    this.context.arc(
      0,
      0,
      this.collisionRadius,
      2 * Math.PI - this.collisionAngle / 2,
      this.collisionAngle / 2
    );
    this.context.lineTo(0, 0);
    this.context.stroke();
  }

  private avoidBorders(): Vector {
    const steeringVelocity = [0, 0];

    const position = this.position.getCoordinates();
    const distanceToRightBorder = this.canvas.width - position[0];
    if (distanceToRightBorder < this.collisionRadius) {
      steeringVelocity[0] -=
        (this.collisionRadius - distanceToRightBorder) / this.collisionRadius;
    }

    const distanceToLeftBorder = position[0];
    if (distanceToLeftBorder < this.collisionRadius) {
      steeringVelocity[0] +=
        (this.collisionRadius - distanceToLeftBorder) / this.collisionRadius;
    }

    const distanceToTopBorder = position[1];
    if (distanceToTopBorder < this.collisionRadius) {
      steeringVelocity[1] +=
        (this.collisionRadius - distanceToTopBorder) / this.collisionRadius;
    }

    const distanceToBottomBorder = this.canvas.height - position[1];
    if (distanceToBottomBorder < this.collisionRadius) {
      steeringVelocity[1] -=
        (this.collisionRadius - distanceToBottomBorder) / this.collisionRadius;
    }

    return new Vector(steeringVelocity);
  }

  private avoidMouse(mousePosition: Point): Vector {
    if (!mousePosition) {
      return new Vector([0, 0]);
    }
    const distanceVector = this.position.difference(mousePosition);
    const distanceToMouse = distanceVector.length();

    if (distanceToMouse < this.collisionRadius) {
      return distanceVector.scale(
        (this.collisionRadius - distanceToMouse) / distanceToMouse
      );
    }
    return new Vector([0, 0]);
  }

  private calculateSeparation(neighbors: Boid[]): Vector {
    let steeringVelocity = this.getVelocity();
    const position = new Point(this.position.getCoordinates());
    for (let i = 0; i < neighbors.length; i += 1) {
      const direction = position
        .difference(neighbors[i].getPosition())
        .normalize();
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
    let centerOfMass = new Point(this.position.getCoordinates());
    for (let i = 0; i < neighbors.length; i += 1) {
      const difference = centerOfMass.difference(neighbors[i].getPosition());
      centerOfMass = centerOfMass.move(difference.scale(1 / neighbors.length));
    }
    const position = new Point(this.position.getCoordinates());
    const cohesionVector = position.difference(centerOfMass);
    return cohesionVector;
  }
}
