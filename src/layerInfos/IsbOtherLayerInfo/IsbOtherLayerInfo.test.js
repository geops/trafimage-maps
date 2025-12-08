import React from "react";
import { render, screen } from "@testing-library/react";
import { getIsbLayers } from "../../config/ch.sbb.isb";
import IsbOtherLayerInfo from ".";

const layers = getIsbLayers();
const isbOther = layers.find((layer) => layer.key === "ch.sbb.isb.other");

describe("IsbOtherLayerInfo", () => {
  test("render something", () => {
    render(<IsbOtherLayerInfo properties={isbOther} />);
    // Test important operator
    expect(screen.getByText(/DB, /)).toBeInTheDocument();
  });
});
