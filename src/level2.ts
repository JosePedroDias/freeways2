import { PointArr, ProtoLevel } from './level';
import { W, H } from './constants';
import { rgbToNumber } from './colors';
import { uctArr } from './geometry';

const u = uctArr;

const W2 = W / 2;
const H2 = H / 2;
const L = H / 15;
const l = H / 45 / 2;

const O1: PointArr = [0 + l, H2];

const M1: PointArr = [0.33 * W, H2];

const D1: PointArr = [W - l, 0.25 * H];
const D2: PointArr = [W - l, 0.75 * H];

const d = 3;
const v = (a: PointArr): [PointArr, PointArr] => [
  [a[0], a[1] - d],
  [a[0], a[1] + d],
];

export const level: ProtoLevel = {
  segments: [v(O1), u(O1, M1), u(M1, D1), u(M1, D2), v(D1), v(D2)],
  origins: [
    {
      name: 'ori1',
      point: O1,
      needs: {
        dest1: 0.2,
        dest2: 0.4,
      },
    },
  ],
  destinations: [
    {
      name: 'dest1',
      color: rgbToNumber(255, 0, 0),
      point: D1,
    },
    {
      name: 'dest2',
      color: rgbToNumber(0, 0, 255),
      point: D2,
    },
  ],
  obstacles: [
    {
      blocksRoads: true,
      rect: [W2 - 2 * L, 0.5 * (H2 - L), 4 * L, 2 * L],
      // @ts-ignore
      color: 0xff00ff,
      // @ts-ignore
      landmarkSprite: 'bus',
    },
    {
      blocksRoads: false,
      rect: [3 * L, H - 4 * L, 5 * L, 3 * L],
    },
  ],
};
