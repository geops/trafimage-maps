/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Styled } from '@geops/create-react-web-component';
import { Layer } from 'mobility-toolbox-js/ol';
import LayerService from './utils/LayerService';
import TrafimageMaps from './components/TrafimageMaps';
import styles from './WebComponent.scss';
import { getTopicConfig } from './config/topics';

const propTypes = {
  /**
   * Configuration of the topics to load. See examples to learn how topics
   * can be configured or use the 'appname' attribute to load a predefined
   * topic configuration (ask us for help).
   */
  topics: PropTypes.array,

  /**
   * Set the default visiblity of HTML elements. It will override all the topics configuration.
   */
  elements: PropTypes.string,

  /**
   * Set the default visiblity of the layers in the topic. It will override all the topics configuration.
   * Warning: used with caution if you also use Permalink functionnality.
   */
  layersvisibility: PropTypes.string,

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
   * Limit the map extent (e.g. maxextent="502649.8980,5655117.1007,1352629.6525,6141868.0968"). Default extent has no limit.
   */
  maxextent: PropTypes.string,

  /**
   * Application name. By specifying the app name, you can load a predefined
   * topics configuration. Default is 'wkp' loading the trafimage maps portal.
   */
  appname: PropTypes.string,

  /**
   * key of the topic that should be opened on startup.
   */
  activetopickey: PropTypes.string,

  /**
   * API key of using the application. Details at 'https://developer.geops.io'.
   */
  apikey: PropTypes.string,

  /**
   * API key name of using the application.
   */
  apikeyname: PropTypes.string,

  /**
   * URL of the cartaro instance to use.
   * @ignore
   */
  cartarourl: PropTypes.string,

  /**
   * URL of the previous cartaro instance to use.
   * @ignore
   */
  loginurl: PropTypes.string,

  /**
   * Base URL to use.
   * @ignore
   */
  appbaseurl: PropTypes.string,

  /**
   * URL of the kML service. Default is 'https://editor.mapset.ch/api/v1/meta/kml/'.
   */
  drawurl: PropTypes.string,

  /**
   * URL of the mapset editor. Default is 'https://editor.mapset.ch'.
   */
  mapseturl: PropTypes.string,

  /**
   * URL of the shortener service. Default is 'https://geops.sh/api/v1/weburls'.
   */
  shortenerurl: PropTypes.string,

  /**
   * API key for accessing vector tiles.
   * Details at 'https://developer.geops.io'.
   */
  vectortileskey: PropTypes.string,

  /**
   * URL of the vector tile server. Default is 'https://maps.geops.io'.
   */
  vectortilesurl: PropTypes.string,

  /**
   * API key for accessing Realtime api.
   * Details at 'https://developer.geops.io'.
   */
  realtimekey: PropTypes.string,

  /**
   * URL of the websocket realtime server. Default is 'wss://api.geops.io/tracker-ws/v1/ws'.
   */
  realtimeurl: PropTypes.string,

  /**
   * URL of the search API server. Default is 'https://maps.trafimage.ch'.
   */
  searchurl: PropTypes.string,

  /**
   * URL of the stops API server. Default is 'https://api.geops.io/stops/v1/'.
   */
  stopsurl: PropTypes.string,

  /**
   * URL of the static files. Default is 'https://maps2.trafimage.ch'.
   */
  staticfilesurl: PropTypes.string,

  /**
   * Enable analytics tracking.
   */
  enabletracking: PropTypes.string,

  /**
   * Disable use of cookies when tracking is enabled and no domainconsentid is provided.
   */
  disablecookies: PropTypes.string,

  /**
   * URL endpoint for matomo.
   */
  matomourl: PropTypes.string,

  /**
   * Site id used by matomo
   */
  matomositeid: PropTypes.string,

  /**
   * Domain for which the domainconsentid is configured for.
   */
  domainconsent: PropTypes.string,

  /**
   * OneTrust id used for consent Management.
   * WARNING: OneTrust id can be domain dependent and with SameSite=LAX configured,
   * so make sure OneTrust is properly configured for your domain.
   */
  domainconsentid: PropTypes.string,

  /**
   * Improve mouse/touch interactions to avoid conflict with parent page.
   */
  embedded: PropTypes.string,

  /**
   * URL of departures service .Default is '//maps.trafimage.ch/search/v2/destinations'.
   */
  departuresurl: PropTypes.string,

  /**
   * URL of destination service. Default is '//api.geops.io/sbb-departures/v1'.
   */
  destinationurl: PropTypes.string,
};

