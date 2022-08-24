import { PointArr, ProtoLevel } from './level';
import { W, H } from './constants';
import { rgbToNumber } from './colors';

const W2 = W / 2;
const H2 = H / 2;
const L = H / 15;
const l = H / 45;

const O1:PointArr = [0, H2];

const M1:PointArr = [3*L, H2];

const D1:PointArr = [W, 0.33 * H];
const D2:PointArr = [W, 0.66 * H];

export const level: ProtoLevel = {
  segments: [
    [ // origin
      [O1[0], O1[1]],
      [O1[0] + L, O1[1]],
    ],
    [ // middle
      [O1[0] + L -l, O1[1] -l],
      [M1[0] + l, M1[1]],
    ],
    /* [
      [O1[0] + l, O1[1]],
      [D1[0] - l, D1[1]],
    ],
    [
      [O1[0] + l, O1[1]],
      [D2[0] - l, D2[1]],
    ], */
    [ // destinations
      [D1[0] - L, D1[1]+l],
      [D1[0], D1[1]-l],
    ],
    [
      [D2[0] - L, D2[1]+l],
      [D2[0], D2[1]-l],
    ],
  ],
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
    }
  ],
  obstacles: [
    {
      blocksRoads: true,
      rect: [W2 - 2 * L, 0.75 * (H2 - L), 4 * L, 2 * L],
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
