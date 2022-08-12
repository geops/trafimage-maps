import { legends } from './GeltungsbereicheLegend';

describe('GeltungsbereicheLegend', () => {
  test('exports legends that have the good mots order', () => {
    expect(Object.values(legends).map(({ mots }) => mots && mots[0])).toEqual([
      'rail',
      'bus',
      'gondola',
      'ferry',
      null,
    ]);
  });
});
