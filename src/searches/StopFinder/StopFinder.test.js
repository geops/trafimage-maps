import StopFinder from './StopFinder';

describe('StopFinder', () => {
  describe('#render()', () => {
    test('renders only the name', () => {
      const stopFinder = new StopFinder();
      expect(
        stopFinder.render({ properties: { name: 'name' } }).props.children,
      ).toEqual('name');
    });

    test('renders the name and the municipality', () => {
      const stopFinder = new StopFinder();
      expect(
        stopFinder.render({
          properties: { name: 'name', municipality_name: 'foo' },
        }).props.children,
      ).toBe('name - foo');
    });

    test('renders the name and the country code', () => {
      const stopFinder = new StopFinder();
      expect(
        stopFinder.render({
          properties: { name: 'name', country_code: 'bar' },
        }).props.children,
      ).toBe('name (bar)');
    });

    test('renders the name and the municipality and the country code', () => {
      const stopFinder = new StopFinder();
      expect(
        stopFinder.render({
          properties: {
            name: 'name',
            municipality_name: 'foo',
            country_code: 'bar',
          },
        }).props.children,
      ).toBe('name - foo (bar)');
    });

    test('renders the international vehicle registration code instead of the ISO country code', () => {
      const stopFinder = new StopFinder();
      expect(
        stopFinder.render({
          properties: {
            name: 'name',
            country_code: 'DE',
          },
        }).props.children,
      ).toBe('name (D)');
    });
  });
});
