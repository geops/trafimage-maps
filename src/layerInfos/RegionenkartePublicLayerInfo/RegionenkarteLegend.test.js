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
  test("should display all regions with correct colors", async () => {
    const { queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <RegionenkarteLegend />
      </ThemeProvider>,
    );
    Object.keys(mapping).forEach((region) => {
      const imgElement = queryByTestId(`regionenkartelegend-${region}`);
      expect(imgElement).toBeInTheDocument();
      expect(imgElement).toHaveAttribute("src", `${mapping[region]}.png`);
    });
  });
});
