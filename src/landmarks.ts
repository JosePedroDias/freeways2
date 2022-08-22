import { Spritesheet, Texture } from 'pixi.js';

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

export function parseSpritesheet() {
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
