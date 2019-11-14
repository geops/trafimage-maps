/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Styled } from 'create-react-web-component';
import TrafimageMaps from './components/TrafimageMaps';
import styles from './WebComponent.scss';
import topicConfig from './config/topics';

const propTypes = {
  // Properties
  topics: PropTypes.array,
  history: PropTypes.object,

  // Attributes
  width: PropTypes.string,
  height: PropTypes.string,
  center: PropTypes.string,
  zoom: PropTypes.string,
  appName: PropTypes.string,
  activeTopicKey: PropTypes.string,
  apiKey: PropTypes.string,
  cartaroUrl: PropTypes.string,
  geoServerUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,
};

const attributes = {
  width: '100%',
  height: '100%',
  center: undefined,
  zoom: undefined,
  appName: 'wkp',
  activeTopicKey: undefined,
  apiKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  cartaroUrl: process.env.REACT_APP_CARTARO_URL,
  geoServerUrl: process.env.REACT_APP_GEOSERVER_URL,
  vectorTilesKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process.env.REACT_APP_VECTOR_TILES_URL,
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
  } = props;

  const arrayCenter = useMemo(() => {
    if (!center || Array.isArray(center)) {
      return center;
    }
    return JSON.parse(center);
  }, [center]);

  const floatZoom = useMemo(() => zoom && parseFloat(zoom), [zoom]);
  const appTopics = useMemo(() => {
    const tps = topics || topicConfig[appName];
    if (activeTopicKey) {
      tps.forEach(topic => {
        // eslint-disable-next-line no-param-reassign
        topic.active = topic.key === activeTopicKey;
      });
    } else {
      tps[0].active = true;
    }
    return [...tps];
  }, [activeTopicKey, appName, topics]);

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
