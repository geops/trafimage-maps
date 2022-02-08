import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Layer } from 'mobility-toolbox-js/ol';
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
  if (properties[`url_isb_${language}`]) {
    return properties[`url_isb_${language}`];
  }
  const linkKeys = Object.keys(properties).filter((key) =>
    /url_isb_/.test(key),
  );
  // If there is no link in the current language default to first defined
  return properties[linkKeys.find((key) => !!properties[key])];
};

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  layer: PropTypes.instanceOf(Layer).isRequired,
};

const InfrastrukturBetreiberPopup = ({ feature, layer }) => {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const properties = feature.getProperties();
  const {
    phone_isb: phone,
    mail_isb: mail,
    isb_tu_name: operator,
  } = feature.getProperties();
  const linkUrl = getUrl(properties, i18n.language);

  useEffect(() => {
    if (layer) {
      layer.select([feature]);
    }
  }, [layer, feature]);

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
          <a href={`mailto:${mail}`} rel="noopener noreferrer" target="_blank">
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
