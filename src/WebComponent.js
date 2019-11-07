/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Styled } from 'create-react-web-component';
import TrafimageMaps from './components/TrafimageMaps';
import styles from './WebComponent.scss';
import defaultTopics from './config/topics';

const propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  topics: PropTypes.array,
  elements: PropTypes.shape({
    header: PropTypes.bool,
    footer: PropTypes.bool,
    menu: PropTypes.bool,
    permaLink: PropTypes.bool,
    popup: PropTypes.bool,
    mapControls: PropTypes.bool,
    baseLayerToggler: PropTypes.bool,
    shareMenu: PropTypes.bool,
    featureMenu: PropTypes.bool,
    trackerMenu: PropTypes.bool,
  }),
  apiKey: PropTypes.string,
  cartaroUrl: PropTypes.string,
  geoServerUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,
};

const defaultProps = {
  center: [925472, 5920000],
  zoom: undefined,
  elements: {
    footer: true,
    header: true,
    mapControls: true,
    menu: true,
    popup: true,
    search: true,
    permalink: false,
    baseLayerToggler: true,
    shareMenu: true,
    featureMenu: false,
    trackerMenu: true,
  },
  topics: defaultTopics,
  apiKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  cartaroUrl: process.env.REACT_APP_CARTARO_URL,
  geoServerUrl: process.env.REACT_APP_GEOSERVER_URL,
  vectorTilesKey: process.env.REACT_APP_VECTOR_TILES_KEY,
  vectorTilesUrl: process.env.REACT_APP_VECTOR_TILES_URL,
};

const WebComponent = props => {
  // eslint-disable-next-line react/prop-types
  const { width, height } = props;
  return (
    <Styled styles={styles}>
      <div
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <TrafimageMaps {...props} />
      </div>
    </Styled>
  );
};

WebComponent.propTypes = propTypes;
WebComponent.defaultProps = defaultProps;
WebComponent.attributes = {
  width: '100%',
  height: '100%',
};

export default WebComponent;
