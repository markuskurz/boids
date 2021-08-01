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
});
