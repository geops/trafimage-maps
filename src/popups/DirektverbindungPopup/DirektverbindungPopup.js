/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';

const useStyles = makeStyles({
  container: {
    padding: 8,
  },
  title: {
    marginTop: 5,
  },
  row: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
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
  route: {
    marginTop: 10,
  },
  routeAbsolute: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  routeIcon: {
    width: 20,
    minWidth: 20,
    height: 35,
    marginRight: 10,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeVertical: {
    width: 5,
    height: '100%',
  },
  routeVerticalFirst: {
    top: '50%',
    height: '50%',
  },
  routeVerticalLast: {
    height: '50%',
    marginTop: 0,
  },
  routeCircleMiddle: {
    height: 7,
    width: 7,
    borderRadius: 7,
    border: '4px solid',
    backgroundColor: '#fff',
    opacity: 1,
    zIndex: 10,
  },
  rowFirst: { fontWeight: 'bold' },
  rowLast: { fontWeight: 'bold' },
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

const DirektverbindungPopup = ({ feature, layer }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    start_station_name: start,
    end_station_name: end,
    vias,
    nachtverbindung: night,
    // [`description_${i18n.language}`]: description,
    // [`url_${i18n.language}`]: link,
  } = feature.getProperties();

  // const switchVias = JSON.parse(vias).filter(
  //   (via) => via.via_type === 'switch' || via.via_type === 'switch_visible',
  // );

  useEffect(() => {
    if (layer.visible) {
      layer.select([feature]);
    }
    return () => layer.select();
  }, [layer, feature]);

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <i>{night ? t('Nachtverbindung') : t('Tagverbindung')}</i>
      </div>
      <div className={classes.route}>
        {[
          { station_name: start },
          ...JSON.parse(vias),
          { station_name: end },
        ].map((via, index, arr) => {
          let extraRowClass = '';
          let extraVerticalClass = '';
          const isFirst = index === 0;
          const isLast = index === arr.length - 1;

          if (isFirst) {
            extraRowClass = ` ${classes.rowFirst}`;
            extraVerticalClass = ` ${classes.routeVerticalFirst}`;
          } else if (isLast) {
            extraRowClass = ` ${classes.rowLast}`;
            extraVerticalClass = ` ${classes.routeVerticalLast}`;
          }

          return (
            <div key={via.station_name} className={classes.row + extraRowClass}>
              <div className={classes.routeIcon}>
                <div
                  className={`${classes.routeAbsolute} ${classes.routeVertical}${extraVerticalClass}`}
                  style={{ backgroundColor: layer.get('color') }}
                />
                <div
                  className={classes.routeCircleMiddle}
                  style={{ borderColor: layer.get('color') }}
                />
              </div>
              <div>
                <Typography variant={isFirst || isLast ? 'h4' : 'body'}>
                  {via.station_name}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

DirektverbindungPopup.renderTitle = (feat) => <DVPopupTitle feature={feat} />;

DirektverbindungPopup.propTypes = propTypes;
export default DirektverbindungPopup;
