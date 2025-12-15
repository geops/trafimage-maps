import React from "react";
import { render, act, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { ThemeProvider } from "@mui/material";
import TarifVerbundLegend from "./TarifVerbundLegend";
import theme from "../../themes/default";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        metadata: {
          partners: [
            { name: "Foo", verbund_colour_hex: "8ec89a" },
            { name: "Bar", verbund_colour_hex: "e16153" },
            { name: "Fizz" },
          ],
        },
      }),
  }),
);

describe("TarifverbundLegend", () => {
  let store;
  beforeEach(() => {
    store = global.mockStore({
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        vectorTilesUrl: "http://tilefoo.ch",
        screenWidth: "lg",
      },
    });
    fetch.mockClear();
  });
  test("should display correct partners", async () => {
    await act(async () =>
      render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <TarifVerbundLegend />
          </Provider>
        </ThemeProvider>,
      ),
    );
    // Check if fetch is called
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Check if main legend container present
    expect(
      screen.getByTestId("tarifverbund-legend-container"),
    ).toBeInTheDocument();

    // Check if partners are sorted alphabetically
    expect(
      screen.getByTestId("tarifverbund-legend-container").children[0],
    ).toHaveAttribute("data-testid", "tarifverbund-partner-Bar");
    expect(
      screen.getByTestId("tarifverbund-legend-container").children[1],
    ).toHaveAttribute("data-testid", "tarifverbund-partner-Fizz");
    expect(
      screen.getByTestId("tarifverbund-legend-container").children[2],
    ).toHaveAttribute("data-testid", "tarifverbund-partner-Foo");

    // Check if all partners and z-pass are present
    expect(screen.getByTestId("tarifverbund-partner-Foo")).toBeInTheDocument();
    expect(screen.getByText("Foo")).toBeInTheDocument();
    expect(screen.getByTestId("tarifverbund-partner-Foo-color")).toHaveStyle(
      `background-color: #8ec89a`,
    );

    expect(screen.getByTestId("tarifverbund-partner-Bar")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
    expect(screen.getByTestId("tarifverbund-partner-Bar-color")).toHaveStyle(
      `background-color: #e16153`,
    );

    // Falls back to black when no color provided
    expect(screen.getByTestId("tarifverbund-partner-Fizz")).toBeInTheDocument();
    expect(screen.getByText("Fizz")).toBeInTheDocument();
    expect(screen.getByTestId("tarifverbund-partner-Fizz-color")).toHaveStyle(
      `background-color: black`,
    );

    expect(
      screen.getByTestId("tarifverbund-partner-Z-Pass"),
    ).toBeInTheDocument();
    expect(screen.getByText("Z-Pass")).toBeInTheDocument();
    expect(screen.getByTestId("tarifverbund-partner-Z-Pass-color")).toHaveStyle(
      `background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #bd9189 2px, #bd9189 4px)'`,
    );
  });
});
