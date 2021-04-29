import app from './reducers';

describe('reducers', () => {
  test('set menuOpen property to false by default', () => {
    const { menuOpen } = app(undefined, {});
    expect(menuOpen).toBe(false);
  });

  test('set menuOpen property to false if mapset has opened the page', () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', {
      value: 'mapset',
      configurable: true,
    });
    expect(app(undefined, {}).menuOpen).toBe(true);
    Object.defineProperty(document, 'referrer', {
      value: originalReferrer,
    });
  });
});
