import isoToIntlVehicleCode from './isoToIntlVehicleCode';

describe('isoToIntlVehicleCode', () => {
  test('returns the international vehicle registration code from an ISO country code', () => {
    expect(isoToIntlVehicleCode('DE')).toBe('D');
    expect(isoToIntlVehicleCode('FR')).toBe('F');
    expect(isoToIntlVehicleCode('IT')).toBe('I');
    expect(isoToIntlVehicleCode('CH')).toBe('CH');
    expect(isoToIntlVehicleCode('ZW')).toBe('ZW');
  });
  test('returns the ISO country code if the vehicle code is not found', () => {
    expect(isoToIntlVehicleCode('balbnlba')).toBe('balbnlba');
  });
});
