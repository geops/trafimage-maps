import React from "react";
import { render, waitFor } from "@testing-library/react";
import PermalinkInput from ".";

describe("PermalinkInput", () => {
  test("should match snapshot.", async () => {
    const component = render(<PermalinkInput />);

    // Remove act warning in logs
    await waitFor(() => {
      return false;
    });

    expect(component.container.innerHTML).toMatchSnapshot();
  });
});
