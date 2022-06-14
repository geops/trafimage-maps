import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import personIcon from '../../img/popups/NetzentwicklungPopup/person.svg';
import mailIcon from '../../img/popups/NetzentwicklungPopup/mail.svg';
import phoneIcon from '../../img/popups/NetzentwicklungPopup/phone.svg';

const useStyles = makeStyles((theme) => {
  return {
    row: {
      minWidth: 250,
      alignItems: 'center',
      display: 'flex',
      '& img': {
        height: 24,
        width: 24,
        marginRight: 5,
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
          <img src={personIcon} alt="Person" />
          <Typography>{`${name} ${
            division ? ` (${division})` : ''
          }`}</Typography>
        </div>
      )}
      {phone && (
        <div className={classes.row}>
          <img src={phoneIcon} alt="Phone" />
          <Typography>
            <a href={`tel:${phone}`}>{phone || '-'}</a>
          </Typography>
        </div>
      )}
      {email && (
        <div className={classes.row}>
          <img src={mailIcon} alt="Mail" />
          <Typography>
            <a href={`mailto:${email}`}>{(email || '-').toLowerCase()}</a>
          </Typography>
        </div>
      )}
      {otherDetails.map((detail) => (
        <div className={classes.row} key={detail.id}>
          <img src={detail.icon} alt={detail.id} />
          <Typography>{detail.label}</Typography>
        </div>
      ))}
    </div>
  );
};

PersonCard.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  phone: PropTypes.string,
  division: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  otherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.string.isRequired, // path to image
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
