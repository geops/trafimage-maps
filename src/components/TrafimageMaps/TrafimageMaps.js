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
import MatomoTracker from '../MatomoTracker';
import Head from '../Head';
import TopicLoader from '../TopicLoader';
import getStore from '../../model/store';
import { setZoom, setCenter, setMaxExtent } from '../../model/map/actions';
import {
  setLanguage,
  setCartaroUrl,
  setMapsetUrl,
  setDrawUrl,
  setShortenerUrl,
  setPermissionInfos,
  setDestinationUrl,
  setDeparturesUrl,
  setApiKey,
  setDisableCookies,
  setConsentGiven,
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
  loginUrl: PropTypes.string,

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
   * URL endpoint for shortener api.
   * @private
   */
  shortenerUrl: PropTypes.string,

  /**
   * URL endpoint for draw api endpoint.
   * @private
   */
  drawUrl: PropTypes.string,

  /**
   * URL endpoint for destination search.
   * @private
   */
  destinationUrl: PropTypes.string,

  /**
   * URL endpoint for departures search.
   * @private
   */
  departuresUrl: PropTypes.string,

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
  permissionInfos: PropTypes.shape({
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
  loginUrl: undefined,
  appBaseUrl: process.env.REACT_APP_BASE_URL,
  vectorTilesKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process.env.REACT_APP_VECTOR_TILES_URL,
  staticFilesUrl: process.env.REACT_APP_STATIC_FILES_URL,
  mapsetUrl: process.env.REACT_APP_MAPSET_URL,
  shortenerUrl: process.env.REACT_APP_SHORTENER_URL,
  drawUrl: process.env.REACT_APP_DRAW_URL,
  destinationUrl: process.env.REACT_APP_DESTINATION_URL,
  departuresUrl: process.env.REACT_APP_DEPARTURES_URL,
  topics: null,
  language: 'de',
  enableTracking: false,
  activeTopicKey: null,
  permissionInfos: null,
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
      cartaroUrl,
      mapsetUrl,
      shortenerUrl,
      drawUrl,
      maxExtent,
      permissionInfos,
      destinationUrl,
      departuresUrl,
      apiKey,
    } = this.props;

    // Function called on consent change event
    window.OptanonWrapper = () => {
      if (!window.Optanon.IsAlertBoxClosed()) {
        return;
      }

      if (!/,C0002,/.test(window.OptanonActiveGroups)) {
        // Disable Matomo cookies
        this.store.dispatch(setDisableCookies(true));
      }

      // Start the page tracking.
      this.store.dispatch(setConsentGiven(true));
    };

    if (zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center) {
      this.store.dispatch(setCenter(center));
    }

    if (cartaroUrl) {
      this.store.dispatch(setCartaroUrl(cartaroUrl));
    }

    if (mapsetUrl) {
      this.store.dispatch(setMapsetUrl(mapsetUrl));
    }

    if (shortenerUrl) {
      this.store.dispatch(setShortenerUrl(shortenerUrl));
    }

    if (drawUrl) {
      this.store.dispatch(setDrawUrl(drawUrl));
    }
    if (maxExtent) {
      this.store.dispatch(setMaxExtent(maxExtent));
    }

    if (language) {
      this.store.dispatch(setLanguage(language));
    }

    if (permissionInfos) {
      this.store.dispatch(setPermissionInfos(permissionInfos));
    }

    if (destinationUrl) {
      this.store.dispatch(setDestinationUrl(destinationUrl));
    }

    if (departuresUrl) {
      this.store.dispatch(setDeparturesUrl(departuresUrl));
    }

    if (apiKey) {
      this.store.dispatch(setApiKey(apiKey));
    }

    // Create the matomo instance
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
      this.matomo.pushInstruction('requireConsent');
    }
  }

  componentDidUpdate(prevProps) {
    const {
      zoom,
      center,
      cartaroUrl,
      maxExtent,
      mapsetUrl,
      shortenerUrl,
      drawUrl,
      permissionInfos,
      destinationUrl,
      departuresUrl,
      apiKey,
    } = this.props;

    if (zoom !== prevProps.zoom) {
      this.store.dispatch(setZoom(zoom));
    }

    if (center !== prevProps.center) {
      this.store.dispatch(setCenter(center));
    }

    if (cartaroUrl !== prevProps.cartaroUrl) {
      this.store.dispatch(setCartaroUrl(cartaroUrl));
    }

    if (mapsetUrl !== prevProps.mapsetUrl) {
      this.store.dispatch(setMapsetUrl(mapsetUrl));
    }

    if (shortenerUrl !== prevProps.shortenerUrl) {
      this.store.dispatch(setShortenerUrl(shortenerUrl));
    }

    if (drawUrl !== prevProps.drawUrl) {
      this.store.dispatch(setDrawUrl(drawUrl));
    }

    if (maxExtent !== prevProps.maxExtent) {
      this.store.dispatch(setMaxExtent(maxExtent));
    }

    if (permissionInfos !== prevProps.permissionInfos) {
      this.store.dispatch(setPermissionInfos(permissionInfos));
    }

    if (destinationUrl !== prevProps.destinationUrl) {
      this.store.dispatch(setDestinationUrl(destinationUrl));
    }

    if (departuresUrl !== prevProps.departuresUrl) {
      this.store.dispatch(setDeparturesUrl(departuresUrl));
    }

    if (apiKey !== prevProps.apiKey) {
      this.store.dispatch(setApiKey(apiKey));
    }
  }

  componentWillUnmount() {
    // The Map is created in the store so trafimage- maps is responsible
    // to clear the map before unmount.
    // Make sure all layers and their listeners (ol and mobility-toolbox-js)
    // are well removed.
    this.store.getState().app.map.getLayers().clear();
  }

  render() {
    const {
      history,
      apiKey,
      apiKeyName,
      topics,
      cartaroUrl,
      loginUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
      staticFilesUrl,
      activeTopicKey,
      mapsetUrl,
      shortenerUrl,
      drawUrl,
      enableTracking,
    } = this.props;

    return (
      <>
        <MatomoProvider value={this.matomo}>
          <ThemeProvider theme={theme}>
            <Provider store={this.store}>
              <Head
                topics={topics}
                displayConsent={enableTracking}
                domainConsentId="784d5a56-cba1-4b22-9cde-019c2e67555a-test"
              />
              <MatomoTracker />
              <TopicLoader
                history={history}
                apiKey={apiKey}
                apiKeyName={apiKeyName}
                topics={topics}
                activeTopicKey={activeTopicKey}
                cartaroUrl={cartaroUrl}
                loginUrl={loginUrl}
                appBaseUrl={appBaseUrl}
                vectorTilesKey={vectorTilesKey}
                vectorTilesUrl={vectorTilesUrl}
                staticFilesUrl={staticFilesUrl}
                mapsetUrl={mapsetUrl}
                shortenerUrl={shortenerUrl}
                drawUrl={drawUrl}
              />
            </Provider>
          </ThemeProvider>
        </MatomoProvider>
      </>
    );
  }
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default TrafimageMaps;
