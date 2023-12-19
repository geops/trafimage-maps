import { Layer } from "mobility-toolbox-js/ol";
import LayerService from "./LayerService";

describe("LayerService", () => {
  let layerService;

  beforeEach(() => {
    const layers = [
      new Layer({
        name: "root",
      }),
      new Layer({
        name: "1",
        children: [
          new Layer({
            name: "1-1",
            group: "radio",
          }),
          new Layer({
            name: "1-2",
            group: "radio",
            visible: false,
            children: [
              new Layer({
                name: "1-2-1",
                visible: false,
              }),
              new Layer({
                name: "1-2-2",
                visible: false,
              }),
              new Layer({
                name: "2",
                visible: false,
              }),
            ],
          }),
        ],
      }),
    ];
    layerService = new LayerService(layers);
  });

  test("should instantiate LayerService class correctly.", () => {
    expect(layerService.getLayersAsFlatArray().length).toBe(7);
  });

  test("should return the correct number of layers.", () => {
    expect(layerService.getLayers().length).toBe(2);
  });

  test("should return layers by name.", () => {
    expect(layerService.getLayer("root")).toBeDefined();
    expect(layerService.getLayer("1-2-2")).toBeDefined();
    expect(layerService.getLayer("1-2")).toBeDefined();
    expect(layerService.getLayer("42")).toBeUndefined();
  });

  test("should return the parent layer.", () => {
    const child = layerService.getLayer("1-2");
    expect(layerService.getParent(child).name).toBe("1");
  });

  test("should set children from constructor", () => {
    const layer = new Layer({
      name: "foo",
      children: [
        new Layer({
          name: "bar",
        }),
      ],
    });
    expect(layer.children.length).toBe(1);
  });
});
