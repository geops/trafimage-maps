/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="cypress" />
/// <reference types="../../../.." />
// @ts-check
const resemble = require("resemblejs");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === "chromium") {
      // Force software WebGL in environments without working GPU acceleration.
      launchOptions.args.push("--use-gl=swiftshader");
      launchOptions.args.push("--use-angle=swiftshader");
      launchOptions.args.push("--enable-webgl");
      launchOptions.args.push("--ignore-gpu-blocklist");
      launchOptions.args.push("--disable-gpu");
    }

    return launchOptions;
  });
  on("task", {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message);
      return Promise.resolve(null);
    },
    comparePng({ current, fixture }) {
      const diff = resemble(fixture).compareTo(current);
      // eslint-disable-next-line no-promise-executor-return
      return new Promise((resolve) => diff.onComplete(resolve));
    },
  });
};
