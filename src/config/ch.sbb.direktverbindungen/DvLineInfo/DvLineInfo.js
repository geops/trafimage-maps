/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import Link from '../../../components/Link';

const useStyles = makeStyles({
  container: {
    padding: '0 8px 8px',
  },
  header: {
    marginTop: 5,
  },
  row: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
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
    width: 4,
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
    height: 6,
    width: 6,
    borderRadius: 6,
    border: '3px solid',
    backgroundColor: '#fff',
    opacity: 1,
    zIndex: 10,
  },
  rowFirst: { fontSize: '1.1em' },
  rowLast: { fontSize: '1.1em' },
});

const propTypes = {
  feature: PropTypes.instanceOf(Feature),
};

const defaultProps = {
  feature: null,
};

const DvLineInfo = ({ feature, layer }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    if (layer.visible) {
      if (feature) {
        layer.select([feature]);
      }
      return;
    }
    // eslint-disable-next-line consistent-return
    return () => {
      layer.select();
    };
  }, [layer, feature]);

  if (!feature) {
    return null;
  }

  const {
    start_station_name: start,
    end_station_name: end,
    vias,
    line,
    [`description_${i18n.language}`]: description,
    [`url_${i18n.language}`]: link,
    color,
  } = feature.getProperties();

  const switchVias = (Array.isArray(vias) ? vias : JSON.parse(vias)).filter(
    (via) => via.via_type === 'switch' || via.via_type === 'visible',
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <i>{line === 'night' ? t('Nachtverbindung') : t('Tagverbindung')}</i>
        {description && <p>{description}</p>}
        {link && (
          <p>
            <Link href={link}>{t('Link zum Angebot')}</Link>
          </p>
        )}
      </div>
      <div className={classes.route}>
        {[{ station_name: start }, ...switchVias, { station_name: end }].map(
          (via, index, arr) => {
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
              <div
                key={via.station_name}
                className={classes.row + extraRowClass}
              >
                <div className={classes.routeIcon}>
                  <div
                    className={`${classes.routeAbsolute} ${classes.routeVertical}${extraVerticalClass}`}
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className={classes.routeCircleMiddle}
                    style={{ borderColor: color }}
                  />
                </div>
                <div>
                  <Typography variant={isFirst || isLast ? 'h4' : 'body1'}>
                    {via.station_name}
                  </Typography>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

DvLineInfo.defaultProps = defaultProps;
DvLineInfo.propTypes = propTypes;

export default DvLineInfo;
