import { utils, Application, Graphics, Point } from 'pixi.js';
import { dist, getVersor, getAngleFromVersor, rotate90Degrees } from './aux';

utils.skipHello();

const W = 1024;
const H = 768;

const MIN_DIST = 10;
const MIN_DELTA_ANGLE = Math.PI / 20;
const ROAD_RADIUS = 20;
const ROAD_COLORS = [0x333333, 0x666666, 0x999999];

const app = new Application({
    width: W,
    height: H,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);


const bg = new Graphics();
bg.beginFill(0xDE3249);
bg.drawRect(0, 0, W, H);
bg.endFill();
bg.interactive = true;
app.stage.addChild(bg);


let gfx = new Graphics();
app.stage.addChild(gfx);

type Segment = {
    points: Point[];
    angles: number[];
    versors: Point[];
}

let segment:Segment = {
    points: [],
    angles: [],
    versors: []
};

function updateGfx() {
    gfx.clear();

    gfx.lineStyle(0);

    const path:Point[] = [];

    let l = segment.points.length;
    let i;
    for (i = 0; i < l; ++i) {
        const p = segment.points[i];
        const v_ = segment.versors[i];
        if (!v_) continue;
        const v = rotate90Degrees(v_);
        v.x = p.x + ROAD_RADIUS * v.x;
        v.y = p.y + ROAD_RADIUS * v.y;
        path.push(v);
    }
    for (i = l-1; i >= 0; --i) {
        const p = segment.points[i];
        const v_ = segment.versors[i];
        if (!v_) continue;
        const v = rotate90Degrees(v_);
        v.x = p.x + ROAD_RADIUS * -v.x;
        v.y = p.y + ROAD_RADIUS * -v.y;
        path.push(v);
    }
    
    gfx.beginFill(0x3500FA, 1);
    gfx.drawPolygon(path);
    gfx.endFill();

    gfx.beginFill(0xFFFFFF, 0.75);
    for (let {x, y} of segment.points) {
        gfx.drawCircle(x, y, 2);
    }
    gfx.endFill();
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
            segment.angles.push(getAngleFromVersor(v))
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
        angles: [],
        versors: []
    };
});


/* const graphics = new Graphics();

graphics.beginFill(0xFF3300);
graphics.lineStyle(10, 0xffd900, 1);

graphics.moveTo(50, 50);
graphics.lineTo(250, 50);
graphics.lineTo(100, 100);
graphics.lineTo(250, 220);
graphics.lineTo(50, 220);
graphics.lineTo(50, 50);
graphics.closePath();
graphics.endFill();

app.stage.addChild(graphics); */



/* app.ticker.add((_delta:number) => {
    const pos = app.renderer.plugins.interaction.mouse.global;
    console.log(`${pos.x}, ${pos.y}`);
}); */


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
