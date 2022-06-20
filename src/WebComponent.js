/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Styled } from '@geops/create-react-web-component';
import LayerService from 'react-spatial/LayerService';
import TrafimageMaps from './components/TrafimageMaps';
import styles from './WebComponent.scss';
import { getTopicConfig } from './config/topics';

const propTypes = {
  /**
   * Configuration of the topics to load. See examples to learn how topics
   * can be configured or use the 'appName' attribute to load a predefined
   * topic configuration (ask us for help). lalal
   */
  topics: PropTypes.array,

  /**
   * Set the default visiblity of HTML elements. It will override all the topics configuration.
   */
  elements: PropTypes.string,

  /**
   * Set the default visiblity of the layers in the topic. It will override all the topics configuration.
   * Warning: Used with caution if you also use Permalink functionnality.
   */
  layersVisibility: PropTypes.string,

  /**
   * @ignore
   */
  history: PropTypes.object,

  /**
   * Language of the application.
   */
  language: PropTypes.string,

  /**
   * Width of the application as CSS property.
   * Default is '100%'.
   */
  width: PropTypes.string,

  /**
   * Height of the application as CSS proprerty.
   * Default is '100%'.
   */
  height: PropTypes.string,

  /**
   * Initial map center. Default is '925472,5920000'.
   */
  center: PropTypes.string,

  /**
   * Initial map zoom. Default is '9'.
   */
  zoom: PropTypes.string,

  /**
   * Limit the map extent (e.g. maxExtent="502649.8980,5655117.1007,1352629.6525,6141868.0968"). Default extent has no limit.
   */
  maxExtent: PropTypes.string,

  /**
   * Application name. By specifying the app name, you can load a predefined
   * topics configuration. Default is 'wkp' loading the trafimage maps portal.
   */
  appName: PropTypes.string,

  /**
   * Key of the topic that should be opened on startup.
   */
  activeTopicKey: PropTypes.string,

  /**
   * API key of using the application. Details at 'https://developer.geops.io'.
   */
  apiKey: PropTypes.string,

  /**
   * API key name of using the application.
   */
  apiKeyName: PropTypes.string,

  /**
   * URL of the cartaro instance to use.
   * @ignore
   */
  cartaroUrl: PropTypes.string,

  /**
   * URL of the previous cartaro instance to use.
   * @ignore
   */
  loginUrl: PropTypes.string,

  /**
   * Base URL to use.
   * @ignore
   */
  appBaseUrl: PropTypes.string,

  /**
   * API key for accessing vector tiles.
   * Details at 'https://developer.geops.io'.
   */
  vectorTilesKey: PropTypes.string,

  /**
   * URL of the vector tile server. Default is 'https://maps.geops.io'.
   */
  vectorTilesUrl: PropTypes.string,

  /**
   * API key for accessing tracker data.
   * Details at 'https://developer.geops.io'.
   */
  realtimeKey: PropTypes.string,

  /**
   * URL of the websocket realtime server. Default is 'https://maps.geops.io'.
   */
  realtimeUrl: PropTypes.string,

  /**
   * URL of the static files. Default is 'https://maps2.trafimage.ch'.
   */
  staticFilesUrl: PropTypes.string,

  /**
   * Enable analytics tracking.
   */
  enableTracking: PropTypes.string,

  /**
   * Disable use of cookies when tracking is enabled and no domainConsentId is provided.
   */
  disableCookies: PropTypes.string,

  /**
   * URL endpoint for matomo.
   */
  matomoUrl: PropTypes.string,

  /**
   * Site id used by matomo
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
   * Improve mouse/touch interactions to avoid conflict with parent page.
   */
  embedded: PropTypes.string,
};

const attributes = {
  width: '100%',
  height: '100%',
  center: undefined,
  zoom: undefined,
  maxExtent: undefined,
  appName: 'wkp',
  language: 'de',
  activeTopicKey: undefined,
  apiKey: undefined,
  apiKeyName: 'key',
  cartaroUrl: process?.env?.REACT_APP_CARTARO_URL,
  loginUrl: undefined,
  appBaseUrl: process?.env?.REACT_APP_BASE_URL,
  vectorTilesKey: process?.env?.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process?.env?.REACT_APP_VECTOR_TILES_URL,
  vectorRealtimeKey: process?.env?.REACT_APP_REALTIME_KEY,
  vectorRealtimeUrl: process?.env?.REACT_APP_REALTIME_URL,
  staticFilesUrl: process?.env?.REACT_APP_STATIC_FILES_URL,
  mapsetUrl: process?.env?.REACT_APP_MAPSET_URL,
  shortenerUrl: process?.env?.REACT_APP_SHORTENER_URL,
  drawUrl: process?.env?.REACT_APP_DRAW_URL,
  enableTracking: 'true',
  disableCookies: null,
  elements: undefined,
  layersVisibility: undefined,
  embedded: undefined,
  domainConsent: process?.env?.REACT_APP_DOMAIN_CONSENT,
  domainConsentId: process?.env?.REACT_APP_DOMAIN_CONSENT_ID,
  matomoUrl: process?.env?.REACT_APP_MATOMO_URL_BASE,
  matomoSiteId: process?.env?.REACT_APP_MATOMO_SITE_ID,
  searchUrl: process?.env?.REACT_APP_SEARCH_URL,
};

