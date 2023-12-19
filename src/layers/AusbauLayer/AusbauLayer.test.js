import AusbauLayer from ".";

describe("AusbauFilters", () => {
  let layer;
  let spy;
  const dfltFilter = ["==", "", ["get", "angebotsschritt"]];
  let style;

  beforeEach(() => {
    style = {
      id: "ch.sbb.bauprojekte",
      layers: [
        {
          id: "style_ausbau_without_filter",
        },
        {
          id: "style_ausbau_with_filter",
          filter: ["all", ["==", "type", "ausbau"]],
        },
        {
          id: "fooaotherbar",
        },
      ],
    };
    spy = jest.fn((id, filter) => {
      const styleLayer = style.layers.find((s) => s.id === id);
      styleLayer.filter = filter;
    });
    layer = new AusbauLayer();

    layer.mapboxLayer = {
      mbMap: {
        getStyle: () => {
          return style;
        },
        getFilter: (id) => {
          return style.layers.find((s) => s.id === id).filter;
        },
        setFilter: spy,
      },
    };
  });

  test("has good default properties.", () => {
    expect(layer.initialFiltersById).toEqual({});
    expect(layer.showFilterParam).toBe();
    expect(layer.filter).toEqual(layer.filters[0]);
    expect(layer.filters.length).toEqual(3);
  });

  describe("#addDynamicFilters()", () => {
    test("uses the default filter if showFilterParam == false", () => {
      expect(style.layers[0].filter).toBe();
      layer.addDynamicFilters();
      expect(style.layers[0].filter).toEqual(["all", dfltFilter]);
    });

    test("apply default filter if showFilterParam == true", () => {
      layer.showFilterParam = "true";
      expect(style.layers[0].filter).toBe();

      layer.addDynamicFilters();
      expect(style.layers[0].filter).toEqual(["all", dfltFilter]);
      expect(style.layers[1].filter).toEqual([
        "all",
        ["==", "type", "ausbau"],
        dfltFilter,
      ]);
      expect(style.layers[2].filter).toBe();
    });
  });

  describe("#applyNewFilter()", () => {
    test("apply new filter", () => {
      layer.applyNewFilter("bar");
      expect(style.layers[0].filter).toEqual([
        "all",
        ["==", "bar", ["get", "angebotsschritt"]],
      ]);
      expect(style.layers[1].filter).toEqual([
        "all",
        ["==", "type", "ausbau"],
        ["==", "bar", ["get", "angebotsschritt"]],
      ]);
      expect(style.layers[2].filter).toBe();

      // foo must replace bar.
      layer.applyNewFilter("foo");
      expect(style.layers[0].filter).toEqual([
        "all",
        ["==", "foo", ["get", "angebotsschritt"]],
      ]);
      expect(style.layers[1].filter).toEqual([
        "all",
        ["==", "type", "ausbau"],
        ["==", "foo", ["get", "angebotsschritt"]],
      ]);
      expect(style.layers[2].filter).toBe();

      // apply inital filters.
      layer.applyNewFilter("");
      expect(style.layers[0].filter).toEqual([
        "all",
        ["==", "", ["get", "angebotsschritt"]],
      ]);
      expect(style.layers[1].filter).toEqual([
        "all",
        ["==", "type", "ausbau"],
        dfltFilter,
      ]);
      expect(style.layers[2].filter).toBe();
    });
  });
});
