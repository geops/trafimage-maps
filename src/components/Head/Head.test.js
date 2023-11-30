import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import getStore from "../../model/store";
import Head from ".";

describe("Head", () => {
  let store;

  beforeEach(() => {
    store = getStore();
  });

  test("does nothing by default", () => {
    const { container } = render(
      <Provider store={store}>
        <Head />
      </Provider>,
    );
    expect(container.innerHTML).toBe("");
  });

  test("does nothing until displayConsent is true", () => {
    const { container } = render(
      <Provider store={store}>
        <Head topics={[{}]} domainConsentId="foo" displayConsent={false} />
      </Provider>,
    );
    expect(container.innerHTML).toBe("");
  });

  // TODO can't be tested with testing-library, use cypress
  test.skip("add consent script in HEAD", () => {
    // Here we don't test react-helmet we expect it to work, we just test the script is well added to react-helmet.
    // We let cypress test if the script is in the head.
    render(
      <Provider store={store}>
        <Head topics={[{}]} domainConsentId="foo" displayConsent />
      </Provider>,
    );
    const script = document.querySelector(
      'script[src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"]',
    );
    expect(script.charset).toBe("UTF-8");
    // expect(script).toEqual({
    //   charset: 'UTF-8',
    //   'data-cy': 'consent-script',
    //   'data-domain-script': 'foo',
    //   'data-language': 'de-ch',
    //   src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
    //   type: 'text/javascript',
    // });
  });

  // TODO can't be tested with testing-library, use cypress
  test.skip("add consent script in HEAD with the current language value", () => {
    store = global.mockStore({
      app: { language: "fr" },
    });
    // Here we don't test react-helmet we expect it to work, we just test the script is well added to react-helmet.
    // We let cypress test if the script is in the head.
    render(
      <Provider store={store}>
        <Head topics={[{}]} domainConsentId="foo" displayConsent />
      </Provider>,
    );
    expect(document.querySelectorAll("script")[1]["data-language"]).toEqual(
      "fr-ch",
    );
  });
});
