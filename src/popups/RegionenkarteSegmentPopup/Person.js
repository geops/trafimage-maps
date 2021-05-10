import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PhoneIcon } from './icons/phone.svg';
import { ReactComponent as MailIcon } from './icons/mail.svg';

const useStyles = makeStyles({
  contact: {
    padding: `4px 0`,
    display: 'flex',
    alignItems: 'center',

    '& a': {
      textDecoration: 'none !important',
    },

    '& svg': {
      width: 30,
    },
  },
});

const formatPhone = (phone) => {
  try {
    return phone
      .split(/(\+41)(\d{2})(\d{3})(\d{2})(\d{2})/g)
      .join(' ')
      .trim();
  } catch (e) {
    return phone;
  }
};

function Person({ isIntern, person }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { name, phone, email, division, unterrolle, kommentar } = person;

  return (
    <div>
      {!name && <i>{t('Information nicht verfügbar')}</i>}
      {name && (
        <>
          {unterrolle && (
            <div className={classes.contact}>
              {`${unterrolle} ${kommentar}`}
            </div>
          )}
          <div className={classes.contact}>
            {name}
            {division && ` (${division})`}
          </div>
          {phone && (
            <div className={classes.contact}>
              <PhoneIcon />
              <a href={`tel:${phone}`}>{formatPhone(phone)}</a>
            </div>
          )}
          {isIntern && email && (
            <div className={classes.contact}>
              <MailIcon />
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
