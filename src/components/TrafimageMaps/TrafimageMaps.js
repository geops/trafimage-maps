// import polyfills if application is not loaded via index.js
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
  setSearchUrl,
  setConsentGiven,
  setEmbedded,
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
   * URL endpoint for main search.
   * @private
   */
  searchUrl: PropTypes.string,

  /**
   * Enable analytics tracking.
   * @private
   */
  enableTracking: PropTypes.bool,

  /**
   * Disable use of cookies and consent banner when tracking is enabled.
   */
  disableCookies: PropTypes.bool,

  /**
   * URL endpoint for matomo.
   * @private
   */
  matomoUrl: PropTypes.string,

  /**
   * Site id used by matomo
   * @private
   */
  matomoSiteId: PropTypes.string,

  /**
   * Domain for which the domainConsentId is configured for.
   */
  domainConsent: PropTypes.string,

  /**
   * OneTrust id used for consent Management.
   * WARNING: OneTrust id can be domain dependent and with SameSite=LAX configured,
   * so make sure OneTrust is properly configured for your domain.
   */
  domainConsentId: PropTypes.string,

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

  /**
   * Improve mouse/touch interactions to avoid conflict with parent page.
   */
  embedded: PropTypes.bool,
};

const defaultProps = {
  history: null,
  center: [925472, 5920000],
  zoom: undefined,
  maxExtent: undefined,
  apiKey: process?.env?.REACT_APP_VECTOR_TILES_KEY,
  apiKeyName: 'key',
  cartaroUrl: process?.env?.REACT_APP_CARTARO_URL,
  loginUrl: undefined,
  appBaseUrl: process?.env?.REACT_APP_BASE_URL,
  vectorTilesKey: process?.env?.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process?.env?.REACT_APP_VECTOR_TILES_URL,
  staticFilesUrl: process?.env?.REACT_APP_STATIC_FILES_URL,
  mapsetUrl: process?.env?.REACT_APP_MAPSET_URL,
  shortenerUrl: process?.env?.REACT_APP_SHORTENER_URL,
  drawUrl: process?.env?.REACT_APP_DRAW_URL,
  destinationUrl: process?.env?.REACT_APP_DESTINATION_URL,
  departuresUrl: process?.env?.REACT_APP_DEPARTURES_URL,
  topics: null,
  language: 'de',
  enableTracking: true,
  disableCookies: false,
  activeTopicKey: null,
  permissionInfos: null,
  embedded: false,
  domainConsent: process?.env?.REACT_APP_DOMAIN_CONSENT,
  domainConsentId: process?.env?.REACT_APP_DOMAIN_CONSENT_ID,
  matomoUrl: process?.env?.REACT_APP_MATOMO_URL_BASE,
  matomoSiteId: process?.env?.REACT_APP_MATOMO_SITE_ID,
  searchUrl: process?.env?.REACT_APP_SEARCH_URL,
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

    this.state = {
      requireConsent: false,
    };

    // Create the matomo instance asap.
    // Very important to do it here otherwise on the first render this.matomo will be undefined
    // and the useMatomo hook in MatomoTracker will not use the instance to track the view.
    // This happened on the doc page (yarn start:doc) but not on the app page (yarn start).
    const {
      enableTracking,
      matomoUrl,
      matomoSiteId,
      disableCookies,
      domainConsent,
      domainConsentId,
    } = props;
    if (enableTracking && matomoUrl && matomoSiteId) {
      // Consent management is tricky.
      // OneTrust cookies are domain dependent (trafimage.ch using the default id) and use SameSite=LAX by default.
      // Owner of OneTrust id must ask OneTrust guy to change this SameSite property to work in a iframe in a 3rd party website.
      // Matomo cookies are not domain dependent and use SameSite=LAX by default.
      // SameSite=LAX forbid use of cookies when the page is called from a 3rd party website,
      // so when called in an iframe from a 3rd party website like sob cookies are never set. So no need of consent banner.
      const isIframe = window !== window.parent;

      // Would be nice if this could be done accessing the OneTrust config.
      const allowedDomainRegex = new RegExp(domainConsent);
      const isDomainAllowed = allowedDomainRegex.test(window.location.host);
      let isParentDomainAllowed = false;
      try {
        isParentDomainAllowed =
          isIframe && allowedDomainRegex.test(window.parent.location.host);
      } catch (e) {
        // Accessing parent variables in a cross-origin domain triggers a SecurityException.
        // So we are sure that the parent is not allowed.
        isParentDomainAllowed = false;
      }
      const isHttps = window.location.protocol === 'https:';

      // Separate the logic avoid a warning if Secure=true and the site is http.
      const configurations =
        isIframe && isHttps
          ? {
              // It's important that the OneTrust cookies also ahve the same properties,
              // otherwise results of consent will never be saved
              setSecureCookie: true,
              setCookieSameSite: 'None',
            }
          : {
              // Matomo set SameSite=LAX by default if nothing is provided.
              setCookieSameSite: 'LAX',
            };
      // console.log(window.OneTrust.GetDomainData());
      this.matomo = createInstance({
        urlBase: matomoUrl,
        siteId: matomoSiteId,
        trackerUrl: `${matomoUrl}piwik.php`,
        configurations,
      });

      // In case we are in a iframe and parent is not allowed and in http the cookie
      // will not work because SameSite=LAX so we have better time to disableCookies
      // to avoid errors message.
      if (disableCookies || (isIframe && !isParentDomainAllowed && !isHttps)) {
        this.matomo.pushInstruction('disableCookies');
      }

      // Need of the consent  if:
      // - if the user has not specifically disabled cookies.
      // - if the current domain is the same as the one configured by OneTrust for this domain consent id.
      // - if the web component is used in an iframe and the parent domain is also the one configured by OneTrust.
      // - if the web component is used in an iframe using https outside the OneTrust id domain,
      //   in the case it uses http in an iframe, Matomo cookies will use SameSite=LAX and will not add cookie to the page from
      //   a 3rd party website, so no need of a consent.
      if (
        domainConsentId &&
        !disableCookies &&
        isDomainAllowed &&
        (!isIframe ||
          (isIframe && isParentDomainAllowed) ||
          (isIframe && !isParentDomainAllowed && isHttps))
      ) {
        this.matomo.pushInstruction('requireConsent');
        this.state = {
          requireConsent: true,
        };
      } else {
        this.matomo.trackPageView();
      }
    }
  }

  componentDidMount() {
    const {
      zoom,
      center,
      language,
      cartaroUrl,
      mapsetUrl,
      shortenerUrl,
      drawUrl,
      maxExtent,
      permissionInfos,
      destinationUrl,
      departuresUrl,
      apiKey,
      embedded,
      searchUrl,
    } = this.props;
    const { requireConsent } = this.state;

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

    if (searchUrl) {
      this.store.dispatch(setSearchUrl(searchUrl));
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

    if (embedded) {
      this.store.dispatch(setEmbedded(embedded));
    }

    if (requireConsent) {
      // Function called on consent change event
      window.OptanonWrapper = () => {
        if (!window.Optanon || !window.Optanon.IsAlertBoxClosed()) {
          return;
        }

        if (!/,C0002,/.test(window.OptanonActiveGroups)) {
          // Disable Matomo cookies
          this.store.dispatch(setDisableCookies(true));
        }

        // Start the page tracking.
        this.store.dispatch(setConsentGiven(true));
      };
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
      embedded,
      searchUrl,
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

    if (searchUrl !== prevProps.searchUrl) {
      this.store.dispatch(setSearchUrl(searchUrl));
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

    if (embedded !== prevProps.embedded) {
      this.store.dispatch(setEmbedded(embedded));
    }
  }

  componentWillUnmount() {
    // The Map is created in the store so trafimage-maps is responsible
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
      domainConsentId,
    } = this.props;
    const { requireConsent } = this.state;

    return (
      <MatomoProvider value={this.matomo}>
        <ThemeProvider theme={theme}>
          <Provider store={this.store}>
            <Head
              topics={topics}
              displayConsent={enableTracking}
              domainConsentId={requireConsent ? domainConsentId : null}
            />
            {/* The tracking could not be instanced properly if this.matomo is not set, see constructor comment */}
            {this.matomo && <MatomoTracker />}
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
    );
  }
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default TrafimageMaps;
