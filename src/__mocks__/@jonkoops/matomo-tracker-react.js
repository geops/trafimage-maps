const {
  MatomoProvider: MP,
  MatomoContext: MC,
  useMatomo: uM,
  createInstance: cI,
} = require('@jonkoops/matomo-tracker-react');

export const createInstance = jest.fn((params) => {
  const inst = cI(params);
  inst.pushInstruction = jest.fn();
  return inst;
});
export const useMatomo = uM;
export const MatomoContext = MC;
export const MatomoProvider = MP;
