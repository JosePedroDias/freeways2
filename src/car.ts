import {
  Application,
  Point,
  RAD_TO_DEG,
  Sprite,
  Graphics,
  Container,
} from 'pixi.js';
import { Quadtree, Circle } from '@timohausmann/quadtree-ts';

import { W, H } from './constants';
import {
  getVersor,
  getAngleFromVersor,
  rotate90Degrees,
  dist,
} from './geometry';
import { updateQuadTreeGraphics, onlyColliding } from './quadExtras';
import { getRandomColor } from './colors';
import { whereToGo } from './topology';

function getRandomPosition() {
  return new Point(Math.random() * W, Math.random() * H);
}

const TEXTURE_PATH = 'assets/cars/DeLorean_DMC.png';

const CAR_RADIUS = 18;
const LOOK_AHEAD = 14;
const LOOK_AHEAD_CIRCLE_RADIUS = CAR_RADIUS * 0.4;
const CAR_SPEED = 60; // in pixels per sec
const ARROW_W = 6;
const ARROW_H = 9;

const SHOW_CAR_ARROWS = false;
const SHOW_CAR_COLLISIONS = false;

const cars: Car[] = [];
let extraShapes: any[] = [];

export class Car {
  sprite: Sprite;
  auxGfx: Graphics;
  shape: Circle | undefined;
  color: number;
  destination: Point | undefined;
  destinations: Point[] = [];

  constructor(
    _position: Point,
    _orientation: Point,
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

    this.color = _color;

    ctn.addChild(car);
    cars.push(this);

    this.auxGfx = new Graphics(); // to draw the arrows
    auxCtn.addChild(this.auxGfx);

    this.updateShape();
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

  updateDestination() {
    const dest = this.destinations.shift();
    if (dest) {
      this.setDestination(dest);
    } else {
      this.destinations = whereToGo(this);
      this.updateDestination();
    }
    //this.setDestination(getRandomPosition());
  }
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
): () => void {
  const qtGfx = new Graphics();
  app.stage.addChild(qtGfx);

  app.ticker.add(() => {
    const deltaSecs = app.ticker.deltaMS / 1000;

    // quad tree update
    updateCarsQT();
    SHOW_CAR_COLLISIONS && updateQuadTreeGraphics(qtCars, qtGfx, extraShapes);

    // car movement
    for (const c of cars) {
      if (!c.destination) continue;

      const destVersor = getVersor(c.sprite.position, c.destination);

      const testShape = new Circle({
        x: c.sprite.position.x + destVersor.x * LOOK_AHEAD,
        y: c.sprite.position.y + destVersor.y * LOOK_AHEAD,
        r: LOOK_AHEAD_CIRCLE_RADIUS,
      });
      extraShapes.push(testShape);

      // test if someone is in front of me and stop if so
      let keepMoving = true;
      const neighbors = onlyColliding(testShape, qtCars.retrieve(testShape));
      for (const nei of neighbors) {
        if (nei === c.shape) continue;
        keepMoving = false;
      }

      if (dist(c.sprite.position, c.destination) < 2) {
        c.updateDestination();
      }

      if (keepMoving) {
        c.sprite.position.set(
          c.sprite.position.x + destVersor.x * CAR_SPEED * deltaSecs,
          c.sprite.position.y + destVersor.y * CAR_SPEED * deltaSecs,
        );

        c.sprite.angle = getAngleFromVersor(destVersor) * RAD_TO_DEG + 90;
      }
    }
  });

  return () => {
    const c = new Car(
      getRandomPosition(),
      new Point(1, 0),
      getRandomColor(),
      carsCtn,
      carsAuxCtn,
    );
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
