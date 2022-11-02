import {
  Container,
  DisplayObject,
  Graphics,
  Sprite,
  Spritesheet,
  Texture,
} from 'pixi.js';

import { BlockingObstacle, Obstacle, WaterObstacle } from './level';

const landmarksTex = Texture.from('assets/landmarks.png').baseTexture;

const TILE_DIM = 200;
const SPRITE_NAMES =
  'bus train airport gas food residential factory history restaurant supermarket police fire hospital church golf post library biohazard fun history'.split(
    ' ',
  );

const rows = [
  SPRITE_NAMES.splice(0, 5),
  SPRITE_NAMES.splice(0, 5),
  SPRITE_NAMES.splice(0, 5),
  SPRITE_NAMES.splice(0, 5),
];

let initCompleted = false;

let landscapeTextures: { [key: string]: Texture };

let waterTexture: Texture;

function parseSpritesheet() {
  const frames: {
    [name: string]: { frame: { x: number; y: number; w: number; h: number } };
  } = {};

  let y = 0;
  for (const row of rows) {
    let x = 0;
    for (const cell of row) {
      frames[cell] = { frame: { x, y, w: TILE_DIM, h: TILE_DIM } };
      x += TILE_DIM;
    }
    y += TILE_DIM;
  }

  const ssData = {
    frames,
    meta: { scale: '1' },
    animations: {},
  };

  const ss = new Spritesheet(landmarksTex, ssData as any);
  return ss.parse();
}

export async function init() {
  if (initCompleted) return;

  landscapeTextures = await parseSpritesheet();
  waterTexture = Texture.from('assets/water.png');

  initCompleted = true;
}

export function getTexture(key: string): Texture {
  return landscapeTextures[key];
}

export function drawObstacle(obs_: Obstacle): DisplayObject {
  const gfx = new Graphics();
  if (obs_.blocksRoads) {
    const obs = obs_ as BlockingObstacle;

    const ctn = new Container();
    const r = obs.rect;
    gfx.beginFill(obs.color);
    gfx.drawRect(r.x, r.y, r.width, r.height);
    gfx.endFill();
    ctn.addChild(gfx);

    const spr = new Sprite(getTexture(obs.landmarkSprite));
    spr.position.set(r.x + r.width / 2, r.y + r.height / 2);
    spr.anchor.set(0.5);
    spr.scale.set(0.33);
    ctn.addChild(spr);

    return ctn;
  } else {
    const obs = obs_ as WaterObstacle;

    const r = obs.rect;
    gfx.beginTextureFill({
      texture: waterTexture,
    });
    gfx.drawRect(r.x, r.y, r.width, r.height);
    gfx.endFill();

    return gfx;
  }
}
