import React from "react";
import { render, screen, waitFor, getByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import LanguageSelect from "./LanguageSelect";
// import getStore from "../../model/store";
import theme from "../../themes/default";

describe("LanguageSelect", () => {
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = { hostname: "wkp-dev.foo" };
  afterEach(() => jest.restoreAllMocks());

  test("should add tracking event on switch to IT", async () => {
    // store = getStore();
    render(
      <ThemeProvider theme={theme}>
        <Provider store={global.store}>
          <LanguageSelect />
        </Provider>
      </ThemeProvider>,
    );

    userEvent.click(getByRole(screen.getByTestId("lang-select"), "combobox"));
    await waitFor(() => {
      const optionIt = screen.getByTestId("lang-select-option-it");
      userEvent.click(optionIt);
      expect(window.digitalDataLayer[0]?.event.eventInfo.label).toMatch(/it/i);
      expect(window.digitalDataLayer[0]?.event.eventInfo.variant).toMatch(
        /Sprache wählen/i,
      );
    });
  });
});
