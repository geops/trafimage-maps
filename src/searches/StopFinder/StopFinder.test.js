import StopFinder from './StopFinder';

describe('StopFinder', () => {
  describe('#render()', () => {
    test('renders only the name', () => {
      const stopFinder = new StopFinder();
      const rendered = stopFinder.render({ properties: { name: 'name' } });
      expect(rendered.props.children[0].props.children).toEqual('name');
      expect(rendered.props.children[1]).toEqual(null);
    });

    test('renders the name and the municipality', () => {
      const stopFinder = new StopFinder();
      const { children } = stopFinder.render({
        properties: { name: 'name', municipality_name: 'foo' },
      }).props;
      expect(children[0].props.children).toEqual('name');
      expect(children[1].props.children).toEqual('foo');
    });

    test('renders the name and the country code', () => {
      const stopFinder = new StopFinder();
      const { children } = stopFinder.render({
        properties: { name: 'name', country_code: 'bar' },
      }).props;
      expect(children[0].props.children).toEqual('name');
      expect(children[1].props.children).toEqual('bar');
    });

    test('renders the name and the municipality and the country code', () => {
      const stopFinder = new StopFinder();
      const { children } = stopFinder.render({
        properties: {
          name: 'name',
          municipality_name: 'foo',
          country_code: 'bar',
        },
      }).props;
      expect(children[0].props.children).toEqual('name');
      expect(children[1].props.children).toEqual('foo (bar)');
    });

    test('renders the international vehicle registration code instead of the ISO country code', () => {
      const stopFinder = new StopFinder();
      const { children } = stopFinder.render({
        properties: {
          name: 'name',
          country_code: 'DE',
        },
      }).props;
      expect(children[1].props.children).toBe('D');
    });
  });
});
