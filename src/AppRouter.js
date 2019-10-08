import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Menu from './components/Menu';
import FeatureMenu from './components/FeatureMenu';
import ShareMenu from './menus/ShareMenu';
import TrackerMenu from './menus/TrackerMenu';
import TrafimageMaps from './components/TrafimageMaps';
import INSTANCES_CONF from './config/instances';
import POPUP_CONF from './config/popups';

const { topics } = INSTANCES_CONF;

const topicKeys = topics.map(t => t.key);

const AppRouter = () => (
  <Router>
    <Route exact path="/" render={() => <Redirect to={`${topicKeys[0]}`} />} />
    <Route
      exact
      path="/:topic"
      render={({ history, match }) => {
        if (topicKeys.includes(match.params.topic)) {
          const activeTopic = topics.find(t => t.key === match.params.topic);
          const { elements } = activeTopic;

          return (
            <TrafimageMaps
              history={history}
              activeTopicKey={match.params.topic}
              topics={topics}
              apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
              elements={elements}
              initialState={{ ...match.params }}
              popupComponents={POPUP_CONF}
            >
              <Menu subMenus=<ShareMenu />>
                <>
                  <FeatureMenu popupComponents={POPUP_CONF} />
                  <TrackerMenu />
                </>
              </Menu>
            </TrafimageMaps>
          );
        }

        return <Redirect to={`${topicKeys[0]}`} />;
      }}
    />
  </Router>
);

export default AppRouter;
