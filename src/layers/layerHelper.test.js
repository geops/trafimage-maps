import layerHelper from './layerHelper';

const expected = [30, 5, 100];

describe('constants', () => {
  [247.545142, 1200.999999, 40.545142].forEach((res, idx) => {
    test(`get correct generalization of ${res}`, () => {
      const gen = layerHelper.getGeneralization(res);
      expect(gen).toBe(expected[idx]);
    });
  });
});