/** These are the web component attributes */
const attributes = {
  activetopickey: 'string',
  appbaseurl: 'string',
  apikey: 'string',
  apikeyname: 'string',
  appname: 'string',
  cartarourl: 'string',
  center: 'string',
  departuresurl: 'string',
  destinationurl: 'string',
  disablecookies: 'string',
  domainconsent: 'string',
  domainconsentid: 'string',
  drawurl: 'string',
  elements: 'string',
  embedded: 'string',
  enabletracking: 'string',
  height: 'string',
  history: 'string',
  language: 'string',
  layersvisibility: 'string',
  loginurl: 'string',
  mapseturl: 'string',
  matomositeid: 'string',
  matomourl: 'string',
  maxextent: 'string',
  realtimekey: 'string',
  realtimeurl: 'string',
  searchurl: 'string',
  shortenerurl: 'string',
  staticfilesurl: 'string',
  stopsurl: 'string',
  topics: 'string',
  vectortileskey: 'string',
  vectortilesurl: 'string',
  width: 'string',
  zoom: 'string',
};

const defaultProps = {
  activetopickey: undefined,
  appbaseurl: undefined,
  apikey: undefined,
  apikeyname: 'key',
  appname: 'wkp',
  cartarourl: undefined,
  center: undefined,
  departuresurl: undefined,
  destinationurl: undefined,
  disablecookies: undefined,
  domainconsent: undefined,
  domainconsentid: undefined,
  drawurl: undefined,
  elements: undefined,
  embedded: undefined,
  enabletracking: 'true',
  height: '100%',
  history: undefined,
  language: undefined,
  layersvisibility: undefined,
  loginurl: undefined,
  mapseturl: undefined,
  matomositeid: undefined,
  matomourl: undefined,
  maxextent: undefined,
  realtimekey: undefined,
  realtimeurl: undefined,
  searchurl: undefined,
  shortenerurl: undefined,
  staticfilesurl: undefined,
  stopsurl: undefined,
  topics: undefined,
  vectortileskey: undefined,
  vectortilesurl: undefined,
  width: '100%',
  zoom: undefined,
};

// Since we won't clone all layers, we store here the initial visibility of
// layers to be able to set it back if the layersvisibility parameter change.
const initialLayersVisibility = {};

