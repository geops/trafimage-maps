import AusbauLayer from '.';

describe('AusbauFilters', () => {
  let layer;
  let spy;
  const dfltFilter = ['==', '', ['get', 'angebotsschritt']];
  let style;

  beforeEach(() => {
    style = {
      id: 'ch.sbb.bauprojekte',
      layers: [
        {
          id: 'style_ausbau_without_filter',
        },
        {
          id: 'style_ausbau_with_filter',
          filter: ['all', ['==', 'type', 'ausbau']],
        },
        {
          id: 'fooaotherbar',
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

  test('has good default properties.', () => {
    expect(layer.initialFiltersById).toEqual({});
    expect(layer.isShowFilter).toBe(false);
    expect(layer.defaultFilter).toEqual(dfltFilter);
  });

  describe('#addDynamicFilters()', () => {
    test('does nothing if isShowFilter == false', () => {
      expect(style.layers[0].filter).toBe();
      layer.addDynamicFilters();
      expect(style.layers[0].filter).toBe();
    });

    test('apply default filter if isShowFilter == true', () => {
      layer.isShowFilter = true;
      expect(style.layers[0].filter).toBe();

      layer.addDynamicFilters();
      expect(style.layers[0].filter).toEqual(['all', dfltFilter]);
      expect(style.layers[1].filter).toEqual([
        'all',
        ['==', 'type', 'ausbau'],
        dfltFilter,
      ]);
      expect(style.layers[2].filter).toBe();
    });
  });

  describe('#applyNewFilter()', () => {
    test('apply new filter', () => {
      layer.applyNewFilter('bar');
      expect(style.layers[0].filter).toEqual(['all', 'bar']);
      expect(style.layers[1].filter).toEqual([
        'all',
        ['==', 'type', 'ausbau'],
        'bar',
      ]);
      expect(style.layers[2].filter).toBe();

      // foo must replace bar.
      layer.applyNewFilter('foo');
      expect(style.layers[0].filter).toEqual(['all', 'foo']);
      expect(style.layers[1].filter).toEqual([
        'all',
        ['==', 'type', 'ausbau'],
        'foo',
      ]);
      expect(style.layers[2].filter).toBe();

      // apply inital filters.
      layer.applyNewFilter();
      expect(style.layers[0].filter).toEqual(null);
      expect(style.layers[1].filter).toEqual(['all', ['==', 'type', 'ausbau']]);
      expect(style.layers[2].filter).toBe();
    });
  });
});
