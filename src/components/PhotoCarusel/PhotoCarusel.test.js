import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { MatomoProvider } from "@jonkoops/matomo-tracker-react";
import theme from "../../themes/default";
import PhotoCarusel from ".";

const photos = [
  "https://maps.trafimage.ch/photos/1.jpg",
  "https://maps.trafimage.ch/photos/2.jpg",
];

describe("PhotoCarusel", () => {
  let store;
  beforeEach(() => {
    store = global.global.mockStore({
      map: {},
      app: {},
    });
  });

  test("should match snapshot with empty photo array.", () => {
    const { queryByTestId } = render(
      <MatomoProvider value={{}}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PhotoCarusel photos={[]} />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>,
    );
    expect(queryByTestId("carousel-photo")).toBeNull();
  });

  test("should match snapshot with two photos and cycle buttons should behave correctly.", () => {
    const { queryByTestId, getByTestId } = render(
      <MatomoProvider value={{}}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PhotoCarusel photos={photos} />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>,
    );
    expect(queryByTestId("carousel-photo")).toBeTruthy();
    expect(queryByTestId("pagination-previous-button")).toBeFalsy();
    expect(queryByTestId("pagination-next-button")).toBeTruthy();
    const incrementBtn = getByTestId("pagination-next-button");
    fireEvent.click(incrementBtn);
    expect(queryByTestId("pagination-previous-button")).toBeTruthy();
    expect(queryByTestId("pagination-nex-button")).toBeFalsy();
  });
});
