import React from "react";
import { render } from "@testing-library/react";
import LegalLines from "./LegalLines";

describe("LegalLines", () => {
  test("uses default  properties", () => {
    window.console.error = jest.fn().mockImplementation(() => {});
    const component = render(<LegalLines />);
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  ["rechtliches", "impressum", "kontakt"].forEach((doc) => {
    ["de", "fr", "en", "it"].forEach((lng) => {
      test(`should match snapshot with doc=${doc} and language=${lng}`, () => {
        const component = render(<LegalLines doc={doc} language={lng} />);
        expect(component.container.innerHTML).toMatchSnapshot();
      });
    });
  });
});
