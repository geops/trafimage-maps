import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import Button from 'react-spatial/components/Button';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import { transform as transformCoords } from 'ol/proj';
import BahnhofplanPopup from '../BahnhofplanPopup';

import './NetzkartePopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  projection: PropTypes.shape({
    format: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

class NetzkartePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPlanLinks: false,
      showCoordinates: false,
    };
  }

  render() {
    const { feature, projection, language, t } = this.props;
    const { showPlanLinks, showCoordinates } = this.state;

    const isAirport = feature.get('layer').indexOf('flug') > 0;

    const iabpUrl = feature.get('url_interactive_plan');
    const a4Url = feature.get('url_a4');
    const posterUrl = feature.get('url_poster');
    const shoppingUrl = feature.get('url_shopping');

    const hasPlanLinks = !!iabpUrl || !!a4Url || !!posterUrl || !!shoppingUrl;

    const name = feature.get('name');
    const didok = feature.get('didok');
    const layer = feature.get('layer');

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

    if (isAirport) {
      airportLabel = <div>{t(layer)}</div>;
    }

    if (name && !isAirport) {
      stationTimetableLink = (
        <div>
          <a
            href={stationTimetableUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('Fahrplan')}
          </a>
        </div>
      );
    }

    if (didok && layer === 'Zug') {
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

    if (shoppingLangUrl && layer !== 'Schiff') {
      shoppingLink = (
        <div>
          <a href={shoppingLangUrl} rel="noopener noreferrer" target="_blank">
            {t('Shopping im Bahnhof')}
          </a>
        </div>
      );
    }

    const coordinates = transformCoords(
      [feature.get('longitude'), feature.get('latitude')],
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
          className="wkp-coordinate-toggle"
          onClick={() => this.setState({ showCoordinates: !showCoordinates })}
          onKeyPress={() =>
            this.setState({ showCoordinates: !showCoordinates })
          }
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
          <span>{`${t('Höhe')}: ${feature.get('altitude')}m`}</span>
        </div>
      </div>
    );

    return (
      <div className="wkp-netzkarte-popup">
        <div className="wkp-netzkarte-popup-title">{feature.get('name')}</div>
        {airportLabel}
        {hasPlanLinks ? (
          <>
            <Button
              onClick={() => {
                this.setState({ showPlanLinks: !showPlanLinks });
              }}
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
        {stationServiceLink}
        {shoppingLink}
        {handicapLink}
        {coordinatesWrapper}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  language: state.app.language,
  projection: state.app.projection,
});

NetzkartePopup.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(NetzkartePopup);
