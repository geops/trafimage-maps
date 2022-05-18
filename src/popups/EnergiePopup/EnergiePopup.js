/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Feature } from 'ol';
import GeometryType from 'ol/geom/GeometryType';
import { Divider, Typography } from '@material-ui/core';
import { energieleitungenColorMapping } from '../../utils/constants';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

import PersonCard from '../../components/PersonCard';

const useStyles = makeStyles((theme) => {
  return {
    title: {
      padding: '8px 0',
      fontFamily: ['SBBWeb-Bold', 'Arial', 'sans-serif'],
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
    },
    subtitle: {
      color: theme.palette.text.secondary,
    },
    icon: {
      backgroundColor: 'black',
      display: 'inline-block',
    },
    unterwerk: {
      backgroundColor: 'black',
      width: '10px',
      height: '10px',
      display: 'inline-block',
      flex: '0 0 10px',
    },
    produktionsanlage: {
      width: '7px',
      height: '7px',
      borderRadius: '8px',
      border: '2px solid white',
      outline: '1.5px solid black',
      flex: '0 0 7px',
    },
    divider: {
      margin: '10px 0',
    },
  };
});

export const EnergiePopupSubtitle = ({ kategorie, unterkategorie, label }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return kategorie ? (
    <div className={classes.title}>
      {kategorie === 'UW' && (
        <>
          <div className={`${classes.unterwerk} ${classes.icon}`} />
          <div className={classes.label}>
            {capitalizeFirstLetter(label || t('Unterwerk'))}
            {unterkategorie ? (
              <span className={classes.subtitle}>
                {' - '}
                {t(`${unterkategorie}`)}
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      )}
      {kategorie === 'KW' && (
        <>
          <div className={`${classes.produktionsanlage} ${classes.icon}`} />
          <div className={classes.label}>
            {capitalizeFirstLetter(label || t('Produktionsanlage'))}
            {unterkategorie ? (
              <span className={classes.subtitle}>
                {' - '}
                {t(`${unterkategorie}`)}
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </div>
  ) : null;
};

EnergiePopupSubtitle.propTypes = {
  kategorie: PropTypes.string,
  unterkategorie: PropTypes.string,
  label: PropTypes.string,
};

EnergiePopupSubtitle.defaultProps = {
  kategorie: undefined,
  unterkategorie: undefined,
  label: undefined,
};

const EnergiePopup = ({ feature }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const permissionInfos = useSelector((state) => state.app.permissionInfos);
  const description = useMemo(
    () =>
      feature.getGeometry().getType() === GeometryType.POINT
        ? `${feature.get('bezeichnung')} (${feature.get('anlage_id')})`
        : feature.get('bezeichnung'),
    [feature],
  );
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
  const lifeCycleManager = useMemo(
    () =>
      feature.get('life_cycle_manager') &&
      JSON.parse(feature.get('life_cycle_manager')),
    [feature],
  );
  const intervention = useMemo(
    () =>
      feature.get('intervention') && JSON.parse(feature.get('intervention')),
    [feature],
  );
  const schaltErdBerechtigung = useMemo(
    () =>
      feature.get('schalt_erd_berechtigung') &&
      JSON.parse(feature.get('schalt_erd_berechtigung')),
    [feature],
  );
  const kategorie = feature.get('kategorie');
  const unterkategorie = feature.get('unterkategorie');
  const trassennummer = feature.get('trassennummer');
  const losNr = feature.get('los_nr');

  return (
    <div>
      {kategorie ? (
        <EnergiePopupSubtitle
          kategorie={kategorie}
          unterkategorie={unterkategorie}
        />
      ) : (
        <Typography className={classes.title}>
          <b>{t('Übertragungsleitung')}</b>
        </Typography>
      )}
      <Divider className={classes.divider} />
      <Typography>
        {trassennummer ? (
          <b style={{ color: energieleitungenColorMapping[`los${losNr}`] }}>
            {trassennummer}{' '}
          </b>
        ) : (
          ''
        )}
        {description}
      </Typography>
      {permissionInfos?.user && activeTopic.permission === 'sbb' ? (
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
          {lifeCycleManager && (
            <PersonCard
              title={t('Life-Cycle Manager')}
              name={lifeCycleManager.name}
              email={lifeCycleManager.email}
              phone={lifeCycleManager.phone}
              division={lifeCycleManager.division}
            />
          )}
          {intervention && (
            <PersonCard
              title={t('Intervention')}
              name={intervention.name}
              email={intervention.email}
              phone={intervention.phone}
              division={intervention.division}
            />
          )}
          {schaltErdBerechtigung && (
            <PersonCard
              title={t('Schalt- und Erdberechtigung')}
              name={schaltErdBerechtigung.name}
              email={schaltErdBerechtigung.email}
              phone={schaltErdBerechtigung.phone}
              division={schaltErdBerechtigung.division}
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

EnergiePopup.renderTitle = (feat, layer, t) => t('Detailinformation');
export default EnergiePopup;
