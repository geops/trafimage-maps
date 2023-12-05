import React from "react";
import { Provider } from "react-redux";

import { render } from "@testing-library/react";
import PermalinkButton from ".";

describe("PermalinkButton", () => {
  let store;
  test("should match snapshot.", () => {
    store = global.mockStore({
      map: {},
      app: { drawIds: {} },
    });

    const component = render(
      <Provider store={store}>
        <PermalinkButton>
          {() => {
            return <div />;
          }}
        </PermalinkButton>
      </Provider>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });
});
