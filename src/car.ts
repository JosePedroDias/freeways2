import {
  Application,
  Point,
  RAD_TO_DEG,
  Sprite,
  Graphics,
  Container,
  DisplayObject,
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

type SpriteWithShape = Sprite & {
  _shape: Circle;
};

const TEXTURE_PATH = 'assets/cars/DeLorean_DMC.png';

const CAR_RADIUS = 18;
const LOOK_AHEAD = 14;
const LOOK_AHEAD_CIRCLE_RADIUS = CAR_RADIUS * 0.4;
const CAR_SPEED = 60; // in pixels per sec
const ARROW_W = 6;
const ARROW_H = 9;

const qtCars = new Quadtree({
  width: W,
  height: H,
  maxObjects: 10, // optional, default: 10
  maxLevels: 4, // optional, default:  4
});

const qtGfx = new Graphics();

const cars: DisplayObject[] = [];
let extraShapes:any[] = [];

export function setupCarQtVis(app: Application) {
  app.stage.addChild(qtGfx);

  let _remaining = 0;

  app.ticker.add((dMs) => {
    qtCars.clear();

    let i = 0;
    for (const _car of cars) {
      const car = _car as SpriteWithShape;
      const shape = new Circle({
        x: car.position.x,
        y: car.position.y,
        r: CAR_RADIUS,
        data: i++ as any,
      });
      car._shape = shape;
      qtCars.insert(shape);
    }

    _remaining -= dMs;
    //if (remaining > 0) return

    updateQuadTreeGraphics(qtCars, qtGfx, extraShapes);
    extraShapes = [];

    _remaining += 20;
  });
}

export function addCar(
  app: Application,
  carsCtn: Container,
  carsAuxCtn: Container,
) {
  function getRandomPosition() {
    return new Point(Math.random() * W, Math.random() * H);
  }

  const tint = getRandomColor();

  const auxGfx = new Graphics();
  carsAuxCtn.addChild(auxGfx);

  const car = Sprite.from(TEXTURE_PATH);
  car.scale.set(0.25);
  car.position = getRandomPosition();
  car.tint = tint;
  car.anchor.set(0.5);

  /* const labelTxt = new Text(`${cars.length}`);
  const car = new Container();
  car.addChild(carSprite);
  car.addChild(labelTxt); */

  carsCtn.addChild(car);
  cars.push(car);

  let destination: Point;

  function updateDestination() {
    destination = getRandomPosition();

    // DRAW ARROW (TIP > LEFT > RIGHT)
    const destVersor = getVersor(car.position, destination);
    const tip = new Point(destVersor.x * ARROW_H, destVersor.y * ARROW_H);
    const destVersorL = rotate90Degrees(destVersor);
    const left = new Point(destVersorL.x * ARROW_W, destVersorL.y * ARROW_W);

    auxGfx.clear();

    auxGfx.lineStyle({
      width: 3,
      color: tint,
      alpha: 0.33,
      join: 'round', // these are not typed :/
      cap: 'round',
    } as any);

    auxGfx.moveTo(car.position.x, car.position.y);
    auxGfx.lineTo(destination.x, destination.y);
    auxGfx.lineTo(
      destination.x - tip.x + left.x,
      destination.y - tip.y + left.y,
    );
    auxGfx.moveTo(destination.x, destination.y);
    auxGfx.lineTo(
      destination.x - tip.x - left.x,
      destination.y - tip.y - left.y,
    );

    //console.log('new destination', destination);
  }

  updateDestination();

  app.ticker.add(() => {
    const deltaSecs = app.ticker.deltaMS / 1000;

    const destVersor = getVersor(car.position, destination);

    const car2 = car as SpriteWithShape;
    const testShape = new Circle({
      x: car.position.x + destVersor.x * LOOK_AHEAD,
      y: car.position.y + destVersor.y * LOOK_AHEAD,
      r: LOOK_AHEAD_CIRCLE_RADIUS,
    });
    extraShapes.push(testShape)

    // test if someone is in front of me and stop if so
    let keepMoving = true;
    const neighbors = onlyColliding(testShape, qtCars.retrieve(testShape));
    for (const nei of neighbors) {
      if (nei === car2._shape) continue;
      keepMoving = false;
    }

    if (dist(car.position, destination) < 2) {
      updateDestination();
    }

    if (keepMoving) {
      car.position.set(
        car.position.x + destVersor.x * CAR_SPEED * deltaSecs,
        car.position.y + destVersor.y * CAR_SPEED * deltaSecs,
      );

      car.angle = getAngleFromVersor(destVersor) * RAD_TO_DEG + 90;
    }
  });
}
