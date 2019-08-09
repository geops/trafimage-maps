import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import Button from 'react-spatial/components/Button';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import BahnhofplanPopup from '../BahnhofplanPopup';

import './NetzkartePopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

class NetzkartePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPlanLinks: false,
    };
  }

  render() {
    const { feature, language, t } = this.props;
    const { showPlanLinks } = this.state;

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

    return (
      <div className="tm-netzkarte-popup">
        <div className="tm-netzkarte-popup-title">{feature.get('name')}</div>
        {airportLabel}
        {hasPlanLinks ? (
          <>
            <Button
              onClick={() => {
                this.setState({ showPlanLinks: !showPlanLinks });
              }}
              className="tm-popup-plans"
            >
              {t('Bahnhofpläne')}
            </Button>
            <div
              className={`tm-bahnhofplan-links${
                showPlanLinks ? ' tm-visible' : ''
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  language: state.app.language,
});

NetzkartePopup.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(NetzkartePopup);
