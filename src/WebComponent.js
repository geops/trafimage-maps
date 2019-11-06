/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Styled } from 'create-react-web-component';
import TrafimageMaps from './components/TrafimageMaps';
import styles from './main.e1265f09.css';

const propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  apiKey: PropTypes.string,
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
};

const defaultProps = {
  center: [925472, 5920000],
  zoom: undefined,
  apiKey: null,
  topics: null,
  elements: {
    header: false,
    footer: false,
    menu: false,
    permalink: false,
    popup: false,
    mapControls: false,
    baseLayerToggler: false,
    shareMenu: false,
    trackerMenu: false,
    featureMenu: false,
    search: false,
  },
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
