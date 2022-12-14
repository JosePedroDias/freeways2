import { Point, Rectangle } from 'pixi.js';
import {
  simplifyNumber,
  simplifyPointToPair,
  simplifyRectangleToArray4,
} from './aux';
import { Segment } from './segment';

export type PointArr = [number, number];
export type RectArr = [number, number, number, number];

type ProtoSegment = PointArr[];

export type ProtoLevel = {
  segments: ProtoSegment[];
  origins: ProtoOrigin[];
  destinations: ProtoDestination[];
  obstacles: ProtoObstacle[];
};

type ProtoOrigin = {
  name: string;
  point: PointArr;
  needs: { [to: string]: number }; // spawnRate in cars per second
};

type ProtoDestination = {
  name: string;
  point: PointArr;
  color: number;
};

export type Origin = Destination & {
  name: string;
  point: Point;
  needs: { [to: string]: number }; // spawnRate in cars per second
};

export type Destination = {
  name: string;
  point: Point;
  color: number;
};

export type BlockingObstacle = {
  rect: Rectangle;
  color: number;
  landmarkSprite: string;
  blocksRoads: true;
};

export type WaterObstacle = {
  rect: Rectangle;
  blocksRoads: false;
};

export type Obstacle = BlockingObstacle | WaterObstacle;

type ProtoObstacle = Omit<Obstacle, 'rect'> & {
  rect: RectArr;
};

export type Level = {
  segments: Segment[];
  origins: Origin[];
  destinations: Destination[];
  obstacles: Obstacle[];
};

export function importLevel(pl: ProtoLevel): Level {
  const s = JSON.stringify(pl);
  return JSON.parse(s, (_key: string, val: any) => {
    if (val instanceof Array && typeof val[0] === 'number') {
      if (val.length === 2) return new Point(val[0], val[1]);
      if (val.length === 4)
        return new Rectangle(val[0], val[1], val[2], val[3]);
    }
    return val;
  });
}

export function exportLevel(l: Level): ProtoLevel {
  const s = JSON.stringify(l, (_key: string, val: any) => {
    if (val instanceof Point) return simplifyPointToPair(val);
    if (val instanceof Rectangle) return simplifyRectangleToArray4(val);
    if (typeof val === 'number') return simplifyNumber(val);
    return val;
  });
  return JSON.parse(s);
}
