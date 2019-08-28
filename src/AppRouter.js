import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import TrafimageMaps from './components/TrafimageMaps';
import TOPIC_CONF from './config/topics';
import CONTAINER_TOPIC_CONF from './config/containerTopics';
import POPUP_CONF from './config/popups';
import { TrackerMenu } from './config/menu';

const topics =
  process.env.REACT_APP_ENV === 'container' ? CONTAINER_TOPIC_CONF : TOPIC_CONF;

const topicKeys = topics.map(t => t.key);

const AppRouter = () => (
  <Router>
    <Route exact path="/" render={() => <Redirect to={`${topicKeys[0]}`} />} />
    <Route
      exact
      path="/:topic"
      render={({ history, match }) => {
        if (topicKeys.includes(match.params.topic)) {
          return (
            <TrafimageMaps
              history={history}
              activeTopicKeyopic={match.params.topic}
              topics={topics}
              apiKey="5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93"
              elements={{
                header: true,
                footer: true,
                menu: true,
                permalink: true,
                mapControls: true,
                popup: true,
              }}
              initialState={{ ...match.params }}
              popupComponents={POPUP_CONF}
              menuComponents={[TrackerMenu]}
            />
          );
        }

        return <Redirect to={`${topicKeys[0]}`} />;
      }}
    />
  </Router>
);

export default AppRouter;
