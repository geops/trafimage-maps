/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="cypress" />
/// <reference types="../../../.." />
// @ts-check
const resemble = require('resemblejs');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on('task', {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message);
      return new Promise((resolve) => resolve(null));
    },
    comparePng({ current, fixture }) {
      const diff = resemble(fixture).compareTo(current);
      return new Promise((resolve) => diff.onComplete(resolve));
    },
  });
};
