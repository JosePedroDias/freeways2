import { Point, Rectangle } from 'pixi.js';
import { simplifyNumber, simplifyPointToPair, simplifyRectangleToArray4 } from './aux';
import { Segment } from './segment';

type ProtoSegment = {
  points: [number, number][];
  versors: [number, number][];
};

export type ProtoLevel = {
  segments: ProtoSegment[];
  origins: ProtoOrigin[];
  destinations: ProtoDestination[];
  obstacles: Obstacle[];
};

type ProtoDestination = {
  name: string;
  point: [number, number];
  versor: [number, number];
};

type ProtoOrigin = ProtoDestination & {
  spawnRate: number;
};

type Destination = {
  name: string;
  point: Point;
  versor: Point;
};

type Origin = Destination & {
  spawnRate: number;
};

type Obstacle = {
  rect: Rectangle;
  color: number;
  blocksRoads: boolean;
};

type Level = {
  segments: Segment[];
  origins: Origin[];
  destinations: Destination[];
  obstacles: Obstacle[];
};

export function importLevel(pl: ProtoLevel): Level {
  const s = JSON.stringify(pl);
  return JSON.parse(s, (_key:string, val:any) => {
    if (val instanceof Array && typeof val[0] === 'number') {
      if (val.length === 2) return new Point(val[0], val[1]);
      if (val.length === 4) return new Rectangle(val[0], val[1], val[2], val[3]);
    }
    return val;
  });
}

export function exportLevel(l:Level): ProtoLevel {
  const s = JSON.stringify(l, (_key:string, val:any)=> {
    if (val instanceof Point) return simplifyPointToPair(val);
    if (val instanceof Rectangle) return simplifyRectangleToArray4(val);
    if (typeof val === 'number') return simplifyNumber(val);
    return val;
  });
  return JSON.parse(s);
}