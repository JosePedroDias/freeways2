import { Application, Point } from 'pixi.js';
import { getRandomColor } from './colors';

import { Level, Origin } from './level';

type NeedState = {
  from: Origin;
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
        // TODO DOES IT FIT?
        addCarFn(ns.destinationName, getRandomColor(), ns.from.point.clone());

        ns.forNextSpawnMS += ns.spawnMS;
      }

      ns.forNextSpawnMS -= deltaMS;
    }
  });
}
