import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createDebounce from 'redux-debounced';
import map from './map/reducers';
import app from './app/reducers';

// Allow to use Redux dev tools in FF and Chrome
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    app,
    map,
  }),
  composeEnhancers(applyMiddleware(createDebounce(), thunk)),
);

export default store;