function WebComponent(props) {
  const {
    activetopickey,
    appbaseurl,
    apikey,
    apikeyname,
    appname,
    cartarourl,
    center,
    departuresurl,
    destinationurl,
    disablecookies,
    domainconsent,
    domainconsentid,
    drawurl,
    elements,
    embedded,
    enabletracking,
    height,
    history,
    language,
    layersvisibility,
    loginurl,
    mapseturl,
    matomositeid,
    matomourl,
    maxextent,
    realtimekey,
    realtimeurl,
    searchurl,
    shortenerurl,
    staticfilesurl,
    stopsurl,
    topics,
    vectortileskey,
    vectortilesurl,
    width,
    zoom,
  } = props;
  const ref = useRef();

  // We have to wait the applyinace of the layersvisibility attribute to avoid having blinking bg layer on load
  const [layersvisibilityApplied, setLayersVisibilityApplied] =
    useState(!layersvisibility);

  const arrayCenter = useMemo(() => {
    if (!center || Array.isArray(center)) {
      return center;
    }
    return JSON.parse(center);
  }, [center]);

  const floatZoom = useMemo(() => zoom && parseFloat(zoom), [zoom]);

  const extentArray = useMemo(
    () => maxextent && maxextent.split(',').map((float) => parseFloat(float)),
    [maxextent],
  );

  const appTopics = useMemo(() => {
    const tps = topics || getTopicConfig(appname);

    if (!tps) {
      // eslint-disable-next-line no-console
      console.warn(`There is no public topics for app name: ${appname}.`);
      // It's important to return null so the permalink doesn't try to update parameters.
      // If we return [], it will try to update paramaters and we will loose the inital
      // parameters when the topics will be loaded.
      return null;
    }

    // This comparaison is really bad, depending on which is the pathname the web component
    // could load nothing. Example with a pathname like this /build.d/index.html
    // We expect a topic is composed at least like this xxxx.xxxx.xxxx.
    // const urlTopic = window.location.pathname.split('/').pop();
    // const isTopicInurl = urlTopic.split('.').length > 1;
    // if (
    //   isTopicInurl &&
    //   urlTopic &&
    //   activetopickey &&
    //   urlTopic !== activetopickey
    // ) {
    //   return [];
    // }

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
    });
    return [...tps];
  }, [topics, appname, elements]);

  // update layers visiblity using web component attribute
  // It's important to do this outside the previous useMemo so a webComponent render is not triggered
  useEffect(() => {
    // TODO improve the code, particularly the transformation string to object.
    appTopics?.forEach((topic) => {
      // We use the active topic key because it's to force the layersVisiibility
      // attribute to be reapply on change of a topic
      if (activetopickey && topic.key !== activetopickey) {
        return;
      }
      // Override layers visiblity.
      if (layersvisibility && topic.layers.length) {
        const obj = {};
        layersvisibility.split(',').forEach((elt) => {
          const [key, value] = elt.split('=');
          obj[key] = value === 'true';
        });
        const layerService = new LayerService(topic.layers);
        const layers = layerService.getLayersAsFlatArray();

        // We put then in a rootLayer to be sure the group property is properly applied
        const rootLayer = new Layer({ children: layers });
        Object.entries(obj).forEach(([key, value]) => {
          rootLayer.children.forEach((layer) => {
            const initalVisibility = initialLayersVisibility[layer.key];
            if (
              (initalVisibility === true || initalVisibility === false) &&
              obj[layer.key] === undefined
            ) {
              // eslint-disable-next-line no-param-reassign
              layer.visible = initialLayersVisibility[layer.key];
              delete initialLayersVisibility[layer.key];
            }

            if (layer.key === key) {
              if (!initialLayersVisibility[key]) {
                initialLayersVisibility[key] = layer.visible;
              }
              // eslint-disable-next-line no-param-reassign
              layer.visible = value;

              // Hide other base layers
              if (layer.get('isBaseLayer') && value) {
                rootLayer.children
                  .filter((l) => l.get('isBaseLayer'))
                  .forEach((l) => {
                    if (l.key !== key) {
                      // eslint-disable-next-line no-param-reassign
                      l.visible = false;
                    }
                  });
              }
            }
          });
        });

        rootLayer.children
          .filter((layer) => layer.get('isBaseLayer'))
          .forEach((layer) => {
            // When the base layer refers to a MapboxLayer we have to update the style of the
            // mapbox layer too, too avoid seeing the previous background first.
            //  same as in applPermalinkVisiblity funtion.
            if (layer.visible && layer.style && layer.mapboxLayer) {
              // eslint-disable-next-line no-param-reassign
              layer.mapboxLayer.style = layer.style;
            }
          });

        setLayersVisibilityApplied(true);
      }
    });
  }, [appTopics, layersvisibility, activetopickey]);

  if (!appTopics || !layersvisibilityApplied) {
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
        ref={ref}
      >
        {/* We translate attributes which are lower case to trafimagemaps attributes which are camelCase */}
        <TrafimageMaps
          activeTopicKey={activetopickey}
          appBaseUrl={appbaseurl}
          apiKey={apikey}
          apiKeyName={apikeyname}
          cartaroUrl={cartarourl}
          center={arrayCenter}
          departuresUrl={departuresurl}
          destinationUrl={destinationurl}
          disableCookies={disablecookies === 'true'}
          domainConsent={domainconsent}
          domainConsentId={domainconsentid}
          drawUrl={drawurl}
          elements={elements}
          embedded={embedded === 'true'}
          enableTracking={enabletracking === 'true'}
          history={history}
          language={language}
          loginUrl={loginurl}
          mapsetUrl={mapseturl}
          matomoSiteId={matomositeid}
          matomoUrl={matomourl}
          maxExtent={extentArray}
          // permissionInfos={permission}
          realtimeKey={realtimekey || apikey}
          realtimeUrl={realtimeurl}
          searchUrl={searchurl}
          shortenerUrl={shortenerurl}
          staticFilesUrl={staticfilesurl}
          stopsUrl={stopsurl}
          topics={appTopics}
          vectorTilesKey={vectortileskey || apikey}
          vectorTilesUrl={vectortilesurl}
          zoom={floatZoom}
        />
      </div>
    </Styled>
  );
}

WebComponent.propTypes = propTypes;
WebComponent.defaultProps = defaultProps;
const memoized = React.memo(WebComponent);
memoized.defaultProps = defaultProps;
memoized.attributes = attributes;

export default memoized;
