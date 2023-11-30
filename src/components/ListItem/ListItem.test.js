import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ListItem from "./ListItem";

describe("ListItem", () => {
  const item = {
    label: "foo",
  };
  const children = <p>bar</p>;

  describe("when no properties are set", () => {
    let spy = null;

    beforeEach(() => {
      window.console.error = jest.fn().mockImplementation(() => {});
      spy = jest.spyOn(window.console, "error");
    });

    afterEach(() => {
      spy.mockRestore();
      window.console.error.mockRestore();
    });

    test("displays 1 error for required property ", () => {
      render(<ListItem />);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    test("matches snapshot", () => {
      const { container } = render(<ListItem />);
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("calls default onSelect and onKeyDown without errors.", () => {
      const { container } = render(<ListItem item={item}>{children}</ListItem>);
      fireEvent.click(container.querySelector("p"));
      fireEvent.keyDown(container.querySelector("p"));
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("when properties are set", () => {
    test("matches snapshot", () => {
      const { container } = render(
        <ListItem item={item} onSelect={() => {}}>
          {children}
        </ListItem>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("calls onSelect property on click.", () => {
      const fn = jest.fn();
      const { container } = render(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      fireEvent.click(container.querySelector("p"));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("calls onSelect property on click.", () => {
      const fn = jest.fn();
      const { container } = render(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      fireEvent.click(container.querySelector("p"));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("calls onSelect property on enter key press.", () => {
      const fn = jest.fn();
      const { container } = render(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      fireEvent.keyPress(container.querySelector("p"), {
        which: 13,
        keyCode: 13,
      });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("shouldn't calls onSelect property on key press other than enter", () => {
      const fn = jest.fn();
      const { container } = render(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      fireEvent.keyPress(container.querySelector("p"), {
        which: 14,
        keyCode: 14,
      });
      expect(fn).toHaveBeenCalledTimes(0);
    });

    test("calls onKeyDown property on key down", () => {
      const fn = jest.fn();
      const { container } = render(
        <ListItem item={item} onKeyDown={fn}>
          {children}
        </ListItem>,
      );
      fireEvent.keyDown(container.querySelector("p"));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
