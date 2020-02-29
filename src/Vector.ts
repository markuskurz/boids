export default class Vector {
  readonly values: number[];
  readonly x: number;
  readonly y: number;
  readonly dimension: number;

  constructor(values?: number[]) {
    this.values = values;
    this.x = values[0];
    this.y = values[1];
    this.dimension = values.length;
  }

  public length(): number {
    const summedSquares = this.values.reduce((accumulator, currentValue) => {
      return accumulator + Math.pow(currentValue, 2);
    }, 0);
    const length = Math.sqrt(summedSquares);
    return length;
  }

  public normalize(): Vector {
    const length = this.length();
    const normalizedValues = this.values.map(value => {
      return value / length;
    });
    return new Vector(normalizedValues);
  }

  public add(summand: Vector): Vector {
    if (this.dimension !== summand.dimension) {
      throw new Error('Vector dimensions differ');
    }
    const sum = this.values.map((value, index) => {
      return value + summand.values[index];
    });
    return new Vector(sum);
  }

  public subtract(minuend: Vector): Vector {
    if (this.dimension !== minuend.dimension) {
      throw new Error('Vector dimensions differ');
    }
    const sum = this.values.map((value, index) => {
      return value - minuend.values[index];
    });
    return new Vector(sum);
  }

  public scale(factor: number): Vector {
    const scaledValues = this.values.map(value => {
      return value * factor;
    });
    return new Vector(scaledValues);
  }

  public calculateDistance(vector: Vector): number {
    return this.subtract(vector).length();
  }
}
