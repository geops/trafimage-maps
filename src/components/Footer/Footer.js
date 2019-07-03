import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Map from 'ol/Map';
import RSFooter from 'react-spatial/components/Footer';
import ScaleLine from 'react-spatial/components/ScaleLine';
import Copyright from 'react-spatial/components/Copyright';
import Select from 'react-spatial/components/Select';
import MousePosition from 'react-spatial/components/MousePosition';
import LayerService from 'react-spatial/LayerService';

import { setLanguage } from '../../model/app/actions';
import './Footer.scss';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  language: PropTypes.string.isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  t: PropTypes.func.isRequired,

  // mapDispatchToProps
  dispatchSetLanguage: PropTypes.func.isRequired,
};

const numberFormat = coords => {
  const coordStr = coords.map(num =>
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'"),
  );

  return coordStr;
};

const Footer = ({ map, language, layerService, t, dispatchSetLanguage }) => (
  <RSFooter className="wkp-footer">
    <Copyright layerService={layerService} />
    <MousePosition
      coordinatePosition="left"
      map={map}
      projections={[
        {
          label: 'CH1093 / LV03',
          value: 'EPSG:21781',
          format: c => `${t('Koordinaten')}: ${numberFormat(c)}`,
        },
        {
          label: 'CH1093+ / LV95',
          value: 'EPSG:2056',
          format: c => `${t('Koordinaten')}: ${numberFormat(c)}`,
        },
        {
          label: 'Web Mercator',
          value: 'EPSG:3857',
          format: c => `${t('Koordinaten')}: ${numberFormat(c)}`,
        },
        {
          label: 'WSG 85',
          value: 'EPSG:4324',
          format: c => `${t('Koordinaten')}: ${c}`,
        },
      ]}
    />
    <ScaleLine map={map} />
    <Select
      className="wkp-language-select"
      options={[
        { label: 'DE', value: 'de' },
        { label: 'FR', value: 'fr' },
        { label: 'IT', value: 'it' },
        { label: 'EN', value: 'en' },
      ]}
      value={language}
      onChange={(e, opt) => {
        dispatchSetLanguage(opt.value);
      }}
    />
  </RSFooter>
);

const mapStateToProps = state => ({
  language: state.app.language,
});

const mapDispatchToProps = {
  dispatchSetLanguage: setLanguage,
};

Footer.propTypes = propTypes;
export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Footer);
