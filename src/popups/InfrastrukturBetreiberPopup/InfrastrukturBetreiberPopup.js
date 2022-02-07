import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
// import { Layer } from 'mobility-toolbox-js/ol';
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
      padding: '5px 0',
    },
  };
});

// const getUrl = () =>

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  // layer: PropTypes.oneOfType([
  //   PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  //   PropTypes.instanceOf(Layer),
  // ]).isRequired,
  // coordinate: PropTypes.oneOfType([
  //   PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  //   PropTypes.arrayOf(PropTypes.number),
  // ]).isRequired,
};

const InfrastrukturBetreiberPopup = ({ feature }) => {
  const classes = useStyles();
  const properties = feature.getProperties();
  const {
    isb_tu_name: name,
    phone_isb: phone,
    mail_isb: mail,
  } = feature.getProperties();
  const { i18n } = useTranslation();
  const links = Object.keys(properties).filter((key) => /url_isb_/.test(key));
  const linkUrl =
    properties[`url_isb_${i18n.language}`] ||
    properties[links.find((key) => !!properties[key])]; // If there is no link in the current language default to first defined
  // console.log(properties);
  return (
    <div>
      <div className={classes.row}>
        {linkUrl && <Link href={linkUrl}>{name}</Link>}
      </div>
      <div className={classes.row}>
        <img src={phoneIcon} alt="Phone" />
        <a href={`tel:${phone}`}>{phone}</a>
      </div>
      <div className={classes.row}>
        <img src={mailIcon} alt="Mail" />
        <a href={`mailto:${mail}`}>{mail}</a>
      </div>
    </div>
  );
};

InfrastrukturBetreiberPopup.propTypes = propTypes;
InfrastrukturBetreiberPopup.renderTitle = (feat, t) => {
  const lineNumber = feat.get('line_number');
  const manager = feat.get('isb_tu_name');
  return `${manager} ${t('linie')}: ${lineNumber}`;
};

export default InfrastrukturBetreiberPopup;
