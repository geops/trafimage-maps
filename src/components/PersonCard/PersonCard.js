import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { ReactComponent as PhoneIcon } from '../../img/phone.svg';
import { ReactComponent as MailIcon } from '../../img/mail.svg';
import { ReactComponent as PersonIcon } from '../../img/person.svg';

const useStyles = makeStyles((theme) => {
  return {
    row: {
      minWidth: 250,
      alignItems: 'center',
      display: 'flex',
    },
    icon: {
      height: 24,
      width: 24,
      marginRight: 5,
      '& svg': {
        height: '100%',
        width: '100%',
      },
    },
    card: {
      flex: 1,
      border: '1px solid #ddd',
      padding: theme.spacing(1),
      margin: `${theme.spacing(1)}px 0`,
      borderRadius: 2,
    },
  };
});

const PersonCard = ({
  title,
  name,
  email,
  phone,
  division,
  otherDetails,
  className,
}) => {
  const classes = useStyles();
  return (
    <div
      key={`${title}-${name}`}
      className={`wkp-person-card ${classes.card}${` ${className}` || ''}`}
    >
      {title && <Typography paragraph>{title}</Typography>}
      {name && (
        <div className={classes.row}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            <PersonIcon />
          </div>
          <Typography>{`${name} ${
            division ? ` (${division})` : ''
          }`}</Typography>
        </div>
      )}
      {phone && (
        <div className={classes.row}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            <PhoneIcon />
          </div>
          <Typography>
            <a href={`tel:${phone}`}>{phone || '-'}</a>
          </Typography>
        </div>
      )}
      {email && (
        <div className={classes.row}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            <MailIcon />
          </div>
          <Typography>
            <a href={`mailto:${email}`}>{(email || '-').toLowerCase()}</a>
          </Typography>
        </div>
      )}
      {(otherDetails || []).map((detail) => (
        <div className={classes.row} key={detail.id}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            {detail.icon}
          </div>
          <Typography>{detail.label}</Typography>
        </div>
      ))}
    </div>
  );
};

PersonCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.node,
  email: PropTypes.string,
  phone: PropTypes.string,
  division: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  otherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.element.isRequired,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.element,
        PropTypes.number,
      ]).isRequired,
    }),
  ),
  className: PropTypes.string,
};

PersonCard.defaultProps = {
  title: undefined,
  email: undefined,
  phone: undefined,
  division: undefined,
  otherDetails: [],
  className: undefined,
};

export default PersonCard;
