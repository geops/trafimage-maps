import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import UIFooter from '@geops/react-ui/components/Footer';
import ScaleLine from 'react-spatial/components/ScaleLine';
import Copyright from 'react-spatial/components/Copyright';
import Select from '@geops/react-ui/components/Select';
import MousePosition from 'react-spatial/components/MousePosition';
import ActionLink from '@geops/react-ui/components/ActionLink';
import {
  setLanguage,
  setProjection,
  setDialogVisible,
} from '../../model/app/actions';
import './Footer.scss';

const numberFormat = coords => {
  const coordStr = coords.map(num =>
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'"),
  );

  return coordStr;
};

const Footer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const layerService = useSelector(state => state.app.layerService);
  const map = useSelector(state => state.app.map);
  const language = useSelector(state => state.app.language);

  return (
    <UIFooter className="wkp-footer">
      <div className="wkp-footer-left">
        <Copyright
          layerService={layerService}
          format={f => `${t('Geodaten')} ${f.join(', ')}`}
          className="tm-copyright"
        />
        <ActionLink onClick={() => dispatch(setDialogVisible('Kontakt'))}>
          {t('Kontakt')}
        </ActionLink>
        <ActionLink onClick={() => dispatch(setDialogVisible('Impressum'))}>
          {t('Impressum')}
        </ActionLink>
        <ActionLink onClick={() => dispatch(setDialogVisible('Rechtliches'))}>
          {t('Rechtliches')}
        </ActionLink>
        <a
          href="https://doc.trafimage.ch"
          rel="noopener noreferrer"
          target="_blank"
        >
          Developer Portal
        </a>
      </div>

      <div className="wkp-footer-right">
        <MousePosition
          coordinatePosition="left"
          map={map}
          onChange={(evt, proj) => {
            dispatch(setProjection(proj));
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
              format: c =>
                `${t('Koordinaten')}: ${c[0].toFixed(5)},${c[1].toFixed(5)}`,
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
            dispatch(setLanguage(opt.value));
          }}
        />
      </div>
    </UIFooter>
  );
};

export default React.memo(Footer);
