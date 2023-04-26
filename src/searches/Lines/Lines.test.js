import Lines from './Lines';

const linesSearch = new Lines();
linesSearch.searchUrl = 'trafimage.ch';
let fetchMock;
describe('Lines', () => {
  beforeEach(() => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({ json: () => Promise.resolve([]) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should insert the km parameter correctly in a km search request', () => {
    test('with 500 +50', async () => {
      await linesSearch.search('500 +50');
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /trafimage\.ch\/search\/lines\?line=500&km=50/,
      );
      expect(fetchMock.mock.calls[0][1]).toEqual({ signal: new AbortSignal() });
    });
    test('with 500 50', async () => {
      await linesSearch.search('500 50');
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /trafimage\.ch\/search\/lines\?line=500&km=50/,
      );
      expect(fetchMock.mock.calls[0][1]).toEqual({ signal: new AbortSignal() });
    });
    test('with 500 +  50', async () => {
      await linesSearch.search('500 +  50');
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /trafimage\.ch\/search\/lines\?line=500&km=50/,
      );
      expect(fetchMock.mock.calls[0][1]).toEqual({ signal: new AbortSignal() });
    });
  });

  describe('should not insert the km parameter in a km search request', () => {
    test('with no subsequent whitespace after line number (500+50)', async () => {
      await linesSearch.search('500+50');
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /trafimage\.ch\/search\/lines\?line=500%2B50/,
      );
      expect(fetchMock.mock.calls[0][1]).toEqual({ signal: new AbortSignal() });
    });
  });

  describe('should insert the km and km_end parameters correctly in a line segment search request', () => {
    test('with 500 10-50', async () => {
      await linesSearch.search('500 10-50');
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /trafimage\.ch\/search\/lines\?line=500&km=10&km_end=50/,
      );
      expect(fetchMock.mock.calls[0][1]).toEqual({ signal: new AbortSignal() });
    });
  });

  describe('should not insert the km and km_end parameters correctly in a line segment search request', () => {
    test('with a wrong pattern (500 50 -80)', async () => {
      await linesSearch.search('500 50 -80');
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /trafimage\.ch\/search\/lines\?line=500%2050%20-80/,
      );
      expect(fetchMock.mock.calls[0][1]).toEqual({ signal: new AbortSignal() });
    });
  });
});
