import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import ConstructionTopicInfoBase from ".";

function ConstructionTopicInfo(props) {
  return (
    <Provider store={global.store}>
      <ConstructionTopicInfoBase {...props} />
    </Provider>
  );
}

describe("ConstructionTopicInfo", () => {
  test("should display link to data", () => {
    const { container } = render(<ConstructionTopicInfo />);
    const link = container.querySelector("a.wkp-link");
    expect(link.href).toBe(
      "https://data.sbb.ch/explore/dataset/construction-projects/information/",
    );
  });
});
