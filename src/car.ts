import {
  Application,
  Point,
  RAD_TO_DEG,
  Sprite,
  Graphics,
  Container,
} from 'pixi.js';
import { Quadtree, Circle } from '@timohausmann/quadtree-ts';

import { W, H, CAR_RADIUS } from './constants';
import {
  getVersor,
  getAngleFromVersor,
  rotate90Degrees,
  dist,
} from './geometry';
import { updateQuadTreeGraphics, onlyColliding } from './quadExtras';
import { whereToGo } from './topology';

const TEXTURE_PATH = 'assets/cars/DeLorean_DMC.png';


const LOOK_AHEAD = 14;
const LOOK_AHEAD_CIRCLE_RADIUS = CAR_RADIUS * 0.4;
const CAR_SPEED = 60; // in pixels per sec
const ARROW_W = 6;
const ARROW_H = 9;

const SHOW_CAR_ARROWS = false;
const SHOW_CAR_COLLISIONS = false;

const cars: Car[] = [];
let extraShapes: any[] = [];


export function isCloseToAnyCar(position: Point, radius:number): boolean {
  const testShape = new Circle({
    x: position.x,
    y: position.y,
    r: radius,
  });

  const neighbors = onlyColliding(testShape, qtCars.retrieve(testShape));
  return neighbors.length > 0;
}

export class Car {
  sprite: Sprite;
  auxGfx: Graphics;
  shape: Circle | undefined;
  color: number;
  destinationName: string;
  destination: Point | undefined;
  destinations: Point[] = [];

  constructor(
    _destinationName: string,
    _position: Point,
    _color: number,
    ctn: Container,
    auxCtn: Container,
  ) {
    const car = Sprite.from(TEXTURE_PATH);
    car.scale.set(0.25);
    car.position = _position;
    car.tint = _color;
    car.anchor.set(0.5);
    this.sprite = car;

    this.destinationName = _destinationName;

    this.color = _color;

    ctn.addChild(car);
    cars.push(this);

    this.auxGfx = new Graphics(); // to draw the arrows
    auxCtn.addChild(this.auxGfx);

    this.updateShape();
  }

  isCloseToOtherCar(destVersor: Point): boolean {
    const testShape = new Circle({
      x: this.sprite.position.x + destVersor.x * LOOK_AHEAD,
      y: this.sprite.position.y + destVersor.y * LOOK_AHEAD,
      r: LOOK_AHEAD_CIRCLE_RADIUS,
    });

    const neighbors = onlyColliding(testShape, qtCars.retrieve(testShape));
    for (const nei of neighbors) {
      if (nei === this.shape) continue;
      return true;
    }

    return false;
  }

  move(deltaSecs: number) {
    if (!this.destination) return;

    const destVersor = getVersor(this.sprite.position, this.destination);

    const keepMoving = !this.isCloseToOtherCar(destVersor);

    if (dist(this.sprite.position, this.destination) < 2) {
      this.updateDestination();
    }

    if (keepMoving) {
      this.sprite.position.set(
        this.sprite.position.x + destVersor.x * CAR_SPEED * deltaSecs,
        this.sprite.position.y + destVersor.y * CAR_SPEED * deltaSecs,
      );

      this.sprite.angle = getAngleFromVersor(destVersor) * RAD_TO_DEG + 90;
    }
  }

  updateShape() {
    this.shape = new Circle({
      x: this.sprite.position.x,
      y: this.sprite.position.y,
      r: CAR_RADIUS,
    });
    return this.shape;
  }

  setDestination(p: Point) {
    this.destination = p;
    SHOW_CAR_ARROWS &&
      drawArrow(
        this.auxGfx,
        this.sprite.position,
        this.destination as Point,
        this.color,
      );
  }

  updateDestination(attemptsLeft = 3) {
    const dest = this.destinations.shift();
    if (dest) {
      this.setDestination(dest);
    } else if (attemptsLeft >= 0) {
      this.destinations = whereToGo(this);
      this.updateDestination(attemptsLeft - 1);
    }
    //this.setDestination(getRandomPosition());
  }
}

export function getCars(): Car[] {
  return cars;
}

const qtCars = new Quadtree({
  width: W,
  height: H,
  maxObjects: 10, // optional, default: 10
  maxLevels: 4, // optional, default:  4
});

function updateCarsQT() {
  qtCars.clear();
  for (const c of cars) {
    qtCars.insert(c.updateShape());
  }
  extraShapes = [];
}

export function setupCars(
  app: Application,
  carsCtn: Container,
  carsAuxCtn: Container,
): (destinationName: string, color: number, pos: Point) => void {
  const qtGfx = new Graphics();
  app.stage.addChild(qtGfx);

  app.ticker.add(() => {
    const deltaSecs = app.ticker.deltaMS / 1000;

    // quad tree update
    updateCarsQT();
    SHOW_CAR_COLLISIONS && updateQuadTreeGraphics(qtCars, qtGfx, extraShapes);

    // car movement
    for (const c of cars) {
      c.move(deltaSecs);
    }
  });

  return (destinationName: string, color: number, pos: Point) => {
    const c = new Car(destinationName, pos, color, carsCtn, carsAuxCtn);
    c.updateDestination();
  };
}

function drawArrow(auxGfx: Graphics, from: Point, to: Point, color: number) {
  // DRAW ARROW (TIP > LEFT > RIGHT)
  const destVersor = getVersor(from, to);
  const tip = new Point(destVersor.x * ARROW_H, destVersor.y * ARROW_H);
  const destVersorL = rotate90Degrees(destVersor);
  const left = new Point(destVersorL.x * ARROW_W, destVersorL.y * ARROW_W);

  auxGfx.clear();

  auxGfx.lineStyle({
    width: 3,
    color: color,
    alpha: 0.33,
    join: 'round',
    cap: 'round',
  } as any);

  auxGfx.moveTo(from.x, from.y);
  auxGfx.lineTo(to.x, to.y);
  auxGfx.lineTo(to.x - tip.x + left.x, to.y - tip.y + left.y);
  auxGfx.moveTo(to.x, to.y);
  auxGfx.lineTo(to.x - tip.x - left.x, to.y - tip.y - left.y);
}
