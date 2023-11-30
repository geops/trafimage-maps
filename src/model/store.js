import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import createDebounce from "redux-debounced";
import map from "./map/reducers";
import app from "./app/reducers";

/* eslint-disable */
const getStore = () => {
  const store = createStore(
    combineReducers({
      app,
      map,
    }),
    compose(applyMiddleware(createDebounce(), thunk)),
  );

  return store;
};

export default getStore;
