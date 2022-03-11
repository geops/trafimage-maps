import {
  infrastrukturBetreiberOther,
  infrastrukturBetreiberTVS,
} from './layers';

describe('layers', () => {
  describe('infrastrukturBetreiberOther', () => {
    test("has a shortToLongName property set and only unique keys, it's important for the layer infos", () => {
      expect(infrastrukturBetreiberOther.get('shortToLongName')).toBeDefined();
      expect(infrastrukturBetreiberOther.get('defaultColor')).toBeDefined();
    });
  });
  describe('infrastrukturBetreiberTVS', () => {
    test("has a shortToLongName property set and only unique keys, it's important for the layer infos", () => {
      expect(infrastrukturBetreiberTVS.get('shortToLongName')).toBeDefined();
      expect(infrastrukturBetreiberTVS.get('colors')).toBeDefined();
      expect(infrastrukturBetreiberTVS.get('defaultColor')).toBeDefined();
    });
  });
});
