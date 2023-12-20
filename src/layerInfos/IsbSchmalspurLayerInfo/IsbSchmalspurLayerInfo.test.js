import React from "react";
import { render } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import IsbSchmalspurLayerInfo from ".";

describe("IsbSchmalspurLayerInfo", () => {
  test("render something", () => {
    const { container } = render(
      <IsbSchmalspurLayerInfo
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
