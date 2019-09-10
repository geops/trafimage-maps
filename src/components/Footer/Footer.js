import React, { useState } from 'react';
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
import ActionLink from 'react-spatial/components/ActionLink';
import Dialog from 'react-spatial/components/Dialog';
import { FaInfo } from 'react-icons/fa';
import LegalLines from '../legals/LegalLines';

import { setLanguage, setProjection } from '../../model/app/actions';
import './Footer.scss';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  language: PropTypes.string.isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  t: PropTypes.func.isRequired,

  // mapDispatchToProps
  dispatchSetLanguage: PropTypes.func.isRequired,
  dispatchSetProjection: PropTypes.func.isRequired,
};

const numberFormat = coords => {
  const coordStr = coords.map(num =>
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'"),
  );

  return coordStr;
};

const Footer = ({
  map,
  language,
  layerService,
  t,
  dispatchSetLanguage,
  dispatchSetProjection,
}) => {
  const [open, setOpen] = useState(null);

  return (
    <RSFooter className="wkp-footer">
      <div className="wkp-footer-left">
        <Copyright
          layerService={layerService}
          format={f => `${t('Geodaten')} ${f}`}
        />

        <div className="wkp-impressum">
          <ActionLink onClick={() => setOpen('Kontakt')}>
            {t('Kontakt')}
          </ActionLink>
          <ActionLink onClick={() => setOpen('Impressum')}>
            {t('Impressum')}
          </ActionLink>
          <ActionLink onClick={() => setOpen('Rechtliches')}>
            {t('Rechtliches')}
          </ActionLink>

          <Dialog
            title={
              <div>
                <FaInfo /> {t(open)}
              </div>
            }
            classNameChildren="tm-dialog-content"
            onClose={() => setOpen(null)}
            isOpen={open}
            isModal
          >
            <LegalLines
              doc={open ? open.toLowerCase() : null}
              language={language}
            />
          </Dialog>
        </div>
      </div>

      <div className="wkp-footer-right">
        <MousePosition
          coordinatePosition="left"
          map={map}
          onChange={(evt, proj) => {
            dispatchSetProjection(proj);
          }}
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
              label: 'WGS 84',
              value: 'EPSG:4326',
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
      </div>
    </RSFooter>
  );
};

const mapStateToProps = state => ({
  language: state.app.language,
});

const mapDispatchToProps = {
  dispatchSetLanguage: setLanguage,
  dispatchSetProjection: setProjection,
};

Footer.propTypes = propTypes;
export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Footer);
