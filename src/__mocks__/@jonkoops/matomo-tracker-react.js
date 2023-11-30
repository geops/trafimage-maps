const {
  MatomoProvider: MP,
  MatomoContext: MC,
  useMatomo: uM,
  createInstance: cI,
} = require("@jonkoops/matomo-tracker-react");

const createInstanceTmp = jest.fn((params) => {
  const inst = cI(params);
  inst.pushInstruction = jest.fn();

  // Store the lastinstance for testing
  createInstanceTmp.lastInstance = inst;
  return inst;
});

export const createInstance = createInstanceTmp;
export const useMatomo = uM;
export const MatomoContext = MC;
export const MatomoProvider = MP;
