import React from "react";
import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import theme from "../../themes/default";
import RegionenkarteLegend from "./RegionenkarteLegend";

const mapping = {
  ost: "grun",
  sud: "rot",
  mitte: "lila",
  west: "gelb",
};

describe("RegionenkarteLegend", () => {
  test("should display correct partners", async () => {
    const { queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <RegionenkarteLegend />
      </ThemeProvider>,
    );
    ["ost", "west", "sud", "mitte"].forEach((region) => {
      const imgElement = queryByTestId(`regionenkartelegend-${region}`);
      expect(imgElement).toBeInTheDocument();
      expect(imgElement).toHaveAttribute("src", `${mapping[region]}.png`);
    });
  });
});
