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
  setMapsetUrl,
  setDrawUrl,
  setDrawOldUrl,
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
   * URL endpoint for mapset.
   * @private
   */
  mapsetUrl: PropTypes.string,

  /**
   * URL endpoint for draw api endpoint.
   * @private
   */
  drawUrl: PropTypes.string,

  /**
   * URL endpoint for old draw api endpoint.
   * @private
   */
  drawOldUrl: PropTypes.string,

  /**
   * URL to request permission.
   * @private
   */
  permissionUrl: PropTypes.string,

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
  mapsetUrl: process.env.REACT_APP_MAPSET_URL,
  drawUrl: process.env.REACT_APP_DRAW_URL,
  drawOldUrl: process.env.REACT_APP_DRAW_OLD_URL,
  permissionUrl: null,
  topics: null,
  language: 'de',
  enableTracking: false,
  activeTopicKey: null,
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
      mapsetUrl,
      drawUrl,
      drawOldUrl,
      maxExtent,
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

    if (mapsetUrl) {
      this.store.dispatch(setMapsetUrl(mapsetUrl));
    }

    if (drawUrl) {
      this.store.dispatch(setDrawUrl(drawUrl));
    }

    if (drawOldUrl) {
      this.store.dispatch(setDrawOldUrl(drawOldUrl));
    }

    if (maxExtent) {
      this.store.dispatch(setMaxExtent(maxExtent));
    }

    if (language) {
      this.store.dispatch(setLanguage(language));
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
      mapsetUrl,
      drawUrl,
      drawOldUrl,
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

    if (mapsetUrl !== prevProps.mapsetUrl) {
      this.store.dispatch(setMapsetUrl(mapsetUrl));
    }
    if (drawUrl !== prevProps.drawUrl) {
      this.store.dispatch(setDrawUrl(drawUrl));
    }

    if (drawOldUrl !== prevProps.drawOldUrl) {
      this.store.dispatch(setDrawOldUrl(drawUrl));
    }

    if (maxExtent !== prevProps.maxExtent) {
      this.store.dispatch(setMaxExtent(maxExtent));
    }

    if (this.matomo && !prevProps.enableTracking && enableTracking) {
      this.matomo.trackPageView();
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
      permissionUrl,
      activeTopicKey,
      mapsetUrl,
      drawUrl,
      drawOldUrl,
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
              permissionUrl={permissionUrl}
              vectorTilesKey={vectorTilesKey}
              vectorTilesUrl={vectorTilesUrl}
              staticFilesUrl={staticFilesUrl}
              mapsetUrl={mapsetUrl}
              drawUrl={drawUrl}
              drawOldUrl={drawOldUrl}
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
