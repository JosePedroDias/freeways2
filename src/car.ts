import { Application, Point, RAD_TO_DEG, Sprite, Graphics, Container } from 'pixi.js';
import { Quadtree, Circle as QCircle } from '@timohausmann/quadtree-ts';

import { W, H } from './constants';
import { getVersor, getAngleFromVersor, rotate90Degrees, dist } from './aux';
import { getRandomColor } from './colors';

//const TEXTURE_PATH = 'assets/cars/Ferrari_F40.png';
const TEXTURE_PATH = 'assets/cars/DeLorean_DMC.png';

const CAR_SPEED = 60; // in pixels per sec
const ARROW_W = 6;
const ARROW_H = 9;

const qt = new Quadtree({
  width: W,
  height: H,
  maxObjects: 10, // optional, default: 10
  maxLevels: 4, // optional, default:  4
});

export function addCar(app: Application, carsCtn:Container, carsAuxCtn:Container) {
  function getRandomPosition() {
    return new Point(
      Math.random() * W,
      Math.random() * H,
    );
  }

  const tint = getRandomColor();

  const auxGfx = new Graphics();
  carsAuxCtn.addChild(auxGfx);

  const car = Sprite.from(TEXTURE_PATH);
  car.scale.set(0.25);
  car.position = getRandomPosition();
  car.tint = tint;

  let destination:Point;

  function updateDestination() {
    destination = getRandomPosition();

    // DRAW ARROW (TIP > LEFT > RIGHT)
    const destVersor = getVersor(car.position, destination);
    const tip = new Point(destVersor.x * ARROW_H, destVersor.y * ARROW_H);
    const destVersorL = rotate90Degrees(destVersor);
    const left = new Point(destVersorL.x * ARROW_W, destVersorL.y * ARROW_W);

    auxGfx.clear();
    auxGfx.lineStyle({ width: 3, color: tint, alpha: 0.33 });

    auxGfx.moveTo(car.position.x, car.position.y);
    auxGfx.lineTo(destination.x, destination.y);
    auxGfx.lineTo(destination.x - tip.x + left.x, destination.y - tip.y + left.y);
    auxGfx.moveTo(destination.x, destination.y);
    auxGfx.lineTo(destination.x - tip.x - left.x, destination.y - tip.y - left.y);

    //console.log('new destination', destination);
  }

  updateDestination();

  let myCircle = new QCircle({
    x: car.position.x,
    y: car.position.y,
    r: 20,
  });

  qt.insert(myCircle);

  car.anchor.set(0.5);

  carsCtn.addChild(car);

  app.ticker.add(() => {
    const deltaSecs = app.ticker.deltaMS / 1000;

    // if there's someone in front of me, stay still
    //const neighbours = qt.retrieve()

    if (dist(car.position, destination) < 2) {
      updateDestination();
    }

    const destVersor = getVersor(car.position, destination);

    car.position.set(
      car.x + destVersor.x * CAR_SPEED * deltaSecs,
      car.y + destVersor.y * CAR_SPEED * deltaSecs,
    );

    car.angle = getAngleFromVersor(destVersor) * RAD_TO_DEG + 90;

    /* const pos = car.position;
    const area = new Rectangle({
      x: pos.x,
      y: pos.y,
      width: ROAD_RADIUS * 4,
      height: ROAD_RADIUS * 4,
    });
    const elements = qt.retrieve(area);
    if (elements.length > 0) {
      //console.log(elements.length)
    } */
    //console.log(elements);
    //console.log(app.ticker.lastTime);
    //carSprite.rotation += 0.01;
  });
}
