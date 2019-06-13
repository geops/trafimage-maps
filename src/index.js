import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
// import './i18n';
import AppRouter from './AppRouter';
import CONF from './config';
import registerServiceWorker from './serviceWorker';

if (CONF.pwaActive) {
  registerServiceWorker();
}

ReactDOM.render(<AppRouter />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
