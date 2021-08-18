import Lines from './Lines';

const linesSearch = new Lines();

const fetchMock = jest
  .spyOn(global, 'fetch')
  .mockImplementation(() =>
    Promise.resolve({ json: () => Promise.resolve([]) }),
  );

describe('Lines', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should insert the km parameter correctly in a km search request', () => {
    test('with 500 +50', async () => {
      await linesSearch.search('500 +50');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://maps.trafimage.ch/search/lines?line=500&km=50',
      );
    });
    test('with 500 50', async () => {
      await linesSearch.search('500 50');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://maps.trafimage.ch/search/lines?line=500&km=50',
      );
    });
    test('with 500 +  50', async () => {
      await linesSearch.search('500 +  50');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://maps.trafimage.ch/search/lines?line=500&km=50',
      );
    });
  });

  describe('should insert the km and km_end parameters correctly in a line segment search request', () => {
    test('with 500 10-50', async () => {
      await linesSearch.search('500 10-50');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://maps.trafimage.ch/search/lines?line=500&km=10&km_end=50',
      );
    });
  });
});
