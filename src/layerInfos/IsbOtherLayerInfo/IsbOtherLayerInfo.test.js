import React from "react";
import { render, screen } from "@testing-library/react";
import { isbOther } from "../../config/ch.sbb.isb";
import IsbOtherLayerInfo from ".";

describe("IsbOtherLayerInfo", () => {
  test("render something", () => {
    render(<IsbOtherLayerInfo properties={isbOther} />);
    // Test important operator
    expect(screen.getByText(/DB, /)).toBeInTheDocument();
  });
});
