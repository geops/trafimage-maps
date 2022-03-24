import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import personIcon from '../../img/popups/NetzentwicklungPopup/person.svg';
import mailIcon from '../../img/popups/NetzentwicklungPopup/mail.svg';
import phoneIcon from '../../img/popups/NetzentwicklungPopup/phone.svg';

const useStyles = makeStyles({
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
    padding: 8,
    margin: 8,
    borderRadius: 2,
    height: 'max-content',
  },
});

const PersonCard = ({ title, name, email, phone, division }) => {
  const classes = useStyles();
  return (
    <div key={title + name} className={classes.card}>
      <div>
        <b>{title}</b>
      </div>
      <br />
      {name && (
        <div className={classes.row}>
          <img src={personIcon} alt="Person" />
          <div>{`${name}${division ? ` (${division})` : ''}`}</div>
        </div>
      )}
      {phone && (
        <div className={classes.row}>
          <img src={phoneIcon} alt="Phone" />
          <a href={`tel:${phone}`}>{phone || '-'}</a>
        </div>
      )}
      {email && (
        <div className={classes.row}>
          <img src={mailIcon} alt="Mail" />
          <a href={`mailto:${email}`}>{(email || '-').toLowerCase()}</a>
        </div>
      )}
    </div>
  );
};

PersonCard.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  phone: PropTypes.string,
  division: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PersonCard.defaultProps = {
  email: undefined,
  phone: undefined,
  division: undefined,
};

export default PersonCard;