const defaultProps = {
  topics: undefined,
  history: undefined,
};

// Since we won't clone all layers, we store here the initial visibility of
// layers to be able to set it back if the layersVisibility parameter change.
const initialLayersVisibility = {};

const WebComponent = (props) => {
  const {
    activeTopicKey,
    width,
    height,
    zoom,
    maxExtent,
    topics,
    appName,
    center,
    apiKey,
    apiKeyName,
    vectorTilesKey,
    enableTracking,
    elements,
    layersVisibility,
    embedded,
    domainConsent,
    domainConsentId,
    disableCookies,
  } = props;

  const arrayCenter = useMemo(() => {
    if (!center || Array.isArray(center)) {
      return center;
    }
    return JSON.parse(center);
  }, [center]);

  const vectorTileApiKey = useMemo(
    () => vectorTilesKey || apiKey,
    [apiKey, vectorTilesKey],
  );
  const floatZoom = useMemo(() => zoom && parseFloat(zoom), [zoom]);

  const extentArray = useMemo(
    () => maxExtent && maxExtent.split(',').map((float) => parseFloat(float)),
    [maxExtent],
  );
  const appTopics = useMemo(() => {
    const tps = topics || getTopicConfig(appName);

    if (!tps) {
      // eslint-disable-next-line no-console
      console.warn(`There is no public topics for app name: ${appName}.`);
      // It's important to return null so the permalink doesn't try to update parameters.
      // If we return [], it will try to update paramaters and we will loose the inital
      // parameters when the topics will be loaded.
      return null;
    }

    // This comparaison is really bad, depending on which is the pathname the web component
    // could load nothing. Example with a pathname like this /build.d/index.html
    // We expect a topic is composed at least like this xxxx.xxxx.xxxx.
    const urlTopic =
      !!window.location.pathname.replace('/', '').split('.').length > 1;
    if (urlTopic && activeTopicKey && urlTopic !== activeTopicKey) {
      return [];
    }
    if (activeTopicKey) {
      tps.forEach((topic) => {
        // eslint-disable-next-line no-param-reassign
        topic.active = topic.key === activeTopicKey;
        // eslint-disable-next-line no-param-reassign
        topic.hideInLayerTree =
          topic.hideInLayerTree && topic.key === activeTopicKey
            ? false
            : topic.hideInLayerTree;
      });
    } else {
      tps[0].active = true;
    }

    // Override topic config with web componenet parameters.
    // TODO improve the code, particularly the transformation string to object.
    tps.forEach((topic) => {
      // Override elements.
      if (elements) {
        const obj = {};
        elements.split(',').forEach((elt) => {
          const [key, value] = elt.split('=');
          obj[key] = value === 'true';
        });
        // eslint-disable-next-line no-param-reassign
        topic.elements = { ...topic.elements, ...obj };
      }
      // Override layers visiblity.
      if (layersVisibility && topic.layers.length) {
        const obj = {};
        layersVisibility.split(',').forEach((elt) => {
          const [key, value] = elt.split('=');
          obj[key] = value === 'true';
        });
        const layerService = new LayerService(topic.layers);
        const layers = layerService.getLayersAsFlatArray();
        Object.entries(obj).forEach(([key, value]) => {
          layers.forEach((layer) => {
            const initalVisibility = initialLayersVisibility[layer.key];
            if (
              (initalVisibility === true || initalVisibility === false) &&
              obj[layer.key] === undefined
            ) {
              layer.setVisible(initialLayersVisibility[layer.key]);
              delete initialLayersVisibility[layer.key];
            }

            if (layer.key === key) {
              if (!initialLayersVisibility[key]) {
                initialLayersVisibility[key] = layer.visible;
              }
              // eslint-disable-next-line no-param-reassign
              layer.setVisible(value);
            }
          });
        });
      }
    });

    return [...tps];
  }, [topics, appName, activeTopicKey, elements, layersVisibility]);

  if (!appTopics) {
    return null;
  }

  return (
    <Styled styles={styles}>
      <div
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <TrafimageMaps
          {...props}
          apiKey={apiKey}
          apiKeyName={apiKeyName}
          vectorTilesKey={vectorTileApiKey}
          topics={appTopics}
          zoom={floatZoom}
          maxExtent={extentArray}
          center={arrayCenter}
          embedded={embedded === 'true'}
          enableTracking={enableTracking === 'true'}
          disableCookies={disableCookies === 'true'}
          domainConsent={domainConsent}
          domainConsentId={domainConsentId}
        />
      </div>
    </Styled>
  );
};

WebComponent.propTypes = propTypes;
WebComponent.defaultProps = defaultProps;
const memoized = React.memo(WebComponent);
memoized.defaultProps = defaultProps;
memoized.attributes = attributes;

export default memoized;
