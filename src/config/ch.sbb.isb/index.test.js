import { isbOther, isbTVS } from "./index";

describe("ch.sbb.isb", () => {
  describe("isbOther", () => {
    test("has a shortToLongName property set and only unique keys, it's important for the layer infos", () => {
      expect(isbOther.get("shortToLongName")).toBeDefined();
      expect(isbOther.get("defaultColor")).toBeDefined();
    });
  });
  describe("isbTVS", () => {
    test("has a shortToLongName property set and only unique keys, it's important for the layer infos", () => {
      expect(isbTVS.get("shortToLongName")).toBeDefined();
      expect(isbTVS.get("colors")).toBeDefined();
      expect(isbTVS.get("defaultColor")).toBeDefined();
    });
  });
});
