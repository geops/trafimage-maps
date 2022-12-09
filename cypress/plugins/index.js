/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="cypress" />
/// <reference types="../../../.." />
// @ts-check
const findWebpack = require('find-webpack');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const resemble = require('resemblejs');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  // find the Webpack config used by react-scripts
  const webpackOptions = findWebpack.getWebpackOptions();

  if (!webpackOptions) {
    throw new Error('Could not find Webpack in this project 😢');
  }

  // if we just pass webpackOptions to the preprocessor
  // it won't work - because react-scripts by default
  // includes plugins that split specs into chunks, etc.
  // https://github.com/cypress-io/cypress-webpack-preprocessor/issues/31

  // solution 1
  // blunt: delete entire optimization object
  // delete webpackOptions.optimization

  // solution 2
  // use a module that carefully removes only plugins
  // that we found to be breaking the bundling
  // https://github.com/bahmutov/find-webpack
  const cleanOptions = {
    reactScripts: true,
  };

  findWebpack.cleanForCypress(cleanOptions, webpackOptions);

  const options = {
    webpackOptions,
    watchOptions: {},
  };

  on('file:preprocessor', webpackPreprocessor(options));

  on('task', {
    log(message) {
      console.log(message);
      return new Promise((resolve) => resolve(null));
    },
    comparePng({ current, fixture }) {
      const diff = resemble(fixture).compareTo(current);
      return new Promise((resolve) => diff.onComplete(resolve));
    },
  });
};
