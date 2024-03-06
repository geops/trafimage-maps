import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import InputIcon from "./InputIcon";

describe("InputIcon", () => {
  test("should match snapshot when unchecked and checkbox", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <InputIcon />
      </ThemeProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
  test("should match snapshot when unchecked and radio button", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <InputIcon type="radio" />
      </ThemeProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
  test("should match snapshot when checked and checkbox", () => {
    const { container, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <InputIcon checked />
      </ThemeProvider>,
    );
    expect(getByTestId("input-icon-tick")).toBeInTheDocument();
    expect(container.innerHTML).toMatchSnapshot();
  });
  test("should match snapshot when checked and radio button", () => {
    const { container, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <InputIcon type="radio" checked />
      </ThemeProvider>,
    );
    expect(getByTestId("input-icon-radio")).toBeInTheDocument();
    expect(container.innerHTML).toMatchSnapshot();
  });
});
