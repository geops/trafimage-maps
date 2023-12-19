/* eslint-disable import/no-extraneous-dependencies */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 20000,
  defaultCommandTimeout: 20000,
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 3,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    numTestsKeptInMemory: 0,
    chromeWebSecurity: false,
    video: false,

    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require, import/extensions
      return require("./cypress/plugins/index.js")(on, config);
    },
  },
});
