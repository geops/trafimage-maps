// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// The name of the cookie holding whether the user has accepted
// the cookie policy
const COOKIE_NAME = 'OptanonAlertBoxClosed';
// The value meaning that user has accepted the cookie policy
const COOKIE_VALUE = '2019-12-12T06:46:23.046Z';

// Prevent the consent banner to be displayed.
Cypress.Commands.add('consent', () => {
  Cypress.on('window:before:load', (window) => {
    // eslint-disable-next-line no-param-reassign
    window.document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}`;
  });
});
