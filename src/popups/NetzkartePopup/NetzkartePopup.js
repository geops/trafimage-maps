/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { transform as transformCoords } from 'ol/proj';
import { Layer } from 'mobility-toolbox-js/ol';
import { Link } from '@material-ui/core';
import { setFeatureInfo } from '../../model/app/actions';
import BahnhofplanPopup from '../BahnhofplanPopup';
import coordinateHelper from '../../utils/coordinateHelper';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function NetzkartePopup({ feature }) {
  const [showPlanLinks, setShowPlanLinks] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const dispatch = useDispatch();
  const projection = useSelector((state) => state.app.projection);

  const { t } = useTranslation();

  const openDeparturePopup = () => {
    dispatch(
      setFeatureInfo([
        {
          coordinate: feature.getGeometry().getCoordinates(),
          features: [feature],
          // Fake layer binded to popup, to open it.
          layer: new Layer({
            key: 'ch.sbb.departure.popup',
            properties: {
              popupComponent: 'DeparturePopup',
              useOverlay: true,
            },
          }),
        },
      ]),
    );
  };

  const iabpUrl = feature.get('url_interactive_plan');
  const a4Url = feature.get('url_a4');
  const posterUrl = feature.get('url_poster');
  const shoppingUrl = feature.get('url_shopping');
  const bepUrl = feature.get('url_bep');

  const hasPlanLinks = !!iabpUrl || !!a4Url || !!posterUrl || !!shoppingUrl;

  const name = feature.get('name');
  const didok = feature.get('sbb_id') - 8500000;
  let layer = feature.get('layer') || (feature.get('rail') ? 'railway' : '');
  if (feature.get('ferry')) {
    layer = 'ship';
  }

  const isAirport = layer && layer.indexOf('flug') > 0;

  const stationTimetableUrl = t('station_timetable_url').replace(
    '{stationname}',
    escape(name),
  );

  const stationServiceUrl = t('station_service_url').replace(
    '{didok}',
    escape(didok),
  );

  let airportLabel;
  let stationTimetableLink;
  let stationServiceLink;
  let bepLink;

  if (bepUrl) {
    bepLink = (
      <div>
        <Link href={bepUrl}> {t('url_bep')}</Link>
      </div>
    );
  }

  const transportLink = (
    <div>
      <div
        tabIndex={0}
        role="button"
        onClick={() => openDeparturePopup()}
        onKeyPress={() => openDeparturePopup()}
        className="wkp-departure-btn"
      >
        {t('Abfahrtszeiten')}
      </div>
    </div>
  );

  if (isAirport) {
    airportLabel = <div>{t(layer)}</div>;
  }

  if (name && !isAirport) {
    stationTimetableLink = (
      <div>
        <Link href={stationTimetableUrl}> {t('Fahrplan')}</Link>
      </div>
    );
  }

  if (didok && layer === 'railway') {
    stationServiceLink = (
      <div>
        <Link href={stationServiceUrl}> {t('Webseite Bahnhof')}</Link>
      </div>
    );
  }

  const coordinates =
    feature.get('longitude') && feature.get('latitude')
      ? transformCoords(
          [
            parseFloat(feature.get('longitude'), 10),
            parseFloat(feature.get('latitude'), 10),
          ],
          'EPSG:4326',
          projection.value,
        )
      : transformCoords(
          feature.getGeometry().getCoordinates(),
          'EPSG:3857',
          projection.value,
        );

  const formatedCoords =
    projection.value === 'EPSG:4326'
      ? coordinateHelper.wgs84Format(coordinates, ',')
      : coordinateHelper.meterFormat(coordinates);

  const coordinatesWrapper = (
    <>
      <div
        tabIndex={0}
        role="button"
        aria-expanded={showCoordinates}
        className="wkp-coordinate-toggle"
        onClick={() => setShowCoordinates(!showCoordinates)}
        onKeyPress={() => setShowCoordinates(!showCoordinates)}
      >
        {t('Koordinaten')}
      </div>

      <div
        className={`wkp-coordinates-infos${
          showCoordinates ? '' : ' wkp-closed'
        }`}
      >
        <span className="wkp-projection-label">{projection.label}</span>
        <span>{`${t('Länge')} (X): ${formatedCoords[0]}`}</span>
        <span>{`${t('Breite')} (Y): ${formatedCoords[1]}`}</span>
        {feature.get('altitude') && (
          <span>{`${t('Höhe')}: ${feature.get('altitude')}m`}</span>
        )}
      </div>
    </>
  );

  return (
    <div className="wkp-netzkarte-popup">
      {airportLabel}
      {hasPlanLinks ? (
        <>
          <div>
            <Link
              onClick={() => {
                setShowPlanLinks(!showPlanLinks);
              }}
              aria-expanded={showPlanLinks}
              className="wkp-popup-plans"
              tabIndex="0"
            >
              {t('Bahnhofpläne')}
            </Link>
          </div>
          <div
            className={`wkp-bahnhofplan-links${
              showPlanLinks ? ' wkp-visible' : ''
            }`}
          >
            <BahnhofplanPopup feature={feature} />
          </div>
        </>
      ) : null}
      {bepLink}
      {stationTimetableLink}
      {transportLink}
      {stationServiceLink}
      {coordinatesWrapper}
    </div>
  );
}

NetzkartePopup.propTypes = propTypes;

const memoized = React.memo(NetzkartePopup);
memoized.renderTitle = (feat, t) => {
  const platform = feat.get('platform');
  if (platform) {
    return `${feat.get('name')} (${t('abfahrtszeiten_kante')} ${platform})`;
  }
  return feat.get('name');
};

export default memoized;
