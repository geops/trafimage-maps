/* eslint-disable no-param-reassign */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Feature } from 'ol';
import GeometryType from 'ol/geom/GeometryType';
import { Divider, MenuItem, Tab, Tabs, Typography } from '@material-ui/core';
import Select from '../../components/Select/Select';
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
      minHeight: 65,
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
        backgroundColor: 'white',
      },
    },
    segmentIcon: {
      '&::before': {
        position: 'absolute',
        content: '"•"',
        top: 3,
        left: -2,
      },
      '&::after': {
        position: 'absolute',
        content: '"•"',
        top: 3,
        right: -2,
      },
      fontSize: 18,
      position: 'relative',
      borderBottom: '1px solid black',
      width: '60%',
      height: '52%',
      transform: 'rotate(-45deg)',
      marginLeft: 6,
      marginTop: -2,
      transformOrigin: 'bottom',
    },
  };
});

const TABS = ['asset_management', 'intervention', 'sicherheitsrelevant'];
const SICHERHEITSRELEVANT_CATEGORIES = [
  'schalt_erd_berechtigt',
  'sachverstaendig',
  'instruiert',
];

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

const InterventionPersonCard = ({ person, segments }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <PersonCard
      name={person.name}
      email={person.email}
      phone={person.phone}
      division={person.division}
      otherDetails={
        segments &&
        segments.length && [
          {
            id: 'segments',
            label: segments.join(', '),
            icon: (
              <div
                title={t('Liniensegmente')}
                className={classes.segmentIcon}
              />
            ),
          },
        ]
      }
    />
  );
};

InterventionPersonCard.propTypes = {
  person: PropTypes.shape(PersonCard.propTypes).isRequired,
  segments: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
};

const validatedParseProperty = (feature, property) => {
  return feature.get(property) && JSON.parse(feature.get(property));
};

const renderSicherheitsrelevantPersons = (sbbPersons, externalPersons) => {
  return [...(sbbPersons || []), ...(externalPersons || [])].map((person) => (
    <PersonCard
      key={person.name}
      name={person.name}
      email={person.email}
      phone={person.phone}
      division={person.division}
    />
  ));
};

