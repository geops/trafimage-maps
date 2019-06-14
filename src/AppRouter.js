import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './model/store';
import App from './App';
import APP_CONFIG from './appConfig';

const topicNames = Object.keys(APP_CONFIG);

const AppRouter = () => (
  <Provider store={store}>
    <Router>
      <Route
        exact
        path="/"
        render={() => <Redirect to={`${topicNames[0]}`} />}
      />
      <Route
        exact
        path="/:topic"
        render={({ history, match }) => {
          if (topicNames.includes(match.params.topic)) {
            return <App history={history} topic={match.params.topic} />;
          }

          return <Redirect to={`${topicNames[0]}`} />;
        }}
      />
    </Router>
  </Provider>
);

export default AppRouter;
