import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import UIFooter from '@geops/react-ui/components/Footer';
import ScaleLine from 'react-spatial/components/ScaleLine';
import Copyright from 'react-spatial/components/Copyright';
import MousePosition from 'react-spatial/components/MousePosition';
import ActionLink from '@geops/react-ui/components/ActionLink';
import ProjectionSelect from '../ProjectionSelect';
import coordinateHelper from '../../utils/coordinateHelper';
import { setDialogVisible } from '../../model/app/actions';
import './Footer.scss';

const Footer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const projection = useSelector((state) => state.app.projection);

  const projections = [
    {
      label: 'CH1903 / LV03',
      value: 'EPSG:21781',
      format: (c) => `${t('Koordinaten')}: ${coordinateHelper.meterFormat(c)}`,
    },
    {
      label: 'CH1903+ / LV95',
      value: 'EPSG:2056',
      format: (c) => `${t('Koordinaten')}: ${coordinateHelper.meterFormat(c)}`,
    },
    {
      label: 'Web Mercator',
      value: 'EPSG:3857',
      format: (c) => `${t('Koordinaten')}: ${coordinateHelper.meterFormat(c)}`,
    },
    {
      label: 'WGS 84',
      value: 'EPSG:4326',
      format: (c) => `${t('Koordinaten')}: ${coordinateHelper.wgs84Format(c)}`,
    },
  ];

  return (
    <UIFooter className="wkp-footer">
      <div className="wkp-footer-left">
        <Copyright
          map={map}
          format={(f) => `${t('Geodaten')} ${f.join(', ')}`}
          className="tm-copyright"
        />
        <ScaleLine map={map} />
        <ProjectionSelect projections={projections} />
        <MousePosition
          map={map}
          projections={projections}
          projectionValue={projection}
        />
      </div>
      <div className="wkp-footer-right">
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
          className="wkp-dev-portal-link"
          href="https://doc.trafimage.ch"
          rel="noopener noreferrer"
          target="_blank"
        >
          Developer Portal
        </a>
      </div>
    </UIFooter>
  );
};

export default React.memo(Footer);
