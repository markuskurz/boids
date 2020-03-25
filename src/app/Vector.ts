class Vector {
  readonly values: number[];

  constructor(values?: number[]) {
    this.values = values;
  }

  public length(): number {
    const summedSquares = this.values.reduce((accumulator, currentValue) => {
      return accumulator + Math.pow(currentValue, 2);
    }, 0);
    const length = Math.sqrt(summedSquares);
    return length;
  }

  public getDimension(): number {
    return this.values.length;
  }

  public getOrientation(): number {
    return Math.atan2(this.values[1], this.values[0]);
  }

  public normalize(): Vector {
    const length = this.length();
    const normalizedValues = this.values.map(value => {
      return value / length;
    });
    return new Vector(normalizedValues);
  }

  public add(summand: Vector): Vector {
    if (this.getDimension() !== summand.getDimension()) {
      throw new Error('Vector dimensions differ');
    }
    const sum = this.values.map((value, index) => {
      return value + summand.values[index];
    });
    return new Vector(sum);
  }

  public subtract(minuend: Vector): Vector {
    if (this.getDimension() !== minuend.getDimension()) {
      throw new Error('Vector dimensions differ');
    }
    const sum = this.values.map((value, index) => {
      return value - minuend.values[index];
    });
    return new Vector(sum);
  }

  public multiply(vector: Vector): number {
    if (this.getDimension() !== vector.getDimension()) {
      throw new Error('Vector dimensions differ');
    }
    const product = this.values.reduce((accumulator, currentValue, index) => {
      return accumulator + currentValue * vector.values[index];
    }, 0);
    return product;
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

  public calculateAngle(vector: Vector): number {
    const dotProduct = this.multiply(vector);
    const magnitudeProduct = this.length() * vector.length();
    return Math.cos(dotProduct / magnitudeProduct);
  }
}

const initializeRandomVector = (magnitude: number): Vector => {
  const values = [Math.random() - 0.5, Math.random() - 0.5];

  let vector = new Vector(values);
  vector = vector.normalize();
  vector = vector.scale(magnitude);
  return vector;
};

export default Vector;
export { Vector, initializeRandomVector };
