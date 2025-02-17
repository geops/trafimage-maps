import lines from "./lines";

describe("lines", () => {
  test("must no have a string as key that is included in another key (that means style is probably broken)", () => {
    let hasWrongKey = false;
    Object.keys(lines).forEach((key) => {
      Object.keys(lines).forEach((key2) => {
        if (key !== key2 && key2.includes(key)) {
          // eslint-disable-next-line no-console
          console.log("Bad key key1:", key, "key2:", key2);
          hasWrongKey = true;
        }
      });
    });

    expect(hasWrongKey).toBe(false);
  });
});
