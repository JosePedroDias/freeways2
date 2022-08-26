import { PointArr, ProtoLevel } from '../level';
import { W, H } from '../constants';
import { rgbToNumber } from '../colors';

const W2 = W / 2;
const H2 = H / 2;
const L = H / 15;
const l = H / 45;

const O1: PointArr = [0 + l, H2];
const D1: PointArr = [W - l, H2];

export const level: ProtoLevel = {
  segments: [
    [
      // origin
      [O1[0], O1[1] + l],
      [O1[0] + L, O1[1] - l],
    ],
    [
      // middle
      [O1[0] + l, O1[1]],
      [D1[0] - l, D1[1]],
    ],
    [
      // destination
      [D1[0] - L, D1[1] + l],
      [D1[0], D1[1] - l],
    ],
  ],
  origins: [
    {
      name: 'ori1',
      point: O1,
      needs: {
        dest1: 0.6,
      },
    },
  ],
  destinations: [
    {
      name: 'dest1',
      color: rgbToNumber(255, 0, 0),
      point: D1,
    },
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
