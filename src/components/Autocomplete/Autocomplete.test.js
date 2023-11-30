import React from "react";
import { fireEvent, render } from "@testing-library/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from "@testing-library/user-event";
import Autocomplete from "./Autocomplete";

const defaultItems = [
  {
    label: "foo",
  },
  {
    label: "bar",
  },
  {
    label: "foo2",
  },
];

const items = [
  {
    label: "qux",
  },
  {
    label: "quux",
  },
  {
    label: "corge",
  },
];

let wrapper = null;

const mountDflt = () => {
  const { container } = render(
    <Autocomplete
      value="fooval"
      defaultItems={defaultItems}
      items={items}
      renderItem={(item) => item.label}
      getItemKey={(item) => item.label}
    />,
  );
  return container;
};

describe("Autocomplete", () => {
  describe("when no properties are set", () => {
    let spy = null;

    beforeEach(() => {
      window.console.error = jest.fn().mockImplementation(() => {});
      spy = jest.spyOn(window.console, "error");
    });

    afterEach(() => {
      spy.mockRestore();
      window.console.error.mockRestore();
      if (wrapper && wrapper.getDOMNode()) {
        document.body.removeChild(wrapper.getDOMNode());
        wrapper.unmount();
      }
      wrapper = null;
    });

    test("matches snapshot", () => {
      const { container } = render(<Autocomplete />);
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("when properties are set", () => {
    test("should match snapshot without items and defaultItems using defaultProps", () => {
      const { container } = render(<Autocomplete value="fooval" />);
      container.querySelector("input").focus();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot without items and defaultItems", () => {
      const { container } = render(
        <Autocomplete
          value="fooval"
          renderTitle={() => "my_foo_title"}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
        />,
      );
      container.querySelector("input").focus();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot without defaultItems", () => {
      const { container } = render(
        <Autocomplete
          value="fooval"
          items={items}
          renderTitle={() => "my_foo_title"}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
        />,
      );
      container.querySelector("input").focus();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot without items", () => {
      const { container } = render(
        <Autocomplete
          value="fooval"
          defaultItems={defaultItems}
          renderTitle={() => "my_foo_title"}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      container.querySelector("input").focus();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot", () => {
      const { container } = render(
        <Autocomplete
          value="fooval"
          defaultItems={defaultItems}
          items={items}
          renderTitle={() => "my_foo_title"}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot showing list", () => {
      const { container } = render(
        <Autocomplete
          value="fooval"
          defaultItems={defaultItems}
          items={items}
          renderTitle={() => "my_foo_title"}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      container.querySelector("input").focus();
      expect(container.innerHTML).toMatchSnapshot();
    });

    describe("#onDocClick()", () => {
      test("hide the list and removes the focus.", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        fireEvent.click(document);
        expect(container.innerHTML).toMatchSnapshot();
      });

      test("does nothing when click comes from ana element of Autocomplete.", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        fireEvent.click(container.querySelector("div"));
        expect(container.innerHTML).toMatchSnapshot();
      });
    });

    describe("#onFocus()", () => {
      test("updates set showList state property to true", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        expect(container.querySelectorAll(".tm-focus").length).toBe(1);
      });
    });

    describe("#onBlurInput()", () => {
      test("does nothing if no lastKeyPress parameter", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        container.querySelector("input").blur();
        expect(container.querySelectorAll(".tm-focus").length).toBe(0);
      });

      test("hide list and renove focus if lastKeyPress is not an arrow down.", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        fireEvent.keyPress(container.querySelector("input"), { which: 41 });
        expect(container.querySelectorAll(".tm-focus").length).toBe(1);
      });
    });

    describe("#onKeyPress()", () => {
      test("gives focus to the first element of the list", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        fireEvent.keyUp(container.querySelector("input"), {
          keyCode: 40,
        });
        const li = container.querySelector("li");
        expect(li).toBe(document.activeElement);
      });

      test("doesn't give focus to the first element of the list", () => {
        const container = mountDflt();
        container.querySelector("input").focus();
        fireEvent.keyUp(container.querySelector("input"), {
          keyCode: 41,
        });
        const li = container.querySelector("li");
        expect(li).not.toBe(document.activeElement);
      });
    });

    describe("#onKeyPressItem()", () => {
      test("does nothing when another key than arrows is pressed.", () => {
        const container = mountDflt();
        const li = container.querySelectorAll("li")[1];
        li.focus();
        fireEvent.keyDown(li, {
          keyCode: 41,
        });
        expect(li).toBe(document.activeElement);
      });

      test("moves focus to search input.", () => {
        const container = mountDflt();
        const li = container.querySelectorAll("li")[0];
        li.focus();
        fireEvent.keyDown(li, {
          keyCode: 38,
        });
        expect(container.querySelector("input")).toBe(document.activeElement);
      });

      test("moves focus to previous item.", () => {
        const container = mountDflt();
        const lis = container.querySelectorAll("li");
        const li = lis[1];
        li.focus();
        fireEvent.keyDown(li, {
          keyCode: 38,
        });
        expect(lis[0]).toBe(document.activeElement);
      });

      test("moves focus to next item.", () => {
        const container = mountDflt();
        const lis = container.querySelectorAll("li");
        const li = lis[1];
        li.focus();
        fireEvent.keyDown(li, {
          keyCode: 40,
        });
        expect(lis[2]).toBe(document.activeElement);
      });

      test("moves focus to default items.", () => {
        const container = mountDflt();
        const lis = container.querySelectorAll("li");
        const li = lis[2];
        li.focus();
        fireEvent.keyDown(li, {
          keyCode: 40,
        });
        expect(lis[3]).toBe(document.activeElement);
      });

      test("moves focus to the beginning of the list.", () => {
        const container = mountDflt();
        const lis = container.querySelectorAll("li");
        const li = lis[5];
        li.focus();
        fireEvent.keyDown(li, {
          keyCode: 40,
        });
        expect(lis[0]).toBe(document.activeElement);
      });
    });

    describe("#onSelect()", () => {
      test("hide list and remove focus when select an item.", () => {
        const fn = jest.fn();
        const { container } = render(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderItem={(item) => item.label}
            getItemKey={(item) => item.label}
            onSelect={fn}
          />,
        );
        container.querySelector("input").focus();
        fireEvent.click(container.querySelector("li"));
        expect(
          container.querySelector(".tm-autocomplete-results").style.display,
        ).toBe("none");
        expect(fn).toBeCalledTimes(1);
      });

      test("hide list and remove focus when select on default item.", () => {
        const fn = jest.fn();
        const { container } = render(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderItem={(item) => item.label}
            getItemKey={(item) => item.label}
            onSelect={fn}
          />,
        );
        container.querySelector("input").focus();
        fireEvent.click(container.querySelectorAll("li")[4]);
        expect(
          container.querySelector(".tm-autocomplete-results").style.display,
        ).toBe("none");
        expect(fn).toBeCalledTimes(1);
      });
    });

    describe("#onChange()", () => {
      test("gives focus to the input and display the list.", async () => {
        const user = userEvent.setup();
        const fn = jest.fn();
        const { container } = render(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderItem={(item) => item.label}
            getItemKey={(item) => item.label}
            onChange={fn}
          />,
        );
        container.querySelector("input").focus();
        await user.keyboard("foo");
        expect(fn).toBeCalledTimes(3);
      });
    });

    test("hides the list on click on search button if the list is open.", () => {
      const container = mountDflt();
      container.querySelector("input").focus();
      expect(
        container.querySelector(".tm-autocomplete-results").style.display,
      ).toBe("");
      fireEvent.click(container.querySelectorAll('[role="button"]')[1]);
      expect(
        container.querySelector(".tm-autocomplete-results").style.display,
      ).toBe("none");
    });
  });
});
