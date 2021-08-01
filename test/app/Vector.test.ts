import { expect } from 'chai';
import { Vector } from '../../src/app/Vector';

describe('Vector class', () => {
  describe('length() method', () => {
    it('calculates the length of vectors', () => {
      let vector: Vector;
      vector = new Vector([1, 0]);
      expect(vector.length()).to.equal(1);

      vector = new Vector([0, 0]);
      expect(vector.length()).to.equal(0);

      vector = new Vector([0, 1]);
      expect(vector.length()).to.equal(1);

      vector = new Vector([1, 1]);
      const length1 = Math.sqrt(2);
      expect(vector.length()).to.equal(length1);

      vector = new Vector([2, 2]);
      const length2 = Math.sqrt(8);
      expect(vector.length()).to.equal(length2);
    });
  });

  describe('getDimension() method', () => {
    it('returns the dimension of vectors', () => {
      let vector: Vector;
      vector = new Vector([1, 0]);
      expect(vector.getDimension()).to.equal(2);

      vector = new Vector([0]);
      expect(vector.getDimension()).to.equal(1);

      vector = new Vector([1, 2, 3]);
      expect(vector.getDimension()).to.equal(3);
    });
  });

  describe('normalize() method', () => {
    it('normalizes vectors', () => {
      let vector: Vector;
      vector = new Vector([1, 0]);
      expect(vector.normalize().length()).to.equal(1);

      vector = new Vector([0]);
      expect(vector.normalize().length()).to.equal(0);

      vector = new Vector([1, 2, 3]);
      expect(vector.normalize().length()).to.equal(1);
    });

    it('keeps the orientation of vectors', () => {
      let vector = new Vector([12.7, 0]);
      let normalized = vector.normalize();
      expect(normalized.length()).to.equal(1);
      expect(normalized.values[0]).to.equal(1);
      expect(normalized.values[1]).to.equal(0);

      vector = new Vector([12.7, 37.6]);
      normalized = vector.normalize();
      expect(normalized.length()).to.equal(1);
      expect(normalized.values[0]).to.be.lte(normalized.values[1]);
    });
  });
});
