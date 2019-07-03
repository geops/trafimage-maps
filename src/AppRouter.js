import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import TrafimageMaps from './components/TrafimageMaps';
import APP_CONFIG from './appConfig/topics';

const topicNames = Object.keys(APP_CONFIG);

const AppRouter = () => (
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
          return <TrafimageMaps history={history} topic={match.params.topic} />;
        }

        return <Redirect to={`${topicNames[0]}`} />;
      }}
    />
  </Router>
);

export default AppRouter;
