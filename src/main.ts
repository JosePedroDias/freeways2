import { utils, Application, Graphics, Point, Container, Text } from 'pixi.js';
// import { Quadtree, Line } from '@timohausmann/quadtree-ts';

import { W, H, BG_COLOR, SHOW_FPS } from './constants';
import { Segment, onMove, updateGfx } from './segment';
import { addCar, setupCarQtVis } from './car';
import { setupKeyHandling } from './keyboard';
import { doesSegmentSelfIntersect, segmentsToGraph } from './topology';
import { importLevel, exportLevel } from './level';
import { level as level0 } from './level0';
//import { level as level1 } from './level1';

utils.skipHello();

const app = new Application({
  width: W,
  height: H,
  antialias: true,
  resolution: devicePixelRatio,
  autoDensity: true,
});

document.body.appendChild(app.view);

/* const qt = new Quadtree({
  width: W,
  height: H,
  maxObjects: 10, // optional, default: 10
  maxLevels: 4, // optional, default:  4
}); */

const bg = new Graphics();
bg.beginFill(BG_COLOR);
bg.drawRect(0, 0, W, H);
bg.endFill();
bg.interactive = true;
app.stage.addChild(bg);

const roadsCtn = new Container();
const roadsAuxCtn = new Container();
const carsAuxCtn = new Container();
const carsCtn = new Container();
app.stage.addChild(roadsCtn);
app.stage.addChild(roadsAuxCtn);
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

// STATE
let level = importLevel(level0); // level0 level1
for (const seg of level.segments) {
  const _segmentGfx = new Graphics();
  roadsCtn.addChild(_segmentGfx);
  updateGfx(seg, _segmentGfx);
}

let segment: Segment = {
  points: [],
  versors: [],
};
level.segments.push(segment);

let segmentGfx = new Graphics();
roadsCtn.addChild(segmentGfx);
updateGfx(segment, segmentGfx);

let isDown = false;
bg.on('pointermove', (ev) => {
  if (!isDown) return;

  const p = ev.data.global as Point;
  onMove(segment, segmentGfx, p);
  /* if (potentialPair) {
    const [p1, p2] = potentialPair;
    qt.insert(
      new Line({
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
      }),
    );
  } */
});

function onPointerUp(ev:Event) {
  if (!isDown) return;

  isDown = false;

  if (ev.type === 'mouseleave' || doesSegmentSelfIntersect(segment)) {
    level.segments.pop();
    roadsCtn.removeChild(segmentGfx);
  }

  segmentGfx = new Graphics();
  roadsCtn.addChild(segmentGfx);

  segment = {
    points: [],
    versors: [],
  };
  level.segments.push(segment);
}

bg.on('pointerdown', () => {
  isDown = true;
});

bg.on('pointerup', onPointerUp);

app.view.addEventListener('mouseleave', onPointerUp);

setupCarQtVis(app);

setupKeyHandling((key, isDown): boolean => {
  //console.log(isDown ? 'down' : 'up  ', key);
  if (!isDown) {
    if (key === ' ') {
      // UPDATE SEGMENTS NAVIGATION GRAPH
      segmentsToGraph(level.segments, roadsAuxCtn);
      return true;
    } else if (key === 'u') {
      // UNDO
      if (level.segments.length > 1) {
        level.segments.splice(level.segments.length - 2, 1);
        roadsCtn.removeChildAt(roadsCtn.children.length - 2);
        roadsAuxCtn.removeChildren();
      }
      return true;
    } else if (key === 's') {
      // EXPORT SEGMENTS
      const out = exportLevel(level);
      console.log(out);
      return true;
    }
  }
  return false;
});

// ~ STATE
for (let i = 0; i < 12; ++i) {
  addCar(app, carsCtn, carsAuxCtn);
}
