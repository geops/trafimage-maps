import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles, Select, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import Person from './Person';
import Line from './Line';

const useStyles = makeStyles((theme) => ({
  description: {
    flex: '0 0',
    '& > div:first-child': {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const roles = [
  'leiter_region',
  'leiter_kbn',
  'leiter_natur',
  'leiter_fahrweg',
  'mitarbeitende_natur',
  'mitarbeitende_fahrweg',
];

// The old WKP had different roles. These roles are used for translations.
const oldRoles = [
  'Leiter Region',
  'Leiter KBN',
  'Leiter Natur',
  'Leiter FW TEC',
  'Mitarbeitende KBN',
  'Mitarbeitende FW TEC',
];

const PERMALINK_PARAM = 'regionRole';

const getRoleFromPermalinkParam = (param) => {
  const idx = oldRoles.indexOf(param);
  if (idx > -1) {
    return roles[idx];
  }
};

const getPermalinkParamFromRole = (role) => {
  const idx = roles.indexOf(role);
  if (idx > -1) {
    return oldRoles[idx];
  }
};

function Region({ feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const parsed = qs.parseUrl(window.location.href);
  const orderedRoles = [...roles].sort((a, b) =>
    t(oldRoles[roles.indexOf(a)]) < t(oldRoles[roles.indexOf(b)]) ? -1 : 1,
  );
  const [role, setRole] = useState(
    getRoleFromPermalinkParam(parsed.query[PERMALINK_PARAM]) || orderedRoles[0],
  );
  const str = feature.get(role);
  const person = (str && JSON.parse(str)) || {};

  useEffect(() => {
    if (role !== parsed.query[PERMALINK_PARAM]) {
      parsed.query[PERMALINK_PARAM] = getPermalinkParamFromRole(role);
      window.history.replaceState(
        undefined,
        undefined,
        `?${qs.stringify(parsed.query)}`,
      );
    }
  }, [parsed, role]);

  return (
    <>
      <Line feature={feature} />
      <div className={classes.description}>
        <div>
          <Select
            value={role}
            fullWidth
            onChange={(evt) => setRole(evt.target.value)}
          >
            {orderedRoles.map((value) => {
              return (
                <MenuItem key={value} value={value}>
                  {t(oldRoles[roles.indexOf(value)])}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
      {(Array.isArray(person) ? person : [person])
        .sort(
          (
            { unterrolle: unterrolleA, kommentar: kommentarA, name: nameA },
            { unterrolle: unterrolleB, kommentar: kommentarB, name: nameB },
          ) => {
            // First, persons with unterolle, then persons without.
            if (unterrolleA || unterrolleB) {
              if (!unterrolleA || !unterrolleB) {
                return unterrolleA < unterrolleB ? 1 : -1;
              }
              if (kommentarA || kommentarB) {
                return `${unterrolleA} ${kommentarA}` <
                  `${unterrolleB} ${kommentarB}`
                  ? -1
                  : 1;
              }
              return unterrolleA < unterrolleB ? -1 : 1;
            }
            return nameA < nameB ? -1 : 1;
          },
        )
        .map((data) => (
          <Person key={JSON.stringify(data)} person={data} isIntern />
        ))}
    </>
  );
}

Region.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

export default Region;
