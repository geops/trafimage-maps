import React from "react";
import { render } from "@testing-library/react";

import StopSearchResult from "./StopSearchResult";

describe("StopSearchResult", () => {
  test("returns null when no properties defined", () => {
    const { queryByTestId } = render(<StopSearchResult />);
    expect(queryByTestId("stopfinder-search-result")).toBeNull();
  });

  test("returns null when no property title defined", () => {
    const { queryByTestId } = render(
      <StopSearchResult properties={{ foo: "bar" }} />,
    );
    expect(queryByTestId("stopfinder-search-result")).toBeNull();
  });

  test("returns component with name when property title defined", () => {
    const { queryByTestId } = render(
      <StopSearchResult properties={{ name: "bar" }} />,
    );
    expect(queryByTestId("stopfinder-search-result")).toBeDefined();
  });
});
