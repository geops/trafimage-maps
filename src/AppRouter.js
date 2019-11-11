import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import qs from 'query-string';
import TrafimageMaps from './components/TrafimageMaps';
import INSTANCES_CONF from './config/instances';

const { topics } = INSTANCES_CONF;
const redirectUrl = topics[0].key + window.location.search;

const AppRouter = () => (
  <Router>
    <Route exact path="/" render={() => <Redirect to={redirectUrl} />} />
    <Route
      exact
      path="/:topic"
      component={({ history, match }) => {
        const activeTopic = topics.find(t => t.key === match.params.topic);

        if (!activeTopic) {
          return <Redirect to={redirectUrl} />;
        }

        activeTopic.active = true;
        const { disabled } = qs.parse(history.location.search);
        // Disabled elements from permalink
        if (disabled) {
          disabled.split(',').forEach(element => {
            // Backward compatibility
            if (element === 'spyLayer') {
              activeTopic.elements.baseLayerToggler = false;
            }
            // Backward compatibility
            if (element === 'header') {
              activeTopic.elements.search = false;
            }
            activeTopic.elements[element] = false;
          });
        }

        return (
          <TrafimageMaps
            history={history}
            topics={topics}
            apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
          />
        );
      }}
    />
  </Router>
);

export default React.memo(AppRouter);
