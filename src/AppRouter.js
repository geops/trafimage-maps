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
        const topic = topics.find(t => t.key === match.params.topic);

        if (!topic) {
          return <Redirect to={redirectUrl} />;
        }

        const { disabled } = qs.parse(history.location.search);
        const { elements } = topic;

        // Disabled elements from permalink
        if (disabled) {
          disabled.split(',').forEach(element => {
            // Backward compatibility
            if (element === 'spyLayer') {
              elements.baseLayerToggler = false;
            }
            // Backward compatibility
            if (element === 'header') {
              elements.search = false;
            }
            elements[element] = false;
          });
        }

        return (
          <TrafimageMaps
            history={history}
            activeTopicKey={topic.key}
            topics={topics}
            apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
            elements={elements}
            initialState={{ ...match.params }}
            cartaroUrl={process.env.REACT_APP_CARTARO_URL}
            geoServerUrl={process.env.REACT_APP_GEOSERVER_URL}
            vectorTilesKey={process.env.REACT_APP_VECTOR_TILES_KEY}
            vectorTilesUrl={process.env.REACT_APP_VECTOR_TILES_URL}
          />
        );
      }}
    />
  </Router>
);

export default React.memo(AppRouter);
