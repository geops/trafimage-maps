// import polyfills if application is not loaded via index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import '../../i18n';

import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Layer } from 'mobility-toolbox-js/ol';
import TopicLoader from '../TopicLoader';
import { getStore } from '../../model/store';
import { setZoom, setCenter, setMaxExtent } from '../../model/map/actions';
import {
  setLanguage,
  setCartaroOldUrl,
  setPermissionsInfos,
} from '../../model/app/actions';
import theme from '../../themes/default';

const propTypes = {
  /**
   * History object from react-router
   * @private
   */
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),

  /**
   * Array of topics from ./src/config/topics
   * @private
   */
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    }),
  ),

  /**
   * Language of the application.
   * @private
   */
  language: PropTypes.string,

  /**
   * Initial map center described by an array of coordinates
   * containing longitude and latitude.
   * @private
   */
  center: PropTypes.arrayOf(PropTypes.number),

  /**
   * Zoom level.
   * @private
   */
  zoom: PropTypes.number,

  /**
   * Limit the map extent (e.g. maxExtent="502649.8980,5655117.1007,1352629.6525,6141868.0968"). Default extent has no limit.
   * @private
   */
  maxExtent: PropTypes.arrayOf(PropTypes.number),

  /**
   * API key for using geOps services.
   * @private
   */
  apiKey: PropTypes.string,

  /**
   * API key name for using geOps services.
   * @private
   */
  apiKeyName: PropTypes.string,

  /**
   * URL endpoint for Cartaro.
   * @private
   */
  cartaroUrl: PropTypes.string,

  /**
   * URL endpoint for the previous Cartaro.
   * @private
   */
  cartaroOldUrl: PropTypes.string,

  /**
   * React app base URL
   * @private
   */
  appBaseUrl: PropTypes.string,

  /**
   * API key for vector tiles hosted by geOps.
   * @private
   */
  vectorTilesKey: PropTypes.string,

  /**
   * URL endpoint for vector tiles hosted by geOps.
   * @private
   */
  vectorTilesUrl: PropTypes.string,

  /**
   * URL endpoint for static files.
   * @private
   */
  staticFilesUrl: PropTypes.string,

  /**
   * Enable analytics tracking.
   * @private
   */
  enableTracking: PropTypes.bool,

  /**
   * Key of the active topic.
   * @private
   */
  activeTopicKey: PropTypes.string,

  /**
   * Informations on logged in user and its permissions.
   * @private
   */
  permissionsInfos: PropTypes.shape({
    user: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};

const defaultProps = {
  history: null,
  center: [925472, 5920000],
  zoom: undefined,
  maxExtent: undefined,
  apiKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  apiKeyName: 'key',
  cartaroUrl: process.env.REACT_APP_CARTARO_URL,
  cartaroOldUrl: process.env.REACT_APP_CARTARO_OLD_URL,
  appBaseUrl: process.env.REACT_APP_BASE_URL,
  vectorTilesKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process.env.REACT_APP_VECTOR_TILES_URL,
  staticFilesUrl: process.env.REACT_APP_STATIC_FILES_URL,
  topics: null,
  language: 'de',
  enableTracking: false,
  activeTopicKey: null,
  permissionsInfos: null,
};

class TrafimageMaps extends React.PureComponent {
  constructor(props) {
    super(props);

    /**
     * If the application runs standalone, we want to use a consistent store.
     * However when running in Stylegudist, every application needs it own store
     * @private
     */
    this.store = getStore();
  }

  componentDidMount() {
    const {
      zoom,
      center,
      language,
      enableTracking,
      cartaroOldUrl,
      maxExtent,
      permissionsInfos,
    } = this.props;

    if (zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center) {
      this.store.dispatch(setCenter(center));
    }

    if (cartaroOldUrl) {
      this.store.dispatch(setCartaroOldUrl(cartaroOldUrl));
    }

    if (maxExtent) {
      this.store.dispatch(setMaxExtent(maxExtent));
    }

    if (language) {
      this.store.dispatch(setLanguage(language));
    }

    if (permissionsInfos) {
      this.store.dispatch(setPermissionsInfos(permissionsInfos));
    }

    const { REACT_APP_MATOMO_URL_BASE, REACT_APP_MATOMO_SITE_ID } = process.env;
    if (
      enableTracking &&
      REACT_APP_MATOMO_URL_BASE &&
      REACT_APP_MATOMO_SITE_ID
    ) {
      this.matomo = createInstance({
        urlBase: REACT_APP_MATOMO_URL_BASE,
        siteId: REACT_APP_MATOMO_SITE_ID,
        trackerUrl: `${REACT_APP_MATOMO_URL_BASE}piwik.php`,
      });
      this.matomo.trackPageView();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      zoom,
      center,
      cartaroOldUrl,
      enableTracking,
      maxExtent,
      permissionsInfos,
    } = this.props;

    if (zoom !== prevProps.zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center !== prevProps.center) {
      this.store.dispatch(setCenter(center));
    }

    if (cartaroOldUrl !== prevProps.cartaroOldUrl) {
      this.store.dispatch(setCartaroOldUrl(cartaroOldUrl));
    }

    if (maxExtent !== prevProps.maxExtent) {
      this.store.dispatch(setMaxExtent(maxExtent));
    }

    if (this.matomo && !prevProps.enableTracking && enableTracking) {
      this.matomo.trackPageView();
    }

    if (permissionsInfos !== prevProps.permissionsInfos) {
      this.store.dispatch(setPermissionsInfos(permissionsInfos));
    }
  }

  render() {
    const {
      history,
      apiKey,
      apiKeyName,
      topics,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
      staticFilesUrl,
      activeTopicKey,
    } = this.props;

    return (
      <MatomoProvider value={this.matomo}>
        <ThemeProvider theme={theme}>
          <Provider store={this.store}>
            <TopicLoader
              history={history}
              apiKey={apiKey}
              apiKeyName={apiKeyName}
              topics={topics}
              activeTopicKey={activeTopicKey}
              cartaroUrl={cartaroUrl}
              appBaseUrl={appBaseUrl}
              vectorTilesKey={vectorTilesKey}
              vectorTilesUrl={vectorTilesUrl}
              staticFilesUrl={staticFilesUrl}
            />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>
    );
  }
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default TrafimageMaps;
