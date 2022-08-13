import { utils, Application, Text, Sprite } from 'pixi.js';

utils.skipHello();

const app = new Application({
    width: 640,
    height: 360,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

const basicText = new Text('Basic text in pixi');
basicText.x = 50;
basicText.y = 100;
app.stage.addChild(basicText);

app.loader.add('bunny', 'assets/cars/Ferrari_F40.png').load((_loader, resources) => {
    const bunny = new Sprite(resources.bunny.texture);

    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    app.stage.addChild(bunny);

    app.ticker.add(() => {
        bunny.rotation += 0.01;
    });
});
