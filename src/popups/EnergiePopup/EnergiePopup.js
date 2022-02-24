/* eslint-disable no-param-reassign */
import { Feature } from 'ol';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import GeometryType from 'ol/geom/GeometryType';
import React, { useMemo } from 'react';

import PersonCard from '../../components/PersonCard';

const EnergiePopup = ({ feature }) => {
  const { t } = useTranslation();
  const anlageEigner = useMemo(
    () =>
      feature.get('anlageeigner') && JSON.parse(feature.get('anlageeigner')),
    [feature],
  );
  const betriebInstandhaltung = useMemo(
    () =>
      feature.get('betrieb_instandhaltung') &&
      JSON.parse(feature.get('betrieb_instandhaltung')),
    [feature],
  );
  const lifeCycleManagerJson = useMemo(
    () =>
      feature.get('life_cycle_manager') &&
      JSON.parse(feature.get('life_cycle_manager')),
    [feature],
  );

  return (
    <div>
      <div>
        {anlageEigner && (
          <PersonCard
            role={t('Anlageeigner')}
            name={anlageEigner.name}
            email={anlageEigner.email}
            phone={anlageEigner.phone}
            division={anlageEigner.division}
          />
        )}
        {betriebInstandhaltung && (
          <PersonCard
            role={t('Verantwortlich Betrieb und Instandhaltung')}
            name={betriebInstandhaltung.name}
            email={betriebInstandhaltung.email}
            phone={betriebInstandhaltung.phone}
            division={betriebInstandhaltung.division}
          />
        )}
        {lifeCycleManagerJson && (
          <PersonCard
            role={t('Life-Cycle-Manager')}
            name={lifeCycleManagerJson.name}
            email={lifeCycleManagerJson.email}
            phone={lifeCycleManagerJson.phone}
            division={lifeCycleManagerJson.division}
          />
        )}
      </div>
    </div>
  );
};

EnergiePopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

EnergiePopup.renderTitle = (feat) =>
  feat.getGeometry().getType() === GeometryType.POINT
    ? `${feat.get('bezeichnung')} (${feat.get('anlage_id')})`
    : feat.get('bezeichnung');
export default EnergiePopup;
