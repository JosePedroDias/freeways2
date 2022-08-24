import { ProtoLevel } from './level';
import { W, H } from './constants';

const W2 = W / 2;
const H2 = H / 2;
const L = H / 15;

export const level: ProtoLevel = {
  segments: [
    [
      [352.3, 172.5],
      [382.8, 172.5],
      [420.6, 172.6],
      [467.2, 174.7],
      [522.5, 177.7],
      [579.4, 179.4],
      [626.5, 180.3],
      [660, 180.3],
      [687.3, 180.3],
      [705.8, 180.3],
      [720.4, 180.3],
    ],
    [
      [686.7, 150.5],
      [686.7, 168.8],
      [686.7, 184.1],
      [687.9, 203.5],
      [692.3, 227],
      [699.5, 253.3],
      [707.3, 279.6],
      [713.8, 300.7],
      [718.9, 317.8],
      [724, 333],
      [731.6, 347.9],
      [742.1, 362.6],
      [755.3, 376.6],
      [773.2, 393.3],
      [792.8, 408.3],
      [809.2, 418.1],
      [822.8, 424],
      [833.6, 427.5],
      [847.1, 429.6],
    ],
    [
      [840.7, 375.5],
      [833.9, 382.9],
      [822.7, 401.3],
      [812.5, 415.2],
      [799.6, 431.5],
      [784.4, 450.6],
      [766.3, 473.3],
      [745.9, 498],
      [727.3, 521.5],
      [711.9, 542.4],
      [699.7, 559.4],
      [689.8, 573.9],
      [682.4, 585.3],
      [675.1, 597.7],
    ],
    [
      [724.8, 599.4],
      [715.4, 592.8],
      [694.4, 574.5],
      [675.7, 558],
      [653.9, 539.7],
      [629, 521],
      [604.4, 504.1],
      [580.7, 489.1],
      [557.3, 474.6],
      [538.6, 462.1],
      [518.9, 448.7],
      [500.5, 437.1],
      [486.9, 429.3],
      [472, 421.3],
      [456.9, 414.2],
      [440.5, 407.8],
      [421.5, 401.6],
      [403.3, 396.2],
      [384.3, 390.7],
      [363, 384.2],
      [344.3, 378.6],
      [325.7, 373.4],
      [306.5, 368],
      [291.1, 363.8],
      [275.5, 360],
    ],
    [
      [379.1, 152.1],
      [376.8, 173.1],
      [374.9, 190.3],
      [373.2, 214.5],
      [371.3, 243.1],
      [370.1, 273.1],
      [369.3, 302.9],
      [368.6, 329.8],
      [368, 351.9],
      [366.6, 371.5],
      [363.6, 390.4],
      [359.3, 405.9],
      [354.5, 418.5],
      [349.7, 429.5],
      [344.8, 438.6],
      [336, 451.2],
      [328.6, 458.3],
    ],
    [
      [0, H2],
      [L, H2],
    ],
    [
      [W, H2],
      [W - L, H2],
    ],
  ],
  origins: [
    {
      name: 'ori1',
      point: [0, H2],
      needs: {
        dest1: 0.2,
        dest2: 0.4,
      },
    },
  ],
  destinations: [
    {
      name: 'dest1',
      point: [W, 0.33 * H],
    },
    {
      name: 'dest2',
      point: [W, 0.66 * H],
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
