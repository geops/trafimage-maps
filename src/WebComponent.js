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
  center: PropTypes.arrayOf(PropTypes.number),
  topics: PropTypes.array,
  history: PropTypes.object,

  // Attributes
  width: PropTypes.string,
  height: PropTypes.string,
  zoom: PropTypes.number,
  header: PropTypes.string,
  footer: PropTypes.string,
  menu: PropTypes.string,
  permalink: PropTypes.string,
  search: PropTypes.string,
  popup: PropTypes.string,
  mapControls: PropTypes.string,
  baseLayerToggler: PropTypes.string,
  shareMenu: PropTypes.string,
  featureMenu: PropTypes.string,
  trackerMenu: PropTypes.string,
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
  zoom: undefined,
  footer: 'true',
  header: 'true',
  mapControls: 'true',
  menu: 'true',
  popup: 'true',
  search: 'true',
  permalink: 'false',
  baseLayerToggler: 'true',
  shareMenu: 'true',
  featureMenu: 'false',
  trackerMenu: 'true',
  appName: 'wkp',
  activeTopicKey: undefined,
  apiKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  cartaroUrl: process.env.REACT_APP_CARTARO_URL,
  geoServerUrl: process.env.REACT_APP_GEOSERVER_URL,
  vectorTilesKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process.env.REACT_APP_VECTOR_TILES_URL,
};

const defaultProps = {
  center: undefined,
  topics: undefined,
  history: undefined,
};

const getBool = val => val === 'true' || val === true;

const WebComponent = props => {
  const {
    width,
    height,
    zoom,
    footer,
    header,
    mapControls,
    menu,
    popup,
    search,
    permalink,
    baseLayerToggler,
    shareMenu,
    featureMenu,
    trackerMenu,
    topics,
    appName,
  } = props;

  const appTopics = topics || topicConfig[appName];
  const floatZoom = useMemo(() => zoom && parseFloat(zoom), [zoom]);

  const boolElements = useMemo(() => {
    return {
      footer: getBool(footer),
      header: getBool(header),
      mapControls: getBool(mapControls),
      menu: getBool(menu),
      popup: getBool(popup),
      search: getBool(search),
      permalink: getBool(permalink),
      baseLayerToggler: getBool(baseLayerToggler),
      shareMenu: getBool(shareMenu),
      featureMenu: getBool(featureMenu),
      trackerMenu: getBool(trackerMenu),
    };
  }, [
    footer,
    header,
    mapControls,
    menu,
    popup,
    search,
    permalink,
    baseLayerToggler,
    shareMenu,
    featureMenu,
    trackerMenu,
  ]);

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
          elements={boolElements}
          initialZoom={floatZoom}
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
