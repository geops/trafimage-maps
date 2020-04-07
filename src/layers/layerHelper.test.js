import layerHelper from './layerHelper';

const expected = [
  5,
  5,
  5,
  5,
  10,
  30,
  30,
  30,
  100,
  100,
  100,
  150,
  150,
  150,
  150,
];

[
  1200.999999, // 5
  950, // 5
  899.55151, // 5
  840.52144, // 10
  500, // 10
  247.545142, // 30
  115, // 30
  110.555555, // 30
  75.99, // 100
  40.545142, // 100
  35, // 100
  33.5555555, // 150
  20.12154512, // 150
  19.9532541, // 150
  null, // 150
].forEach((res, idx) => {
  test(`get correct generalization of ${res}`, () => {
    const gen = layerHelper.getGeneralization(res);
    expect(gen).toBe(expected[idx]);
  });
});
