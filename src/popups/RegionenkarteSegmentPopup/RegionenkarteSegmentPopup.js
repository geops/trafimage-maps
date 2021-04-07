import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    paddingBottom: theme.spacing(2),
    flex: '0 0',
  },
  km: {
    paddingLeft: theme.spacing(1),
  },
  description: {
    flex: '0 0',
    '& > div:first-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  otherLines: {
    flex: '1 1',
    overflow: 'auto',
    border: '1px dashed #dddddd',
    margin: 0,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const blockSkype = (phone) => {
  const index = Math.ceil(phone.length / 2);
  return (
    <>
      <span>{phone.slice(0, index)}</span>
      <span>{phone.slice(index)}</span>
    </>
  );
};

function RegionenkarteSegmentPopup({ feature }) {
  const { t, i18n } = useTranslation();
  console.log(i18n.language);
  const classes = useStyles();
  const parsed = qs.parseUrl(window.location.href);
  const { anlagegattung = 'av_bnb' } = parsed.query;
  const {
    linie,
    bp_von: bpVon,
    bp_bis: bpBis,
    km_von: kmVon,
    km_bis: kmBis,
    [`${anlagegattung}_name`]: name,
    [`${anlagegattung}_organisation`]: organisation,
    [`${anlagegattung}_telefon`]: telefon,
    [`${anlagegattung}_email`]: email,
    [`${anlagegattung}_line_data`]: lineDataStr,
  } = feature.getProperties();
  const str = `[${lineDataStr.slice(1, lineDataStr.length - 1)}]`;
  const lineData = JSON.parse(str).map((obj) => {
    return JSON.parse(obj);
  });
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <div>
          {!!linie && `${t('Linie')} ${linie}, `}
          {bpVon && bpBis && `${t('BPs')} ${bpVon} - ${bpBis}`}
          {((bpVon && !bpBis) || (!bpVon && bpBis)) &&
            `${t('BP')} ${bpVon || bpBis}`}
        </div>
        <div className={classes.km}>{`km ${kmVon} - ${kmBis}`}</div>
      </div>

      <div className={classes.description}>
        <div>
          <b>
            {t(
              anlagegattung === 'av_bnb' ? 'Koordinator Bahnnahes Bauen' : 'Av',
            )}
          </b>
        </div>

        <div>
          {!name && <i>{t('Information nicht verfügbar')}</i>}
          {name && (
            <>
              <div>
                <b>{name}</b>
              </div>
              {organisation && <div>{organisation}</div>}
              {telefon && <div>{blockSkype(telefon)}</div>}
              {email && (
                <div>
                  <a href={`mailto:${email}`}>{`${email}`}</a>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <fieldset className={classes.otherLines}>
        <legend>{t('Linien')}</legend>
        {lineData && lineData.length ? (
          <div>
            {lineData.map((data) => {
              return (
                <div
                  key={`${data.linie}-${data.km_von}
                }-${data.km_bis}`}
                >{`${data.linie ? `${data.linie}, ` : ''}km ${data.km_von} - ${
                  data.km_bis
                }`}</div>
              );
            })}
          </div>
        ) : (
          <div>{t('Information nicht verfügbar')}</div>
        )}
      </fieldset>
    </div>
  );
}

RegionenkarteSegmentPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

RegionenkarteSegmentPopup.renderTitle = (feature, t) =>
  t('Detailinformationen');

export default RegionenkarteSegmentPopup;
