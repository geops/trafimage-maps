import geltungsbereicheLegendConfigs from ".";

const fs = require("fs");
const path = require("path");

describe("Geltungsbereiche legends: ", () => {
  geltungsbereicheLegendConfigs.forEach((item) => {
    it(`${item.legend} should contain a scaleline tag for dynamic scaleline placement`, () => {
      const svgPath = path.join(__dirname, "./", item.legend);
      const fdr = fs.readFileSync(svgPath, "utf8", (err, data) => {
        return data;
      });
      expect(fdr).toContain(`id="scaleline"`);
    });
  });
});
