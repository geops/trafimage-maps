import React from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import RSFooter from 'react-spatial/components/Footer';
import ScaleLine from 'react-spatial/components/ScaleLine';
import MousePosition from 'react-spatial/components/MousePosition';

import './Footer.scss';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

const numberFormat = coords => {
  const coordStr = coords.map(num =>
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'"),
  );

  return `Koordinaten: ${coordStr}`;
};

const Footer = ({ map }) => (
  <RSFooter className="wkp-footer">
    <MousePosition
      coordinatePosition="left"
      map={map}
      projections={[
        {
          label: 'CH1093 / LV03',
          value: 'EPSG:21781',
          format: numberFormat,
        },
        {
          label: 'CH1093+ / LV95',
          value: 'EPSG:2056',
          format: numberFormat,
        },
        {
          label: 'Web Mercator',
          value: 'EPSG:3857',
          format: numberFormat,
        },
        {
          label: 'WSG 85',
          value: 'EPSG:4324',
        },
      ]}
    />
    <ScaleLine map={map} />
  </RSFooter>
);

Footer.propTypes = propTypes;
export default Footer;
