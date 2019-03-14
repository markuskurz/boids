import Boid from './Boid';

export default class Swarm {
  constructor(numberOfBoids, canvas) {
    this.boids = [];
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    for (let i = 0; i < numberOfBoids; i += 1) {
      this.boids.push(new Boid(this.canvas));
    }
  }

  update(deltaT) {
    this.clearCanvas();
    const numberOfBoids = this.boids.length;
    for (let i = 0; i < numberOfBoids; i += 1) {
      this.boids[i].updatePosition(deltaT);
      this.boids[i].draw();
    }
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.canvas.width = this.canvas.width;
  }
}
