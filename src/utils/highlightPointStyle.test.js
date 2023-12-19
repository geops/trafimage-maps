import highlightPointStyle from "./highlightPointStyle";

let context = null;

describe("higlightPointStyle", () => {
  beforeEach(() => {
    context = {
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      beginPath: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn(),
    };
  });

  test("draw a gradient if the geometry is a point", () => {
    highlightPointStyle.getRenderer()([0, 0], { context });
    expect(context.createRadialGradient).toHaveBeenCalled();
  });

  test("does not crash if the geometry is not a point", () => {
    highlightPointStyle.getRenderer()([[0, 0], 0], { context });
    highlightPointStyle.getRenderer()([0, 0, 0], { context });
    expect(context.createRadialGradient).not.toHaveBeenCalled();
  });
});
