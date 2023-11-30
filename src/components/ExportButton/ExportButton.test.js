import XMLSerializer from "xmlserializer";
import tarifverbundkarteLegend from "../../img/tarifverbund_legend.url.svg";

describe("ExportButton", () => {
  test("legend svg must be parseable/serializable by native DOMParser and XML Serializer", (done) => {
    try {
      const svgDoc = new DOMParser().parseFromString(
        tarifverbundkarteLegend,
        "application/xml",
      );
      svgDoc.documentElement.removeAttribute("width");
      svgDoc.documentElement.removeAttribute("height");
      // The real XMLSerializer was drop by node 12, see https://github.com/facebook/jest/issues/7537
      // so we use an npm module that does the same.
      XMLSerializer.serializeToString(svgDoc);
      done();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        "tarifverbund_legend.svg is not parseable/serializable by native parser/serializer",
      );
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
});
