import Vector from './Vector';

export default class Point {
  private coordinates: number[];

  constructor(coordinates?: number[]) {
    this.coordinates = coordinates;
  }

  public getCoordinates(): number[] {
    return this.coordinates;
  }

  public getDimension(): number {
    return this.coordinates.length;
  }

  public move(displacement: Vector): Point {
    if (this.getDimension() != displacement.getDimension()) {
      throw new Error('Point and vector dimensions differ');
    }
    this.coordinates = this.coordinates.map((coordinate, index) => {
      return coordinate + displacement.values[index];
    });
    return this;
  }

  public difference(point: Point): Vector {
    if (this.getDimension() !== point.getDimension()) {
      throw new Error('Point dimensions differ');
    }
    const sum = this.coordinates.map((coordinate, index) => {
      return coordinate - point.getCoordinates()[index];
    });
    return new Vector(sum);
  }
}
