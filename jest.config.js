const jest = {
  testEnvironment: 'jsdom',
  resetMocks: false,
  coverageReporters: ['text', 'html'],
  snapshotSerializers: ['jest-serializer-html'],
};

module.exports = jest;
