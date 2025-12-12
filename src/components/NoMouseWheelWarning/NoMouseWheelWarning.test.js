import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Map } from "ol";
import { MouseWheelZoom } from "ol/interaction";
import NoMouseWheelWarning from "./NoMouseWheelWarning";

describe("NoMouseWheelWarning", () => {
  test("deactivate mouse wheel interaction in embedded mode", () => {
    const map = new Map({});
    const mouseWheelZoom = map
      .getInteractions()
      .getArray()
      .find((int) => int instanceof MouseWheelZoom);
    expect(mouseWheelZoom.getActive()).toBe(true);
    render(
      <Provider
        store={global.mockStore({
          app: { i18n: global.i18n, map, embedded: true },
        })}
      >
        <NoMouseWheelWarning />
      </Provider>,
    );
    expect(mouseWheelZoom.getActive()).toBe(false);
  });

  test("doesn't deactivate mouse wheel interaction", () => {
    const map = new Map({});
    const mouseWheelZoom = map
      .getInteractions()
      .getArray()
      .find((int) => int instanceof MouseWheelZoom);
    expect(mouseWheelZoom.getActive()).toBe(true);
    render(
      <Provider
        store={global.mockStore({
          app: { i18n: global.i18n, map, embedded: false },
        })}
      >
        <NoMouseWheelWarning />
      </Provider>,
    );
    expect(mouseWheelZoom.getActive()).toBe(true);
  });
});
