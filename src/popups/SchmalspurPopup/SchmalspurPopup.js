import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Link from '../../components/Link';
import phoneIcon from '../../img/popups/NetzentwicklungPopup/phone.svg';
import mailIcon from '../../img/popups/NetzentwicklungPopup/mail.svg';
import SchmalspurLayer from '../../layers/SchmalspurLayer';

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

function SchmalspurPopup({ feature, layer }) {
  const classes = useStyles();
  const { i18n, t } = useTranslation();

  const properties = feature.getProperties();
  const {
    isb_tu_nummer: tuNummer,
    mail_isb: mailIsb,
    phone_isb: phoneIsb,
  } = properties;

  const phone = properties.phone || phoneIsb;
  const mail = properties.mail || mailIsb;

  const details = layer.tuInfos[tuNummer];
  const { name, long_name: longName } = details;
  const href = details[`url_${i18n.language}`];

  return (
    <div>
      {longName && <div className={classes.row}>{t(longName)}</div>}
      {href && (
        <div className={classes.row}>
          <Link href={href}>
            {t('zur Webseite von', { operator: t(name) })}
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
}

SchmalspurPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(SchmalspurLayer).isRequired,
};

export default React.memo(SchmalspurPopup);
