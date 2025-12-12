import React from "react";
import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import theme from "../../themes/default";
import RegionenkarteLegendBase from "./RegionenkarteLegend";

const mapping = {
  ost: "grun",
  sud: "rot",
  mitte: "lila",
  west: "gelb",
};

function RegionenkarteLegend(props) {
  return (
    <Provider store={global.store}>
      <RegionenkarteLegendBase {...props} />
    </Provider>
  );
}

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
