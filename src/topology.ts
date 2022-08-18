import { Segment } from './segment';

import { Container, Graphics, Point, Text, TextStyle } from 'pixi.js';
import { DijkstraCalculator } from 'dijkstra-calculator';

import { combinationsOnce, combine2, pairUp } from './combinatorial';
import {
  angleBetweenVersors,
  dist,
  getVersor,
  lerp2,
  averagePoint,
  getLetter,
} from './geometry';
import { getRandomColor2 } from './colors';

const BASIC_LINE_STYLE = {
  width: 4,
  join: 'round',
  cap: 'round',
};

const BASIC_TEXT_OPTS: TextStyle = {
  fill: 0xffffff,
  fontSize: 14,
  align: 'center',
} as TextStyle;

// https://en.wikipedia.org/wiki/Intersection_(Euclidean_geometry)#Two_lines
// https://www.codegrepper.com/code-examples/javascript/javascript+get+point+of+line+intersection
// same function as quadExtras lineLineCollides but with different types as it's called super often
export function lineLineCollides(
  l1a: Point,
  l1b: Point,
  l2a: Point,
  l2b: Point,
): boolean {
  const det =
    (l1b.x - l1a.x) * (l2b.y - l2a.y) - (l2b.x - l2a.x) * (l1b.y - l1a.y);
  if (det === 0) return false;
  const lambda =
    ((l2b.y - l2a.y) * (l2b.x - l1a.x) + (l2a.x - l2b.x) * (l2b.y - l1a.y)) /
    det;
  const gamma =
    ((l1a.y - l1b.y) * (l2b.x - l1a.x) + (l1b.x - l1a.x) * (l2b.y - l1a.y)) /
    det;
  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
}

export function lineLineCollidesAt(
  l1a: Point,
  l1b: Point,
  l2a: Point,
  l2b: Point,
): Point | false {
  const det =
    (l1b.x - l1a.x) * (l2b.y - l2a.y) - (l2b.x - l2a.x) * (l1b.y - l1a.y);
  if (det === 0) return false;
  const lambda =
    ((l2b.y - l2a.y) * (l2b.x - l1a.x) + (l2a.x - l2b.x) * (l2b.y - l1a.y)) /
    det;
  const gamma =
    ((l1a.y - l1b.y) * (l2b.x - l1a.x) + (l1b.x - l1a.x) * (l2b.y - l1a.y)) /
    det;
  if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
    return new Point(
      l1a.x + lambda * (l1b.x - l1a.x),
      l1a.y + lambda * (l1b.y - l1a.y),
    );
  }
  return false;
}

export function isPointInsideLineSegment(
  p: Point,
  a: Point,
  b: Point,
): boolean {
  const v1 = getVersor(a, p);
  const v2 = getVersor(p, b);
  const ang = angleBetweenVersors(v1, v2);
  return Math.abs(ang) < Math.PI / 2;
}

export function doesSegmentSelfIntersect(segment: Segment): boolean {
  const pairs = pairUp(segment.points);
  const combs = combinationsOnce(pairs.length, false);
  for (const [pi1, pi2] of combs) {
    const [l1a, l1b] = pairs[pi1];
    const [l2a, l2b] = pairs[pi2];
    if (lineLineCollides(l1a, l1b, l2a, l2b)) {
      return true;
    }
  }
  return false;
}

type Edge = {
  from: Point;
  to: Point;
  points: Point[];
  weight: number;
};

