import { Application, Point } from 'pixi.js';
import { enumerateReverse } from './aux';
import { getCars, isCloseToAnyCar } from './car';
import { CAR_RADIUS } from './constants';
import { distSquared } from './geometry';

import { Destination, Level, Origin } from './level';

type NeedState = {
  from: Origin;
  to: Destination;
  destinationName: string;
  spawnMS: number;
  forNextSpawnMS: number;
};

export function carSpawn(
  app: Application,
  level: Level,
  addCarFn: (destinationName: string, color: number, pos: Point) => void,
) {
  const needStates: NeedState[] = [];

  for (const ori of level.origins) {
    for (const destinationName of Object.keys(ori.needs)) {
      const carsPerSec = ori.needs[destinationName];
      const spawnMS = 1000 / carsPerSec;
      needStates.push({
        from: ori,
        to: level.destinations.find(
          (dest) => dest.name === destinationName,
        ) as Destination,
        destinationName,
        spawnMS,
        forNextSpawnMS: Math.random() * spawnMS,
      });
    }
  }

  app.ticker.add(() => {
    const deltaMS = app.ticker.deltaMS;

    for (const ns of needStates) {
      if (ns.forNextSpawnMS <= 0) {
        const pos = ns.from.point.clone();
        
        if (!isCloseToAnyCar(pos, CAR_RADIUS * 1.2)) {
          addCarFn(ns.destinationName, ns.to.color, pos);
          ns.forNextSpawnMS += ns.spawnMS;
          console.log('SPAWNED');
        } else {
          console.log('SPAWN DENIED');
        }
      }

      ns.forNextSpawnMS -= deltaMS;
    }

    const MIN_DIST_SQ = 30 * 30;
    const cars = getCars();
    for (const dst of level.destinations) {
      for (const [idx, car] of enumerateReverse(cars)) {
        // so we can splice
        const dSq = distSquared(car.sprite.position, dst.point);
        //console.log(dst.name, idx, dSq.toFixed(0));
        if (dSq < MIN_DIST_SQ) {
          console.log('POOF!');
          car.sprite.parent.removeChild(car.sprite);
          cars.splice(idx, 1);
        }
      }
    }
  });
}
