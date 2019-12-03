// import polyfills if application is not loaded via index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import '../../i18n';

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Layer from 'react-spatial/layers/Layer';
import TopicLoader from '../TopicLoader';
import { getStore } from '../../model/store';
import { setZoom, setCenter } from '../../model/map/actions';
import { setTopics, setLanguage } from '../../model/app/actions';

const propTypes = {
  /**
   * History object from react-router
   */
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),

  /**
   * Array of topics from ./src/config/topics
   */
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    }),
  ),

  /**
   * Language of the application.
   */
  language: PropTypes.string,

  /**
   * Initial map center described by an array of coordinates
   * containing longitude and latitude.
   */
  center: PropTypes.arrayOf(PropTypes.number),

  /**
   * Zoom level.
   */
  zoom: PropTypes.number,

  /**
   * API key for using geOps services.
   */
  apiKey: PropTypes.string,

  /**
   * URL endpoint for Cartaro.
   */
  cartaroUrl: PropTypes.string,

  /**
   * React app base URL
   */
  appBaseUrl: PropTypes.string,

  /**
   * API key for vector tiles hosted by geOps.
   */
  vectorTilesKey: PropTypes.string,

  /**
   * URL endpoint for vector tiles hosted by geOps.
   */
  vectorTilesUrl: PropTypes.string,
};

const defaultProps = {
  history: null,
  center: [925472, 5920000],
  zoom: undefined,
  apiKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  cartaroUrl: process.env.REACT_APP_CARTARO_URL,
  appBaseUrl: process.env.REACT_APP_BASE_URL,
  vectorTilesKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process.env.REACT_APP_VECTOR_TILES_URL,
  topics: null,
  language: 'de',
};

class TrafimageMaps extends React.PureComponent {
  constructor(props) {
    super(props);

    /**
     * If the application runs standalone, we want to use a consistent store.
     * However when running in Stylegudist, every application needs it own store
     */
    this.store = getStore();
  }

  componentDidMount() {
    const { zoom, center, topics, language } = this.props;

    if (zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center) {
      this.store.dispatch(setCenter(center));
    }

    if (topics) {
      this.store.dispatch(setTopics(topics));
    }

    if (language) {
      this.store.dispatch(setLanguage(language));
    }
  }

  componentDidUpdate(prevProps) {
    const { zoom, center, topics } = this.props;

    if (zoom !== prevProps.zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center !== prevProps.center) {
      this.store.dispatch(setCenter(center));
    }

    if (topics !== prevProps.topics) {
      this.store.dispatch(setTopics(topics));
    }
  }

  render() {
    const {
      history,
      apiKey,
      topics,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
    } = this.props;

    return (
      <Provider store={this.store}>
        <TopicLoader
          history={history}
          apiKey={apiKey}
          topics={topics}
          cartaroUrl={cartaroUrl}
          appBaseUrl={appBaseUrl}
          vectorTilesKey={vectorTilesKey}
          vectorTilesUrl={vectorTilesUrl}
        />
      </Provider>
    );
  }
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default TrafimageMaps;
