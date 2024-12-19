import getDelayString from "./getDelayString";

describe("getDelayString", () => {
  it('should return "+0m" when delay <= 0', () => {
    expect(getDelayString(0)).toBe("+0m");
    expect(getDelayString(-1)).toBe("+0m");
  });

  it('should return "+Xm" when delay is between hours and 0', () => {
    expect(getDelayString(69000)).toBe("+1m");
    expect(getDelayString(129000)).toBe("+2m");
  });

  it('should return "+XhXm" when delay is more than 1 hour', () => {
    expect(getDelayString(3659000)).toBe("+1h");
    expect(getDelayString(3661000)).toBe("+1h1m");
    expect(getDelayString(36610000)).toBe("+10h10m");
  });

  it("should ceil the result if it is an arrival time", () => {
    expect(getDelayString(3659000, true)).toBe("+1h1m");
    expect(getDelayString(3659000)).toBe("+1h");
  });
});
