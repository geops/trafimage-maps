import tarifverbundkarteLegend from '../../img/tarifverbund_legend.svg';

describe('ExportButton', () => {
  test('legend svg must be parseable/serializable by native DOMParser and XML Serializer', (done) => {
    try {
      const svgDoc = new DOMParser().parseFromString(
        tarifverbundkarteLegend,
        'application/xml',
      );
      svgDoc.documentElement.removeAttribute('width');
      svgDoc.documentElement.removeAttribute('height');
      new XMLSerializer().serializeToString(svgDoc);
      done();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        'tarifverbund_legend.svg is not parseable/serializable by native parser/serializer',
      );
    }
  });
});
