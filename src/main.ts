import { utils, Application, Graphics, Point } from 'pixi.js';
import { BG_COLOR } from './constants';
import { Segment, onMove } from './segment';

utils.skipHello();

const W = 1024;
const H = 768;

const app = new Application({
    width: W,
    height: H
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

let segment:Segment = {
    points: [],
    versors: []
};

let isDown = false;
bg.on('pointermove', (ev) => {
    if (!isDown) return;

    const p = ev.data.global as Point;
    onMove(segment, gfx, p);
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
