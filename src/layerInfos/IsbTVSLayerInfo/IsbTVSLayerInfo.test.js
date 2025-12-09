import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { getIsbLayers } from "../../config/ch.sbb.isb";
import IsbTVSLayerInfoBase from ".";
import LayerService from "../../utils/LayerService";

const layers = getIsbLayers();
const isbTVS = new LayerService(layers)
  .getLayersAsFlatArray()
  .find((layer) => layer.key === "ch.sbb.isb.tvs");

function IsbTVSLayerInfo(props) {
  return (
    <Provider store={global.store}>
      <IsbTVSLayerInfoBase {...props} />
    </Provider>
  );
}

describe("IsbTVSLayerInfo", () => {
  test("render something", () => {
    render(<IsbTVSLayerInfo properties={isbTVS} />);
    // Test important operator
    expect(screen.getByText("SBB")).toBeInTheDocument();
    expect(screen.getByText("SBB Infrastruktur")).toBeInTheDocument();
    // Test one of the other operators
    expect(screen.getByText(/TMR, /)).toBeInTheDocument();
    expect(screen.getByText("www.tvs.ch")).toBeInTheDocument();
  });
});
