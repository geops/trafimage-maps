/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ScaleLine from 'react-spatial/components/ScaleLine';
import MousePosition from 'react-spatial/components/MousePosition';
import { Link } from '@material-ui/core';
import ProjectionSelect from '../ProjectionSelect';
import coordinateHelper from '../../utils/coordinateHelper';
import { setDialogVisible } from '../../model/app/actions';

function Footer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const projection = useSelector((state) => state.app.projection);
  const consentGiven = useSelector((state) => state.app.consentGiven);

  const projections = useMemo(() => {
    return [
      {
        label: 'CH1903 / LV03',
        value: 'EPSG:21781',
        format: (c) =>
          `${t('Koordinaten')}: ${coordinateHelper.meterFormat(c)}`,
      },
      {
        label: 'CH1903+ / LV95',
        value: 'EPSG:2056',
        format: (c) =>
          `${t('Koordinaten')}: ${coordinateHelper.meterFormat(c)}`,
      },
      {
        label: 'Web Mercator',
        value: 'EPSG:3857',
        format: (c) =>
          `${t('Koordinaten')}: ${coordinateHelper.meterFormat(c)}`,
      },
      {
        label: 'WGS 84',
        value: 'EPSG:4326',
        format: (c) =>
          `${t('Koordinaten')}: ${coordinateHelper.wgs84Format(c)}`,
      },
    ];
  }, [t]);

  return (
    <div className="wkp-footer">
      <div className="wkp-footer-left">
        <ScaleLine map={map} />
        <ProjectionSelect projections={projections} />
        <MousePosition
          map={map}
          projections={projections}
          projectionValue={projection}
        />
      </div>
      <div className="wkp-footer-right">
        {/* Open the OneTrust consent management dialog */}
        {consentGiven && (
          <Link
            component="button"
            className="wkp-cookies-link"
            // eslint-disable-next-line no-undef
            onClick={() => {
              window.Optanon.ToggleInfoDisplay();
            }}
            tabIndex="0"
          >
            {t('Cookie-Einstellungen')}
          </Link>
        )}
        <Link
          component="button"
          onClick={() => dispatch(setDialogVisible('Kontakt'))}
          tabIndex="0"
        >
          {t('Kontakt')}
        </Link>
        <Link
          component="button"
          onClick={() => dispatch(setDialogVisible('Impressum'))}
          tabIndex="0"
        >
          {t('Impressum')}
        </Link>
        <Link
          component="button"
          onClick={() => dispatch(setDialogVisible('Rechtliches'))}
          tabIndex="0"
        >
          {t('Rechtliches')}
        </Link>
        <Link
          className="wkp-dev-portal-link"
          href="https://doc.trafimage.ch"
          rel="noopener noreferrer"
          target="_blank"
          tabIndex="0"
        >
          Developer Portal
        </Link>
      </div>
    </div>
  );
}

export default React.memo(Footer);