const EnergiePopup = ({ feature }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const permissionInfos = useSelector((state) => state.app.permissionInfos);

  // General Info
  const kategorie = feature.get('kategorie');
  const unterkategorie = feature.get('unterkategorie');
  const trassennummer = feature.get('trassennummer');
  const losNr = feature.get('los_nr');
  const description = useMemo(
    () =>
      feature.getGeometry().getType() === GeometryType.POINT
        ? `${feature.get('bezeichnung')} (${feature.get('anlage_id')})`
        : feature.get('bezeichnung'),
    [feature],
  );

  // Asset management
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

  // Intervention
  const interventionPikettNummer = feature.get('intervention_pikettnummer');
  const interventionPikettNummerDetail = feature.get(
    'intervention_pikettnummer_detail',
  );
  const interventionMail = feature.get('intervention_mail');
  const interventionMailDetail = feature.get('intervention_mail_detail');
  const interventionBemerkungen = feature.get('intervention_bemerkungen');
  const interventionExternePersonen = validatedParseProperty(
    feature,
    'intervention_energie_persons',
  );
  const interventionSbbPersonen = validatedParseProperty(
    feature,
    'intervention_persons',
  );

  // Sicherheitsrelevant
  const sicherheitsrelevantInstruiertExternalPersons = validatedParseProperty(
    feature,
    'sicherheitsrelevant_instruiert_energie_persons',
  );
  const sicherheitsrelevantInstruiertSbbPersons = validatedParseProperty(
    feature,
    'sicherheitsrelevant_instruiert_persons',
  );
  const sicherheitsrelevantSachverstaendigExternalPersons =
    validatedParseProperty(
      feature,
      'sicherheitsrelevant_sachverstaendige_energie_persons',
    );
  const sicherheitsrelevantSachverstaendigSbbPersons = validatedParseProperty(
    feature,
    'sicherheitsrelevant_sachverstaendige_persons',
  );
  const sicherheitsrelevantSchaltErdExternalPersons = validatedParseProperty(
    feature,
    'sicherheitsrelevant_schalt_erd_berechtigt_energie_persons',
  );
  const sicherheitsrelevantSchaltErdSbbPersons = validatedParseProperty(
    feature,
    'sicherheitsrelevant_schalt_erd_berechtigt_persons',
  );

  const [tab, setTab] = useState(TABS[0]);
  const [sicherheitActiveCat, setSicherheitActiveCat] = useState(
    SICHERHEITSRELEVANT_CATEGORIES[0],
  );
  const handleChange = (event, newTab) => setTab(TABS[newTab]);

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
        <>
          <Tabs
            value={TABS.indexOf(tab)}
            onChange={handleChange}
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab className={classes.tab} label={t('asset_management')} />
            <Tab className={classes.tab} label={t('intervention')} />
            <Tab className={classes.tab} label={t('sicherheitsrelevant')} />
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
                  <Typography paragraph>
                    <span>
                      <b>{t('Pikettnummer')}: </b>
                      {interventionPikettNummer}
                    </span>
                    {interventionPikettNummerDetail && (
                      <>
                        <br />
                        {interventionPikettNummerDetail}
                      </>
                    )}
                  </Typography>
                )}
                {interventionMail && (
                  <Typography paragraph>
                    <b>{t('E-Mail')}: </b>
                    <a href={`mailto:${interventionMail}`}>
                      {interventionMail}
                    </a>
                    {interventionMailDetail && (
                      <>
                        <br />
                        {interventionMailDetail}
                      </>
                    )}
                  </Typography>
                )}
                {interventionBemerkungen && (
                  <Typography paragraph>{interventionBemerkungen}</Typography>
                )}
                {interventionSbbPersonen?.map((sbbPerson) => {
                  const { person, linienabschnitte } = sbbPerson;
                  return (
                    <InterventionPersonCard
                      key={person.name}
                      person={person}
                      segments={linienabschnitte}
                    />
                  );
                })}
                {interventionExternePersonen?.map((externalPerson) => {
                  const { energie_person: person, linienabschnitte } =
                    externalPerson;
                  return (
                    <InterventionPersonCard
                      key={person.name}
                      person={person}
                      segments={linienabschnitte}
                    />
                  );
                })}
              </>
            )}
            {tab === TABS[2] && (
              <>
                <Select
                  value={sicherheitActiveCat}
                  onChange={(evt) => setSicherheitActiveCat(evt.target.value)}
                  fullWidth
                  MenuProps={{ marginThreshold: 0 }}
                  data-cy="sicherheitsrelevant-category-select"
                >
                  {[...SICHERHEITSRELEVANT_CATEGORIES].map((value) => {
                    return (
                      <MenuItem
                        key={value}
                        value={value}
                        className={classes.menuItem}
                        title={t(value)}
                        data-cy={`av-role-option-${value}`}
                      >
                        {t(value)}
                      </MenuItem>
                    );
                  })}
                </Select>
                {sicherheitActiveCat === SICHERHEITSRELEVANT_CATEGORIES[0]
                  ? renderSicherheitsrelevantPersons(
                      sicherheitsrelevantSachverstaendigSbbPersons,
                      sicherheitsrelevantSachverstaendigExternalPersons,
                    )
                  : null}
                {sicherheitActiveCat === SICHERHEITSRELEVANT_CATEGORIES[1]
                  ? renderSicherheitsrelevantPersons(
                      sicherheitsrelevantSchaltErdSbbPersons,
                      sicherheitsrelevantSchaltErdExternalPersons,
                    )
                  : null}
                {sicherheitActiveCat === SICHERHEITSRELEVANT_CATEGORIES[2]
                  ? renderSicherheitsrelevantPersons(
                      sicherheitsrelevantInstruiertSbbPersons,
                      sicherheitsrelevantInstruiertExternalPersons,
                    )
                  : null}
              </>
            )}
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
