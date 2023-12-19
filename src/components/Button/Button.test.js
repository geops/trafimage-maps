import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Button from "./Button";

const funcs = {
  onClick: () => {},
};

test("Button should match snapshot.", () => {
  const { container } = render(
    <Button
      className="tm-zoom in"
      title="Zoom in"
      onClick={() => funcs.onClick()}
    >
      +
    </Button>,
  );
  expect(container.innerHTML).toMatchSnapshot();
});

test("Button should update.", () => {
  const spy = jest.spyOn(funcs, "onClick");
  const { container } = render(
    <Button className="tm-class" title="Zoom" onClick={() => funcs.onClick()}>
      +
    </Button>,
  );

  fireEvent.click(container.querySelector(".tm-class"));
  fireEvent.keyPress(container.querySelector(".tm-class"), {
    key: "Enter",
    code: "Enter",
    charCode: 13,
    which: 13,
  });

  expect(spy).toHaveBeenCalledTimes(2);
});
