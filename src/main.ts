import {
  utils,
  Application,
  Graphics,
  Point,
  Container,
  Text,
  Texture,
  TilingSprite,
} from 'pixi.js';

import { W, H, SHOW_FPS } from './constants';
import { Segment, onMove, updateSegmentGfx } from './segment';
import { setupCars } from './car';
import { setupKeyHandling } from './keyboard';
import { doesSegmentSelfIntersect, segmentsToGraph } from './topology';
import { importLevel, exportLevel } from './level';
import { level as level_ } from './level1';
import { init, drawObstacle } from './landmarks';

utils.skipHello();

const app = new Application({
  width: W,
  height: H,
  antialias: true,
  resolution: devicePixelRatio,
  autoDensity: true,
});

document.body.appendChild(app.view);

const bgTexture = Texture.from('assets/grass.png');

const bg = new TilingSprite(bgTexture, app.screen.width, app.screen.height);
bg.interactive = true;
app.stage.addChild(bg);

const obstaclesCtn = new Container();
const roadsCtn = new Container();
const roadsAuxCtn = new Container();
const carsAuxCtn = new Container();
const carsCtn = new Container();
app.stage.addChild(obstaclesCtn);
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
const level = importLevel(level_);
for (const seg of level.segments) {
  const _segmentGfx = new Graphics();
  roadsCtn.addChild(_segmentGfx);
  updateSegmentGfx(seg, _segmentGfx);
}
init().then(() => {
  for (const obs of level.obstacles) {
    const ctn = drawObstacle(obs);
    obstaclesCtn.addChild(ctn);
  }
});

let segment: Segment = {
  points: [],
  versors: [],
};
level.segments.push(segment);

let segmentGfx = new Graphics();
roadsCtn.addChild(segmentGfx);
updateSegmentGfx(segment, segmentGfx);
segmentsToGraph(level.segments, roadsAuxCtn);

let isDown = false;
bg.on('pointermove', (ev) => {
  if (!isDown) return;

  const p = ev.data.global as Point;
  onMove(segment, segmentGfx, p);
});

function onPointerUp(ev: Event) {
  if (!isDown) return;

  isDown = false;

  const skip = ev.type === 'mouseleave' || doesSegmentSelfIntersect(segment);

  if (skip) {
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

  if (!skip) {
    segmentsToGraph(level.segments, roadsAuxCtn);
  }
}

bg.on('pointerdown', () => {
  //console.log(ev); // TODO: ignore right mouse clicks! event doesn't seem to carry correct button?
  isDown = true;
});

bg.on('pointerup', onPointerUp);

app.view.addEventListener('mouseleave', onPointerUp);

setupKeyHandling((key, isDown): boolean => {
  //console.log(isDown ? 'down' : 'up  ', key);
  if (!isDown) {
    if (key === 'u') {
      // UNDO
      if (level.segments.length > 1) {
        level.segments.splice(level.segments.length - 2, 1);
        roadsCtn.removeChildAt(roadsCtn.children.length - 2);
        roadsAuxCtn.removeChildren();
        segmentsToGraph(level.segments, roadsAuxCtn);
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
const addCar = setupCars(app, carsCtn, carsAuxCtn);

let numCars = 0;
const timer = setInterval(() => {
  ++numCars;
  addCar();
  if (numCars > 0) {
    clearInterval(timer);
  }
}, 800);
