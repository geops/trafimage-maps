import React from "react";
import { render, screen } from "@testing-library/react";
import { getIsbLayers } from "../../config/ch.sbb.isb";
import IsbTVSLayerInfo from ".";

const layers = getIsbLayers();
const isbTVS = layers.find((layer) => layer.key === "ch.sbb.isb.tvs");

describe("IsbTVSLayerInfo", () => {
  test("render something", () => {
    render(<IsbTVSLayerInfo t={(a) => a} language="de" properties={isbTVS} />);
    // Test important operator
    expect(screen.getByText("SBB")).toBeInTheDocument();
    expect(screen.getByText("SBB Infrastruktur")).toBeInTheDocument();
    // Test one of the other operators
    expect(screen.getByText(/TMR, /)).toBeInTheDocument();
    expect(screen.getByText("www.tvs.ch")).toBeInTheDocument();
  });
});
