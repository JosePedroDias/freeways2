import { utils, Application, Graphics, Point, RAD_TO_DEG } from 'pixi.js';
import { dist, getVersor, rotate90Degrees, angleBetweenVersors, distXY } from './aux';

utils.skipHello();

const W = 1024;
const H = 768;

const MIN_DIST = 10;
const ROAD_RADIUS = 16;
const BG_COLOR = 0x449944;
const ROAD_COLORS = [0x333333, 0x666666, 0x999999];

const app = new Application({
    width: W,
    height: H,
    //backgroundColor: BG_COLOR
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

type Segment = {
    points: Point[];
    versors: Point[];
}

let segment:Segment = {
    points: [],
    versors: []
};

function updateGfx() {
    gfx.clear();

    gfx.lineStyle(0);

    const path:Point[] = [];

    let l = segment.points.length;
    if (l < 2) return;

    const cases = [
        {from: 0,   sign:  1},
        {from: l-1, sign: -1}
    ];

    for (let {from, sign} of cases) {
        let i = from;
        let step = 0;
        while (step++ < l) {
            const isLastOne = i === l - 1;
            const doAverage = i > 0 && !isLastOne;
            const p = segment.points[i];
            let v_;
            if (doAverage) {
                const v0 = segment.versors[i-1];
                const v1 = segment.versors[i];
                v_ = new Point(v0.x + v1.x, v0.y + v1.y);
                const d = distXY(v_.x, v_.y);
                v_.x /= d;
                v_.y /= d;
            } else {
                v_ = segment.versors[isLastOne ? i - 1 : i];
            }
            const v = rotate90Degrees(v_);
            v.x = p.x + ROAD_RADIUS * sign * v.x;
            v.y = p.y + ROAD_RADIUS * sign * v.y;
            path.push(v);

            i = i + sign;
        }
    }

    gfx.beginFill(ROAD_COLORS[0], 1);
    gfx.drawPolygon(path);
    gfx.endFill();

    if (true) {
        gfx.beginFill(0xFFFFFF, 0.25);
        for (let {x, y} of segment.points) {
            gfx.drawCircle(x, y, 1.5);
        }
        gfx.endFill();
    }
}

let isDown = false;
bg.on('pointermove', (ev) => {
    if (!isDown) return;

    const p = ev.data.global as Point;

    const lastP = segment.points.at(-1);
    if (!lastP) {
        segment.points.push(p.clone());
        updateGfx();
    }
    else {
        const d = dist(lastP, p);
        if (d > MIN_DIST) {
            segment.points.push(p.clone());
            const v = getVersor(p, lastP);
            segment.versors.push(v);

            const v0 = segment.versors.at(-2);
            const v1 = segment.versors.at(-1);
            if (v0 && v1) {
                const ang = angleBetweenVersors(v0, v1);
                console.log( (RAD_TO_DEG * ang).toFixed(1) );
            }
            updateGfx();
        }
    }
});

bg.on('pointerdown', () => {
    isDown = true;
});

bg.on('pointerup', () => {
    isDown = false;

    gfx = new Graphics();
    app.stage.addChild(gfx);

    segment = {
        points: [],
        versors: []
    };
});



/* const basicText = new Text('Basic text in pixi');
basicText.x = 50;
basicText.y = 100;
app.stage.addChild(basicText);*/

/* app.loader.add('bunny', 'assets/cars/Ferrari_F40.png').load((_loader, resources) => {
    const bunny = new Sprite(resources.bunny.texture);

    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    app.stage.addChild(bunny);

    app.ticker.add(() => {
        bunny.rotation += 0.01;
    });
}); */


/* const carSprite = Sprite.from('assets/cars/Ferrari_F40.png');

carSprite.x = app.renderer.width / 2;
carSprite.y = app.renderer.height / 2;

carSprite.anchor.x = 0.5;
carSprite.anchor.y = 0.5;

app.stage.addChild(carSprite);

carSprite.interactive = true;
carSprite.on('pointerdown', () => {
    console.log('ad');
});

app.ticker.add(() => {
    carSprite.rotation += 0.01;
}); */
