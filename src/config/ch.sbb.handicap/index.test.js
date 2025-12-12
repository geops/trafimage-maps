import { getLayersAsFlatArray } from "mobility-toolbox-js/common";
import { getHandicapLayers } from "./index";

describe("ch.sbb.handicap", () => {
  it("should always have the same layers key for layers available via permalink", () => {
    expect(true).toBe(true);
    const permalinkKeys = getLayersAsFlatArray(getHandicapLayers())
      .filter((l) => {
        return !l.get("hideInLegend") && !l.get("isBaseLayer");
      })
      .map((l) => l.key)
      .join(",");
    expect(permalinkKeys).toBe(
      "ch.sbb.bahnhofplaene,ch.sbb.bahnhofplaene.interaktiv,ch.sbb.bahnhofplaene.printprodukte,ch.sbb.status_unbekannt,ch.sbb.nichtbarrierfreierbahnhoefe,ch.sbb.teilbarrierefreiebahnhoefe,ch.sbb.barrierfreierbahnhoefe",
    );
  });
});
