import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Link from '../../components/Link';
import phoneIcon from '../../img/popups/NetzentwicklungPopup/phone.svg';
import mailIcon from '../../img/popups/NetzentwicklungPopup/mail.svg';

const useStyles = makeStyles(() => {
  return {
    row: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 15,
      padding: '5px 0',
      '& img': {
        paddingRight: 5,
      },
    },
  };
});

const getUrl = (properties, language) => {
  const linkKeys = Object.keys(properties).filter((key) =>
    /url_isb_/.test(key),
  );
  return (
    properties[`url_isb_${language}`] ||
    properties[linkKeys.find((key) => !!properties[key])] // If there is no link in the current language default to first defined
  );
};

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
};

const InfrastrukturBetreiberPopup = ({ feature }) => {
  const classes = useStyles();
  const properties = feature.getProperties();
  const {
    phone_isb: phone,
    mail_isb: mail,
    isb_tu_name: operator,
  } = feature.getProperties();
  const { i18n } = useTranslation();
  const linkUrl = getUrl(properties, i18n.language);

  return (
    <div>
      {operator && (
        <div className={classes.row}>
          {linkUrl ? (
            <Link href={linkUrl}>{operator}</Link>
          ) : (
            <strong> {operator}</strong>
          )}
        </div>
      )}
      {phone && (
        <div className={classes.row}>
          <img src={phoneIcon} alt="Phone" />
          <a href={`tel:${phone}`}>{phone}</a>
        </div>
      )}
      {mail && (
        <div className={classes.row}>
          <img src={mailIcon} alt="Mail" />
          <a href={`mailto:${mail}`} target="__blank">
            {mail}
          </a>
        </div>
      )}
    </div>
  );
};

InfrastrukturBetreiberPopup.propTypes = propTypes;
InfrastrukturBetreiberPopup.renderTitle = (feat, t) =>
  `${t('linie')} ${feat.get('line_number')}`;

export default InfrastrukturBetreiberPopup;
