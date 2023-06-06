/* eslint-disable no-param-reassign */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Feature } from 'ol';
import GeometryType from 'ol/geom/GeometryType';
import { Divider, Tab, Tabs, Typography } from '@material-ui/core';
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
    tabPanel: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      borderTop: '1px solid #dddddd',
      marginTop: -1,
    },
    tabs: {
      '& .MuiTabs-indicator': {
        backgroundColor: 'transparent',
      },
    },
    tab: {
      minWidth: 0,
      marginLeft: 2,
      marginRight: 2,
      marginBottom: -1,
      border: '1px solid #dddddd',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      textTransform: 'none',
      '&:first-child': {
        marginLeft: theme.spacing(2),
      },
      '&:last-child': {
        marginRight: theme.spacing(2),
      },
      '&:hover': {
        color: theme.palette.secondary.dark,
      },
      '&.Mui-selected': {
        borderBottomColor: 'white',
      },
    },
  };
});

const TABS = ['asset_management', 'intervention', 'sicherheitsrelevant'];

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
                {t(`${unterkategorie.trim()}`)}
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
                {t(`${unterkategorie.trim()}`)}
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
  // const schaltErdBerechtigung = useMemo(
  //   () =>
  //     feature.get('schalt_erd_berechtigung') &&
  //     JSON.parse(feature.get('schalt_erd_berechtigung')),
  //   [feature],
  // );
  const kategorie = feature.get('kategorie');
  const unterkategorie = feature.get('unterkategorie');
  const trassennummer = feature.get('trassennummer');
  const losNr = feature.get('los_nr');
  const interventionPikettNummer = feature.get('intervention_pikettnummer');
  const interventionPikettNummerDetail = feature.get(
    'intervention_pikettnummer_detail',
  );
  const interventionMail = feature.get('intervention_mail');
  // const interventionMailDetail = feature.get('intervention_mail_detail');
  // const interventionBemerkungen = feature.get('intervention_bemerkungen');
  const interventionExternePersonen = JSON.parse(
    feature.get('intervention_energie_persons'),
  );
  const interventionSbbPersonen = JSON.parse(
    feature.get('intervention_persons'),
  );
  console.log(interventionExternePersonen, interventionSbbPersonen);
  // const losNr = feature.get('los_nr');
  const [tab, setTab] = useState(TABS[0]);
  const handleChange = (event, newTab) => {
    setTab(TABS[newTab]);
  };

  const mainInfo = useMemo(() => {
    return (
      <>
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
      </>
    );
  }, [
    kategorie,
    unterkategorie,
    classes,
    t,
    trassennummer,
    losNr,
    description,
  ]);

  return (
    <div>
      {!(permissionInfos?.user && activeTopic.permission === 'sbb') ? (
        // <div>
        //   {intervention && (
        //     <PersonCard
        //       title={t('Intervention')}
        //       name={intervention.name}
        //       email={intervention.email}
        //       phone={intervention.phone}
        //       division={intervention.division}
        //     />
        //   )}
        //   {schaltErdBerechtigung && (
        //     <PersonCard
        //       title={t('Schalt- und Erdberechtigung')}
        //       name={schaltErdBerechtigung.name}
        //       email={schaltErdBerechtigung.email}
        //       phone={schaltErdBerechtigung.phone}
        //       division={schaltErdBerechtigung.division}
        //     />
        //   )}
        // </div>
        <>
          <Tabs
            value={TABS.indexOf(tab)}
            onChange={handleChange}
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab className={classes.tab} label={t('Asset Management')} />
            <Tab className={classes.tab} label={t('Intervention')} />
            <Tab className={classes.tab} label={t('Sicherheits- relevant')} />
          </Tabs>
          <div className={classes.tabPanel}>
            {mainInfo}
            <br />
            {tab === TABS[0] && (
              <>
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
              </>
            )}
            {tab === TABS[1] && (
              <>
                {interventionPikettNummer && (
                  <p>
                    {`${t('Pikettnummer')}: ${interventionPikettNummer}`}
                    {interventionPikettNummerDetail && (
                      <>
                        <br />
                        {interventionPikettNummerDetail}
                      </>
                    )}
                  </p>
                )}
                {interventionMail && (
                  <p>{`${t('Pikettnummer')}: ${interventionPikettNummer}`}</p>
                )}
              </>
            )}
            {tab === TABS[2] && <span>Sicherheitsrelevant</span>}
          </div>
        </>
      ) : (
        <>
          {mainInfo}
          <p>
            <a
              href="mailto:trassensicherung-energie@sbb.ch"
              rel="noopener noreferrer"
              target="_blank"
            >
              trassensicherung-energie@sbb.ch
            </a>
          </p>
        </>
      )}
    </div>
  );
};

EnergiePopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

EnergiePopup.renderTitle = (feat, layer, t) => t('Detailinformationen');
export default EnergiePopup;
