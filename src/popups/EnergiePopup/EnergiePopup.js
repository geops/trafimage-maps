/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Feature } from 'ol';
import GeometryType from 'ol/geom/GeometryType';

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
  const permissionInfos = useSelector((state) => state.app.permissionInfos);
  const anlageBetreuer = useMemo(
    () =>
      feature.get('anlagebetreuer') &&
      JSON.parse(feature.get('anlagebetreuer')),
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
      {permissionInfos?.user ? (
        <div>
          {anlageBetreuer && (
            <PersonCard
              title={`AVANT/${t('Anlagebetreuer')}`}
              name={anlageBetreuer.name}
              email={anlageBetreuer.email}
              phone={anlageBetreuer.phone}
              division={anlageBetreuer.division}
            />
          )}
          {betriebInstandhaltung && (
            <PersonCard
              title={t('Verantwortlich Betrieb und Instandhaltung')}
              name={betriebInstandhaltung.name}
              email={betriebInstandhaltung.email}
              phone={betriebInstandhaltung.phone}
              division={betriebInstandhaltung.division}
            />
          )}
          {lifeCycleManagerJson && (
            <PersonCard
              title={t('Life-Cycle Manager')}
              name={lifeCycleManagerJson.name}
              email={lifeCycleManagerJson.email}
              phone={lifeCycleManagerJson.phone}
              division={lifeCycleManagerJson.division}
            />
          )}
        </div>
      ) : (
        <p>
          <a
            href="mailto:trassensicherung-energie@sbb.ch"
            rel="noopener noreferrer"
            target="_blank"
          >
            trassensicherung-energie@sbb.ch
          </a>
        </p>
      )}
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