export function segmentsToGraph(segments: Segment[], auxCtn: Container) {
  const edges: Edge[] = [];
  const vertices: Point[] = [];

  const ints = [];

  auxCtn.removeChildren();
  const gfx = new Graphics();
  auxCtn.addChild(gfx);

  gfx.clear();
  const segmentIndices = combinationsOnce(segments.length, true);
  for (const [si1, si2] of segmentIndices) {
    const seg1 = segments[si1];
    const seg2 = segments[si2];
    const pairs1 = pairUp(seg1.points);
    const pairs2 = pairUp(seg2.points);
    let int: Point | false = false;
    for (const [[l1a, l1b], [l2a, l2b]] of combine2(pairs1, pairs2)) {
      if ((int = lineLineCollidesAt(l1a, l1b, l2a, l2b))) {
        ints.push({ vertex: int, touching: [si1, si2] });
        vertices.push(int);
      }
    }
  }

  for (let i = 0; i < segments.length; ++i) {
    const points = segments[i].points;
    const lookFor = ints
      .filter((int) => int.touching.includes(i))
      .map((int) => ({
        vertex: int.vertex,
        bestIndex: -1,
        smallestDistance: -1,
      }));
    for (const [idx, p] of Object.entries(points)) {
      for (const lf of lookFor) {
        const d = dist(p, lf.vertex);
        if (lf.smallestDistance === -1 || lf.smallestDistance > d) {
          lf.smallestDistance = d;
          lf.bestIndex = +idx;
        }
      }
    }
    lookFor.sort((a, b) => a.bestIndex - b.bestIndex);
    const pairs = pairUp(lookFor);
    for (const [a, b] of pairs) {
      const from = a.vertex;
      const to = b.vertex;
      let edgePoints = points.slice(a.bestIndex, b.bestIndex);

      if (edgePoints.length < 2) {
        edgePoints = [lerp2(from, to, 0.1), lerp2(from, to, 0.9)];
      } else if (edgePoints.length === 2) {
        edgePoints.splice(1, 0, lerp2(edgePoints[0], edgePoints[1], 0.66));
        edgePoints.splice(1, 0, lerp2(edgePoints[0], edgePoints[1], 0.33));
      } else if (edgePoints.length === 3) {
        edgePoints.splice(2, 0, lerp2(edgePoints[1], edgePoints[2], 0.5));
        edgePoints.splice(1, 0, lerp2(edgePoints[0], edgePoints[1], 0.5));
      }

      if (!isPointInsideLineSegment(edgePoints[0], from, edgePoints[1])) {
        edgePoints.shift();
      }
      if (
        !isPointInsideLineSegment(
          edgePoints[edgePoints.length - 1],
          to,
          edgePoints[edgePoints.length - 2],
        )
      ) {
        edgePoints.pop();
      }

      const firstP = edgePoints[0];
      if (dist(firstP, from) > 1) {
        edgePoints.unshift(lerp2(from, firstP, 0.1));
      }
      const lastP = edgePoints.at(-1) as Point;
      if (dist(lastP, to) > 1) {
        edgePoints.push(lerp2(to, lastP, 0.1));
      }

      let weight = 0;
      for (const [a, b] of pairUp(edgePoints)) {
        weight += dist(a, b);
      }

      const edge = {
        from,
        to,
        points: edgePoints,
        weight,
      };
      edges.push(edge);
    }
  }

  // draw edges
  for (const [_eIdx, edge] of Object.entries(edges)) {
    const points = edge.points;

    gfx.lineStyle({
      ...BASIC_LINE_STYLE,
      color: getRandomColor2(64, 200, 64, 200, 64, 200),
    } as any);

    for (const [i, p] of Object.entries(points)) {
      if (i === '0') gfx.moveTo(p.x, p.y);
      else gfx.lineTo(p.x, p.y);
    }

    const ctr = averagePoint(points);
    //const txt = new Text(`${getLetter(+eIdx, false)} (${edge.weight.toFixed(0)})`, BASIC_TEXT_OPTS);
    const txt = new Text(`(${edge.weight.toFixed(0)})`, BASIC_TEXT_OPTS);
    txt.anchor.set(0.5);
    txt.alpha = 0.66;
    txt.position.set(ctr.x, ctr.y);
    auxCtn.addChild(txt);
  }

  gfx.lineStyle(0);

  // draw vertices
  for (const [vIdx, vtx] of Object.entries(vertices)) {
    gfx.beginFill(0xffffff, 0.66);
    gfx.drawCircle(vtx.x, vtx.y, 5);
    gfx.endFill();

    const txt = new Text(getLetter(+vIdx, true), {
      ...BASIC_TEXT_OPTS,
      fontSize: 18,
    });
    txt.anchor.set(0.5);
    txt.position.set(vtx.x + 6, vtx.y + 6);
    auxCtn.addChild(txt);
  }

  // prepare graph
  const graph = new DijkstraCalculator();

  const toUpper = (n: string) => getLetter(+n, true);

  for (const [vIdx, _vtx] of Object.entries(vertices)) {
    graph.addVertex(toUpper(vIdx));
  }

  for (const edge of edges) {
    const fromIdx = vertices.indexOf(edge.from);
    const toIdx = vertices.indexOf(edge.to);

    graph.addEdge(
      getLetter(fromIdx, true),
      getLetter(toIdx, true),
      edge.weight,
    );
    // @ts-ignore
    window.g = graph;
  }

  //console.log('vertices', vertices);
  //console.log('edges', edges);
}
