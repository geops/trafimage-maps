import { Layer } from "mobility-toolbox-js/ol";
import { generateExtraData } from "./exportUtils";

describe("ExportUtils ", () => {
  describe("generateExtraData", () => {
    test("renders only copyrights from visible layer", () => {
      const layerWithCopyrights = new Layer({
        copyrights: [
          '<a href="https://www.sbb.ch/" target="_blank">© SBB/CFF/FFS</a>',
          '<a href="https://www.geops.ch/" target="_blank">© geOps Tiles</a>',
        ],
      });
      const layerWithCopyrightsNotVisible = new Layer({
        visible: false,
        copyrights: [
          '<a href="https://www.dbahn.de/" target="_blank">© DBAHN</a>',
          '<a href="https://www.geops.ch/" target="_blank">© geOps Tiles</a>',
        ],
      });
      const layers = [layerWithCopyrights, layerWithCopyrightsNotVisible];

      expect(
        generateExtraData(layers, { copyright: true }).copyright.text(),
      ).toBe("© SBB/CFF/FFS | © geOps Tiles");
    });

    test("renders only unique copyrights", () => {
      const layerWithCopyrights = new Layer({
        copyrights: [
          '<a href="https://www.sbb.ch/" target="_blank">© SBB/CFF/FFS</a>',
          '<a href="https://www.geops.ch/" target="_blank">© geOps Tiles</a>',
        ],
      });
      const layerWithOthersCopyrights = new Layer({
        copyrights: [
          '<a href="https://www.dbahn.de/" target="_blank">© DBAHN</a>',
          '<a href="https://www.geops.ch/" target="_blank">© geOps Tiles</a>',
        ],
      });
      const layers = [layerWithCopyrights, layerWithOthersCopyrights];

      expect(
        generateExtraData(layers, { copyright: true }).copyright.text(),
      ).toBe("© SBB/CFF/FFS | © geOps Tiles | © DBAHN");
    });

    test("renders also copyrights from children", () => {
      const child = new Layer({
        copyrights: [
          '<a href="https://www.dbahnn.de/" target="_blank">© DBAHNN</a>',
          '<a href="https://www.geops.ch/" target="_blank">© geOps Tiles</a>',
        ],
      });
      const layerWithCopyrights = new Layer({
        copyrights: [
          '<a href="https://www.sbb.ch/" target="_blank">© SBB/CFF/FFS</a>',
          '<a href="https://www.geops.ch/" target="_blank">© geOps Tiles</a>',
        ],
        children: [child],
      });
      const layers = [layerWithCopyrights];

      expect(
        generateExtraData(layers, { copyright: true }).copyright.text(),
      ).toBe("© SBB/CFF/FFS | © geOps Tiles | © DBAHNN");
    });

    test("renders north arrow", () => {
      expect(generateExtraData([], { northArrow: true }).northArrow).toEqual({
        src: "northArrowCircle.png",
      });
    });
  });
});
