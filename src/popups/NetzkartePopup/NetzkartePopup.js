import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@geops/react-ui/components/Button';
import { useTranslation } from 'react-i18next';
import { transform as transformCoords } from 'ol/proj';
import { setClickedFeatureInfo } from '../../model/app/actions';
import BahnhofplanPopup from '../BahnhofplanPopup';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function NetzkartePopup({ feature }) {
  const [showPlanLinks, setShowPlanLinks] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const dispatch = useDispatch();
  const language = useSelector(state => state.app.language);
  const projection = useSelector(state => state.app.projection);

  const { t } = useTranslation();

  const openDeparturePopup = () => {
    dispatch(
      setClickedFeatureInfo([
        {
          coordinate: feature.getGeometry().getCoordinates()[0],
          features: [feature],
          // Fake layer binded to popup, to open it.
          layer: {
            getKey: () => 'ch.sbb.departure.popup',
            get: val => (val === 'popupComponent' ? 'DeparturePopup' : null),
          },
        },
      ]),
    );
  };

  const iabpUrl = feature.get('url_interactive_plan');
  const a4Url = feature.get('url_a4');
  const posterUrl = feature.get('url_poster');
  const shoppingUrl = feature.get('url_shopping');

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
  const handicapUrl = t('handicap_url').replace('{didok}', escape(didok));
  const shoppingLangUrl = feature.get(`url_shopping_${language}`);

  let airportLabel;
  let stationTimetableLink;
  let stationServiceLink;
  let handicapLink;
  let shoppingLink;

  const transportLink = (
    <div>
      <div
        tabIndex={0}
        role="button"
        onClick={() => openDeparturePopup()}
        onKeyPress={() => openDeparturePopup()}
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
        <a href={stationTimetableUrl} rel="noopener noreferrer" target="_blank">
          {t('Fahrplan')}
        </a>
      </div>
    );
  }

  if (didok && layer === 'railway') {
    stationServiceLink = (
      <div>
        <a href={stationServiceUrl} rel="noopener noreferrer" target="_blank">
          {t('Services am Bahnhof')}
        </a>
      </div>
    );

    handicapLink = (
      <div>
        <a href={handicapUrl} rel="noopener noreferrer" target="_blank">
          {t('Reisende mit Handicap')}
        </a>
      </div>
    );
  }

  if (shoppingLangUrl && layer !== 'ship') {
    shoppingLink = (
      <div>
        <a href={shoppingLangUrl} rel="noopener noreferrer" target="_blank">
          {t('Shopping im Bahnhof')}
        </a>
      </div>
    );
  }

  const coordinates = transformCoords(
    feature.get('longitude') && feature.get('latitude')
      ? [feature.get('longitude'), feature.get('latitude')]
      : feature.getGeometry().getCoordinates(),
    'EPSG:21781',
    projection.value,
  );

  const formatedCoords = coordinates.map(input => {
    const coord = Math.round(parseFloat(input) * 10 ** 4) / 10 ** 4;
    const parts = coord.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return parts.join();
  });

  const coordinatesWrapper = (
    <div>
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
    </div>
  );

  return (
    <div className="wkp-netzkarte-popup">
      {airportLabel}
      {hasPlanLinks ? (
        <>
          <Button
            onClick={() => {
              setShowPlanLinks(!showPlanLinks);
            }}
            ariaExpanded={showPlanLinks}
            className="wkp-popup-plans"
          >
            {t('Bahnhofpläne')}
          </Button>
          <div
            className={`wkp-bahnhofplan-links${
              showPlanLinks ? ' wkp-visible' : ''
            }`}
          >
            <BahnhofplanPopup feature={feature} showOnlyLinks />
          </div>
        </>
      ) : null}
      {stationTimetableLink}
      {transportLink}
      {stationServiceLink}
      {shoppingLink}
      {handicapLink}
      {coordinatesWrapper}
    </div>
  );
}

NetzkartePopup.propTypes = propTypes;

const memoized = React.memo(NetzkartePopup);
memoized.renderTitle = feat => feat.get('name');

export default memoized;
