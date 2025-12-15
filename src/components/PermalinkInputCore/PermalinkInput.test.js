import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import PermalinkInput from "./PermalinkInput";

describe("PermalinkInput", () => {
  let getShortenedUrl = null;

  beforeEach(() => {
    getShortenedUrl = jest.fn((val) => {
      return Promise.resolve(`${val}shortened`);
    });
  });

  test("matches snapshot", async () => {
    const component = render(<PermalinkInput value="http://url.test" />);

    // Remove act warning in logs
    await waitFor(() => {
      return (
        component.container.querySelector("input").value ===
        "http://url.testshortened"
      );
    });
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  describe("when interacts,", () => {
    test("getShortenedUrl is called to set value.", async () => {
      const wrapper = render(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );

      // Remove act warning in logs
      await waitFor(() => {
        return (
          wrapper.container.querySelector("input").value ===
          "http://url.testshortened"
        );
      });

      expect(getShortenedUrl).toHaveBeenCalledTimes(1);
      expect(getShortenedUrl).toHaveBeenCalledWith("http://url.test");
    });

    test("select value on input click.", async () => {
      document.execCommand = jest.fn();
      const wrapper = render(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );

      // Remove act warning in logs
      await waitFor(() => {
        return (
          wrapper.container.querySelector("input").value ===
          "http://url.testshortened"
        );
      });

      const spy = jest.spyOn(document, "execCommand");

      expect(spy).toHaveBeenCalledTimes(0);
      fireEvent.click(wrapper.container.querySelector("input"));
      expect(spy).toHaveBeenCalledWith("selectall");
    });

    test("click button copy the value.", async () => {
      document.execCommand = jest.fn();
      const wrapper = render(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );

      // Remove act warning in logs
      await waitFor(() => {
        return (
          wrapper.container.querySelector("input").value ===
          "http://url.testshortened"
        );
      });

      const spy = jest.spyOn(document, "execCommand");

      expect(spy).toHaveBeenCalledTimes(0);
      fireEvent.click(wrapper.container.querySelector(".tm-permalink-bt"));

      expect(spy).toHaveBeenCalledWith("copy");
    });
  });
});
