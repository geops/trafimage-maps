import React from "react";
import { render } from "@testing-library/react";
import HandicapTopicInfo from ".";

describe("HandicapTopicInfo", () => {
  test("should display link to data", () => {
    const { container } = render(<HandicapTopicInfo />);
    const link = container.querySelector("a.wkp-link");
    expect(link.href).toBe(
      "https://data.sbb.ch/explore/dataset/barrierefreies-reisen/information/",
    );
  });
});
