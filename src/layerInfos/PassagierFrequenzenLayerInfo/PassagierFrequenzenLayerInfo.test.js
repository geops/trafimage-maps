import React from "react";
import { render } from "@testing-library/react";
import PassagierFrequenzenLayerInfo from ".";
import { getNetzkarteLayers } from "../../config/ch.sbb.netzkarte";

const passagierfrequenzen = getNetzkarteLayers().find(
  (layer) => layer.key === "ch.sbb.bahnhoffrequenzen",
);

describe("PassagierFrequenzenLayerInfo", () => {
  test("should display link to data", () => {
    const { container } = render(
      <PassagierFrequenzenLayerInfo properties={passagierfrequenzen} />,
    );
    const link = container.querySelector("a.wkp-link");
    expect(link.href).toBe(
      "https://reporting.sbb.ch/verkehr?highlighted=row-243",
    );
  });
});
