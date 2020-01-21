/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Styled } from '@geops/create-react-web-component';
import TrafimageMaps from './components/TrafimageMaps';
import styles from './WebComponent.scss';
import { getTopicConfig } from './config/topics';

const propTypes = {
  /**
   * Configuration of the topics to load. See examples to learn how topics
   * can be configured or use the 'appName' attribute to load a predefined
   * topic configuration (ask us for help).
   */
  topics: PropTypes.array,

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
  apiKey: PropTypes.string.isRequired,

  /**
   * URL of the cartaro instance to use.
   * @ignore
   */
  cartaroUrl: PropTypes.string.isRequired,

  /**
   * Base URL to use.
   * @ignore
   */
  appBaseUrl: PropTypes.string.isRequired,

  /**
   * API key for accessing vector tiles.
   * Details at 'https://developer.geops.io'.
   */
  vectorTilesKey: PropTypes.string.isRequired,
  /**
   * URL of the vector tile server.
   */
  vectorTilesUrl: PropTypes.string.isRequired,

  /**
   * URL endpoint for static files hosted by geOps.
   */
  staticFilesUrl: PropTypes.string.isRequired,
};

const attributes = {
  width: '100%',
  height: '100%',
  center: undefined,
  zoom: undefined,
  appName: 'wkp',
  language: 'de',
  activeTopicKey: undefined,
  apiKey: undefined,
  cartaroUrl: undefined,
  appBaseUrl: undefined,
  vectorTilesKey: undefined,
  vectorTilesUrl: undefined,
  staticFilesUrl: undefined,
};

const defaultProps = {
  topics: undefined,
  history: undefined,
};

const WebComponent = props => {
  const {
    activeTopicKey,
    width,
    height,
    zoom,
    topics,
    appName,
    center,
    apiKey,
    vectorTilesKey,
  } = props;

  const arrayCenter = useMemo(() => {
    if (!center || Array.isArray(center)) {
      return center;
    }
    return JSON.parse(center);
  }, [center]);

  const vectorTileApiKey = useMemo(() => vectorTilesKey || apiKey, [
    apiKey,
    vectorTilesKey,
  ]);
  const floatZoom = useMemo(() => zoom && parseFloat(zoom), [zoom]);
  const appTopics = useMemo(() => {
    const tps = topics || getTopicConfig(apiKey, appName);
    if (!tps) {
      // eslint-disable-next-line no-console
      console.error('You must provide a list of topics');
      return [];
    }
    if (activeTopicKey) {
      tps.forEach(topic => {
        // eslint-disable-next-line no-param-reassign
        topic.active = topic.key === activeTopicKey;
      });
    } else {
      tps[0].active = true;
    }
    return [...tps];
  }, [activeTopicKey, appName, topics, apiKey]);

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
          vectorTilesKey={vectorTileApiKey}
          topics={appTopics}
          zoom={floatZoom}
          center={arrayCenter}
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
