import getGreaterNumber from "./getGreaterNumber";

test(`#getGreaterNumber()`, () => {
  let gen = getGreaterNumber(20.01, [200, 50, 100, 20, 10, 5]);
  expect(gen).toBe(50);
  gen = getGreaterNumber(50, [200, 50, 100, 20, 10, 5]);
  expect(gen).toBe(50);
  gen = getGreaterNumber(300, [200, 50, 100, 20, 10, 5]);
  expect(gen).toBe(200);
  gen = getGreaterNumber(0, [200, 50, 100, 20, 10, 5]);
  expect(gen).toBe(5);
});
