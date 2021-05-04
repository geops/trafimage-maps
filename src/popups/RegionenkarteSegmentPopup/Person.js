import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    '& > div:first-child': {
      fontWeight: 'bold',
    },
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

function Person({ isIntern, person }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { name, phone, email, division, unterrolle, kommentar } = person;

  return (
    <div className={classes.root}>
      {!name && <i>{t('Information nicht verfügbar')}</i>}
      {name && (
        <>
          {unterrolle && <div>{`${unterrolle} ${kommentar}`}</div>}
          <div>{name}</div>
          {division && <div>{division}</div>}
          {phone && <div>{blockSkype(phone)}</div>}
          {isIntern && email && (
            <div>
              <a href={`mailto:${email.toLowerCase()}`}>
                {email.toLowerCase()}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

Person.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    division: PropTypes.string,
    unterrolle: PropTypes.string,
    kommentar: PropTypes.string,
  }),
  isIntern: PropTypes.bool.isRequired,
};

Person.defaultProps = {
  person: {},
};

export default Person;
