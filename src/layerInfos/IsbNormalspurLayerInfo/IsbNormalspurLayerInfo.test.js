import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import IsbNormalspurLayerInfoBase from ".";

function IsbNormalspurLayerInfo(props) {
  return (
    <Provider store={global.store}>
      <IsbNormalspurLayerInfoBase {...props} />
    </Provider>
  );
}

describe("IsbNormalspurLayerInfo", () => {
  test("render opertaors in alphabetical order", () => {
    const { container } = render(
      <IsbNormalspurLayerInfo
        properties={
          new Layer({
            properties: {
              shortToLongName: {
                zB: "zB",
                aSm: "aSm",
                ASM: "ASM",
              },
            },
          })
        }
      />,
    );
    // Test important operator
    expect(container.textContent.includes("aSm aSmASM ASMzB zB")).toBe(true);
  });
});
