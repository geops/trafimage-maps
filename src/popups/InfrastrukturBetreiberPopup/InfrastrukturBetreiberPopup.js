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

const urlIsDefined = (url) => !!url;

const getUrls = (properties, language) => {
  let urls = JSON.parse(properties[`url_isb_${language}`]);
  if (urls.some(urlIsDefined)) {
    return urls.filter(urlIsDefined);
  }
  // If there are no urls in the current language default to first defined
  const linkKeys = Object.keys(properties).filter((key) =>
    /url_isb_/.test(key),
  );
  urls = JSON.parse(
    properties[
      linkKeys.find((key) => JSON.parse(properties[key]).some(urlIsDefined))
    ],
  );
  return urls.filter(urlIsDefined);
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
  const { i18n, t } = useTranslation();
  const properties = feature.getProperties();
  const {
    phone_isb: phone,
    mail_isb: mail,
    isb_tu_name: operator,
  } = feature.getProperties();
  const urls = getUrls(properties, i18n.language);
  const mainUrl = urls[0];
  const secondaryUrl = urls[1];

  useEffect(() => {
    if (layer) {
      layer.select([feature]);
    }
  }, [layer, feature]);

  return (
    <div>
      <div className={classes.row}>
        {`${t('bei')} ${t(layer.get('shortToLongName')[operator])}`}
      </div>
      {operator && (
        <div className={classes.row}>
          {mainUrl ? (
            <Link href={mainUrl}>{t('zur Webseite von', { operator })}</Link>
          ) : (
            <strong> {operator}</strong>
          )}
        </div>
      )}
      {secondaryUrl && (
        <div className={classes.row}>
          <Link href={secondaryUrl}>
            {t('weitere Informationen von', { operator })}
          </Link>
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
InfrastrukturBetreiberPopup.renderTitle = (feat, t) => {
  return t('Informationen zum Netzzugang bei');
};
export default InfrastrukturBetreiberPopup;
