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
import { setLanguage, setStaticFilesUrl } from '../../model/app/actions';

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
  apiKey: PropTypes.string.isRequired,

  /**
   * URL endpoint for Cartaro.
   */
  cartaroUrl: PropTypes.string.isRequired,

  /**
   * React app base URL
   */
  appBaseUrl: PropTypes.string.isRequired,

  /**
   * API key for vector tiles hosted by geOps.
   */
  vectorTilesKey: PropTypes.string.isRequired,

  /**
   * URL endpoint for vector tiles hosted by geOps.
   */
  vectorTilesUrl: PropTypes.string.isRequired,

  /**
   * URL endpoint for static files hosted by geOps.
   */
  staticFilesUrl: PropTypes.string.isRequired,
};

const defaultProps = {
  history: null,
  center: [925472, 5920000],
  zoom: undefined,
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
    const { zoom, center, language, staticFilesUrl } = this.props;

    if (zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center) {
      this.store.dispatch(setCenter(center));
    }

    if (language) {
      this.store.dispatch(setLanguage(language));
    }

    if (staticFilesUrl) {
      this.store.dispatch(setStaticFilesUrl(staticFilesUrl));
    }
  }

  componentDidUpdate(prevProps) {
    const { zoom, center, staticFilesUrl } = this.props;

    if (zoom !== prevProps.zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center !== prevProps.center) {
      this.store.dispatch(setCenter(center));
    }

    if (staticFilesUrl !== prevProps.staticFilesUrl) {
      this.store.dispatch(setStaticFilesUrl(staticFilesUrl));
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
