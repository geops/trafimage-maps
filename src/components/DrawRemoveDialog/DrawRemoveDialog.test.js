import React from "react";

import { Provider } from "react-redux";

import { Layer } from "mobility-toolbox-js/ol";
import OLLayer from "ol/layer/Vector";
import { ThemeProvider } from "@mui/material";
import { render, waitFor } from "@testing-library/react";
import theme from "../../themes/default";
import DrawRemoveDialog from ".";

describe("DrawRemoveDialog", () => {
  let store;

  beforeEach(() => {
    store = global.mockStore({
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        dialogPosition: {
          top: 0,
          left: 0,
        },
      },
      map: {
        drawlayer: new Layer({
          name: "test",
          olLayer: new OLLayer(),
          properties: {
            description: "description<br/>break",
          },
        }),
      },
    });
  });

  test("should match snapshot", async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DrawRemoveDialog />
        </Provider>
      </ThemeProvider>,
    );

    // Remove act warning in logs
    await waitFor(() => {
      return false;
    });
    expect(container.innerHTML).toMatchSnapshot();
  });
});
