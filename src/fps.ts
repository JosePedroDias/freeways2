import { Application, Text } from 'pixi.js';

export function setupFPS(app: Application) {
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
