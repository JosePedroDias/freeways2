import { utils, Application, Graphics, Point, Sprite } from 'pixi.js';
import { BG_COLOR, ROAD_RADIUS } from './constants';
import { Segment, onMove, updateGfx } from './segment';
// import { simplifyNumber } from './aux';
// import { exampleSegment } from './exampleSegment';

import { Quadtree, Line, Rectangle } from '@timohausmann/quadtree-ts';

utils.skipHello();

const W = 1024;
const H = 768;

const app = new Application({
  width: W,
  height: H,
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

let gfx = new Graphics();
app.stage.addChild(gfx);

const segments: Segment[] = [];

let segment: Segment = {
  points: [],
  versors: [],
};
segments.push(segment);

//let segment:Segment = exampleSegment;

updateGfx(segment, gfx);

if (true) {
  let isDown = false;
  bg.on('pointermove', (ev) => {
    if (!isDown) return;

    const p = ev.data.global as Point;
    const potentialPair = onMove(segment, gfx, p);
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

    gfx = new Graphics();
    app.stage.addChild(gfx);

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
}

const car = Sprite.from('assets/cars/Ferrari_F40.png');
car.scale.set(0.2);

car.x = app.renderer.width / 2;
car.y = app.renderer.height / 2;

car.anchor.set(0.5);

app.stage.addChild(car);

app.ticker.add(() => {
  const pos = car.position;
  const area = new Rectangle({
    x: pos.x,
    y: pos.y,
    width: ROAD_RADIUS * 4,
    height: ROAD_RADIUS * 4,
  });
  const elements = qt.retrieve(area);
  if (elements.length > 0) {
    //console.log(elements.length)
  }
  //console.log(elements);

  //console.log(app.ticker.lastTime);
  //carSprite.rotation += 0.01;
});
