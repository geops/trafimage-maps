import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { makeStyles, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import Select from '../../components/Select';
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
  menuItem: {
    width: (props) => props.selectWidth - 4,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
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
  'av_bahntechnik',
];

const PERMALINK_PARAM = 'anlagegattung';

function Av({ layer, feature, onChangeRole }) {
  const { t } = useTranslation();
  const cartaroUrl = useSelector((state) => state.app.cartaroUrl);
  const accessType = layer.get('accessType') || 'public';
  const isIntern = accessType === 'intern';
  const parsed = qs.parseUrl(window.location.href);
  const permalinkParam = parsed.query[PERMALINK_PARAM];
  const [role, setRole] = useState(
    isIntern
      ? (roles.includes(permalinkParam) && permalinkParam) || roles[0]
      : 'av_bnb',
  );
  const [person, setPerson] = useState();
  const [lineData, setLineData] = useState();
  const [selectWidth, setSelectWidth] = useState();
  const classes = useStyles({ selectWidth });

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
            return;
          }
          setLineData([]);
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
    }
    onChangeRole(role);
  }, [parsed, role, onChangeRole, isIntern]);

  return (
    <>
      <Line feature={feature} />
      <div
        className={classes.description}
        ref={(el) => setSelectWidth(el?.clientWidth)}
      >
        <div>
          {isIntern && (
            <Select
              value={role}
              onChange={(evt) => setRole(evt.target.value)}
              fullWidth
              MenuProps={{ marginThreshold: 0 }}
              data-cy="av-role-select"
            >
              {[...roles]
                .sort((a, b) => (t(a) < t(b) ? -1 : 1))
                .map((value) => {
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
          )}
          {!isIntern && (
            <b>{t(role === 'av_bnb' ? 'Koordinator Bahnnahes Bauen' : 'Av')}</b>
          )}
        </div>
      </div>
      <div>
        <Person person={person} isIntern={isIntern} />
      </div>
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
