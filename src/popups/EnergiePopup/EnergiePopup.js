/* eslint-disable no-param-reassign */
import { makeStyles } from '@material-ui/core/styles';
import { Feature } from 'ol';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import GeometryType from 'ol/geom/GeometryType';
import React, { useMemo } from 'react';

import PersonCard from '../../components/PersonCard';

const useStyles = makeStyles({
  subtitle: {
    padding: 8,
    fontFamily: ['SBBWeb-Bold', 'Arial', 'sans-serif'],
  },
  unterwerk: {
    backgroundColor: 'black',
    marginRight: '10px',
    width: '10px',
    height: '10px',
    display: 'inline-block',
  },
  produktionsanlage: {
    width: '7px',
    height: '7px',
    display: 'inline-block',
    marginRight: '10px',
    backgroundColor: 'black',
    borderRadius: '8px',
    border: '2px solid white',
    outline: '1.5px solid black',
  },
});

export const EnergiePopupSubtitle = ({ kategorie }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return kategorie ? (
    <div className={classes.subtitle}>
      {kategorie === 'UW' && (
        <>
          <div className={classes.unterwerk} />
          {t('ch.sbb.energie.unterwerk')}
        </>
      )}
      {kategorie === 'KW' && (
        <>
          <div className={classes.produktionsanlage} />
          {t('ch.sbb.energie.produktionsanlage')}
        </>
      )}
    </div>
  ) : null;
};

EnergiePopupSubtitle.propTypes = {
  kategorie: PropTypes.string,
};

EnergiePopupSubtitle.defaultProps = {
  kategorie: undefined,
};

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
  const kategorie = feature.get('kategorie');

  return (
    <div>
      <EnergiePopupSubtitle kategorie={kategorie} />
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
