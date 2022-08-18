import { Point, Rectangle } from 'pixi.js';
import { pairToPoint, simplifyPointToPair } from './aux';
import { Segment } from './segment';

type ProtoSegment = {
  points: [number, number][];
  versors: [number, number][];
};

export type ProtoLevel = {
  segments: ProtoSegment[];
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
  return {
    origins: [],
    destinations: [],
    obstacles: [],
    segments: pl.segments.map((seg) => ({
      points: seg.points.map(pairToPoint),
      versors: seg.versors.map(pairToPoint),
    })),
  };
}

export function exportLevel(segments: Segment[]): ProtoLevel {
  const protoSegs = [];
  for (const segment of segments) {
    if (segment.points.length === 0) continue;
    protoSegs.push({
      points: segment.points.map(simplifyPointToPair),
      versors: segment.versors.map(simplifyPointToPair),
    });
  }
  return {
    segments: protoSegs,
  };
}
