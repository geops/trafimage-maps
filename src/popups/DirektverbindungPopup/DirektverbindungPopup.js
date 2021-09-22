/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import Link from '../../components/Link';

const useStyles = makeStyles({
  container: {
    padding: 8,
  },
  row: {
    margin: '8px 0',
  },
  titleWrapper: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 10,
  },
  routeStops: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fromTo: {
    display: 'flex',
    alignItems: 'center',
  },
});

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const DVPopupTitle = ({ feature }) => {
  const classes = useStyles();
  return (
    <div className={classes.titleWrapper}>
      <img
        src={
          feature.get('nachtverbindung')
            ? 'https://icons.app.sbb.ch/kom/locomotive-profile-moon-small.svg'
            : 'https://icons.app.sbb.ch/kom/train-profile-small.svg'
        }
        alt="icon"
        className={classes.titleIcon}
      />
      {feature.get('name')}
    </div>
  );
};

const DirektverbindungPopup = ({ feature }) => {
  const { i18n, t } = useTranslation();
  const classes = useStyles();

  const {
    start_station_name: start,
    end_station_name: end,
    vias,
    nachtverbindung: night,
    [`description_${i18n.language}`]: description,
    [`url_${i18n.language}`]: link,
  } = feature.getProperties();

  const switchVias = JSON.parse(vias).filter(
    (via) => via.via_type === 'switch' || via.via_type === 'switch_visible',
  );

  return (
    <div className={classes.container}>
      <div className={`${classes.routeStops} ${classes.row}`}>
        <div className={classes.fromTo}>
          {start}-{end}
        </div>
        {switchVias.length ? (
          <div>{`via ${switchVias.map((via) => ` ${via.station_name}`)}`}</div>
        ) : null}
      </div>
      <div className={classes.row}>
        <i>{night ? t('Nachtverbindung') : t('Tagverbindung')}</i>
      </div>
      {description && <div className={classes.row}>{description}</div>}
      {link && <Link href={link}>{t('Link zum Angebot')}</Link>}
    </div>
  );
};

DirektverbindungPopup.renderTitle = (feat) => <DVPopupTitle feature={feat} />;
DirektverbindungPopup.propTypes = propTypes;
export default DirektverbindungPopup;
