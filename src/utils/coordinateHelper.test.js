import coordinateHelper from "./coordinateHelper";

describe("coordinateHelper", () => {
  test("should format coordinates correcly.", () => {
    expect(
      coordinateHelper.wgs84Format([8.298163986976597, 47.041177354357444]),
    ).toEqual(["8.29816", "47.04118"]);
    expect(
      coordinateHelper.wgs84Format(
        [8.298163986976597, 47.041177354357444],
        ",",
      ),
    ).toEqual(["8,29816", "47,04118"]);
    expect(
      coordinateHelper.meterFormat([929977.0073545576, 5948635.427925528]),
    ).toEqual(["929'977", "5'948'635"]);
  });
});
