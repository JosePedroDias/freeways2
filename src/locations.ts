import { Container, DisplayObject, Graphics, Text, TextStyle } from "pixi.js";

const FONT_SIZE = 14;
const BASE_COLOR = 0x812D22;
const BASE_HEIGHT = 20;
const BASE_WIDTH = 4;

const BASIC_TEXT_OPTS: TextStyle = {
  fill: 0xffffff,
  fontSize: FONT_SIZE,
  align: 'center',
} as TextStyle;

export function drawLocation(name:string, color:number, bgColor:number):DisplayObject {
  const ctn = new Container();

  const txt = new Text(name, { ...BASIC_TEXT_OPTS, fill: color });
  txt.anchor.set(0.5);
  txt.position.set(0, -BASE_HEIGHT);

  const textWidth = txt.getBounds().width + 4;

  const gfx = new Graphics();
  gfx.lineStyle(0);

  gfx.beginFill(BASE_COLOR, 1);
  gfx.moveTo(-BASE_WIDTH/2, 0);
  gfx.lineTo(-BASE_WIDTH/2, -BASE_HEIGHT);
  gfx.lineTo( BASE_WIDTH/2, -BASE_HEIGHT);
  gfx.lineTo( BASE_WIDTH/2, 0);
  gfx.endFill();

  const y = 0.85*BASE_HEIGHT - FONT_SIZE/2;

  gfx.beginFill(bgColor, 1);
  gfx.moveTo(-textWidth/2, 0-y);
  gfx.lineTo(-textWidth/2, -BASE_HEIGHT-y);
  gfx.lineTo( textWidth/2, -BASE_HEIGHT-y);
  gfx.lineTo( textWidth/2, 0-y);
  gfx.endFill();

  ctn.addChild(gfx);
  ctn.addChild(txt);

  return ctn;
}
