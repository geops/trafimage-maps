import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { getIsbLayers } from "../../config/ch.sbb.isb";
import LayerService from "../../utils/LayerService";
import IsbOtherLayerInfoBase from ".";

const layers = getIsbLayers();
const isbOther = new LayerService(layers)
  .getLayersAsFlatArray()
  .find((layer) => layer.key === "ch.sbb.isb.other");

function IsbOtherLayerInfo(props) {
  return (
    <Provider store={global.store}>
      <IsbOtherLayerInfoBase {...props} />
    </Provider>
  );
}

describe("IsbOtherLayerInfo", () => {
  test("render something", () => {
    render(<IsbOtherLayerInfo properties={isbOther} />);
    // Test important operator
    expect(screen.getByText(/DB, /)).toBeInTheDocument();
  });
});
