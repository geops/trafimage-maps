import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './model/store';
import App from './App';

const AppRouter = () => (
  <Provider store={store}>
    <Router>
      <>
        <Route
          exact
          path="/"
          component={({ history, match }) => (
            <App history={history} initialState={match.params} />
          )}
        />
      </>
    </Router>
  </Provider>
);

export default AppRouter;
