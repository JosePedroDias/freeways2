import { utils, Application, Graphics, Point, Container, Text } from 'pixi.js';
import { Quadtree, Line } from '@timohausmann/quadtree-ts';

import { W, H, BG_COLOR, SHOW_FPS } from './constants';
import { Segment, onMove, updateGfx } from './segment';
import { addCar } from './car';

utils.skipHello();

const app = new Application({
  width: W,
  height: H,
  antialias: true,
  resolution: devicePixelRatio,
  autoDensity: true,
});

const qt = new Quadtree({
  width: W,
  height: H,
  maxObjects: 10, // optional, default: 10
  maxLevels: 4, // optional, default:  4
});

document.body.appendChild(app.view);

const bg = new Graphics();
bg.beginFill(BG_COLOR);
bg.drawRect(0, 0, W, H);
bg.endFill();
bg.interactive = true;
app.stage.addChild(bg);

const roadsCtn = new Container();
const carsAuxCtn = new Container();
const carsCtn = new Container();
app.stage.addChild(roadsCtn);
app.stage.addChild(carsAuxCtn);
app.stage.addChild(carsCtn);

if (SHOW_FPS) {
  const fpsTxt = new Text('FPS', {
    fill: 0xffffff,
    fontSize: 14,
    fontFamily: 'monospace',
  });
  fpsTxt.x = 40;
  fpsTxt.y = 40;
  app.stage.addChild(fpsTxt);

  app.ticker.add(() => {
    fpsTxt.text = app.ticker.FPS.toFixed(1);
  });
}

let segmentGfx = new Graphics();
roadsCtn.addChild(segmentGfx);

const segments: Segment[] = [];

let segment: Segment = {
  points: [],
  versors: [],
};
segments.push(segment);

//let segment:Segment = exampleSegment;

updateGfx(segment, segmentGfx);

//if (true) {
// allow drawing segments
let isDown = false;
bg.on('pointermove', (ev) => {
  if (!isDown) return;

  const p = ev.data.global as Point;
  const potentialPair = onMove(segment, segmentGfx, p);
  if (potentialPair) {
    const [p1, p2] = potentialPair;
    qt.insert(
      new Line({
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
      }),
    );
  }
});

bg.on('pointerdown', () => {
  isDown = true;
});

bg.on('pointerup', () => {
  isDown = false;

  segmentGfx = new Graphics();
  roadsCtn.addChild(segmentGfx);

  /* console.log({
        points:  segment.points.map(v => [simplifyNumber(v.x), simplifyNumber(v.y)]),
        versors: segment.versors.map(v => [simplifyNumber(v.x, 3), simplifyNumber(v.y, 3)])
    }); */

  segment = {
    points: [],
    versors: [],
  };

  segments.push(segment);
});

for (let i = 0; i < 40; ++i) {
  addCar(app, carsCtn, carsAuxCtn);
}

//}
