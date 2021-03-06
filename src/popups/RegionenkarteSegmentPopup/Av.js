import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { makeStyles, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import SBBSelect from '../../components/Select/SBBSelect';
import Person from './Person';
import Line from './Line';
import LineData from './LineData';

const useStyles = makeStyles((theme) => ({
  description: {
    flex: '0 0',
    '& > div:first-child': {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const roles = [
  'av_bnb',
  'av_fahrbahn',
  'av_fahrstrom',
  'av_ingenieurbau',
  'av_natur',
  'av_bzu',
  'av_wasser',
  'av_abwasser',
];

const PERMALINK_PARAM = 'anlagegattung';

function Av({ layer, feature, onChangeRole }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const cartaroUrl = useSelector((state) => state.app.cartaroUrl);
  const accessType = layer.get('accessType') || 'public';
  const isIntern = accessType === 'intern';
  const parsed = qs.parseUrl(window.location.href);
  const permalinkParam = parsed.query[PERMALINK_PARAM];
  const [role, setRole] = useState(
    (roles.includes(permalinkParam) && permalinkParam) || roles[0],
  );
  const [person, setPerson] = useState();
  const [lineData, setLineData] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    const str = feature.get(role);
    const newPerson = str && JSON.parse(str);
    setPerson(newPerson);

    if (newPerson && newPerson.email) {
      fetch(
        `${cartaroUrl}anlagenverantwortliche/items/other_lines/?role=${
          role.split('_')[1]
        }&email=${newPerson.email}&format=json`,
        {
          signal: abortController.signal,
        },
      )
        .then((resp) => resp.json())
        .then((newLineData) => {
          setLineData(newLineData);
        })
        .catch((err) => {
          if (err && err.name === 'AbortError') {
            // ignore user abort request
          } else {
            setLineData([]);
          }
        });
    } else {
      setLineData([]);
    }

    return () => {
      abortController.abort();
    };
  }, [cartaroUrl, feature, role]);

  useEffect(() => {
    if (isIntern && role !== parsed.query[PERMALINK_PARAM]) {
      parsed.query[PERMALINK_PARAM] = role;
      window.history.replaceState(
        undefined,
        undefined,
        `?${qs.stringify(parsed.query)}`,
      );
      onChangeRole(role);
    } else if (!isIntern) {
      onChangeRole(role);
    }
  }, [parsed, role, onChangeRole, isIntern]);

  return (
    <>
      <Line feature={feature} />
      <div className={classes.description}>
        <div>
          {isIntern && (
            <SBBSelect
              value={role}
              onChange={(evt) => setRole(evt.target.value)}
              fullWidth
            >
              {[...roles]
                .sort((a, b) => (t(a) < t(b) ? -1 : 1))
                .map((value) => {
                  return (
                    <MenuItem key={value} value={value}>
                      {t(value)}
                    </MenuItem>
                  );
                })}
            </SBBSelect>
          )}
          {!isIntern && (
            <b>{t(role === 'av_bnb' ? 'Koordinator Bahnnahes Bauen' : 'Av')}</b>
          )}
        </div>
      </div>
      <Person person={person} isIntern={isIntern} />
      {lineData && <LineData lineData={lineData} />}
    </>
  );
}

Av.propTypes = {
  layer: PropTypes.instanceOf(Layer).isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
  onChangeRole: PropTypes.func.isRequired,
};

export default Av;
