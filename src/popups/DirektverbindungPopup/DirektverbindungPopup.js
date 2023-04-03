/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { containsExtent } from 'ol/extent';
import Feature from 'ol/Feature';
import { unByKey } from 'ol/Observable';
import Link from '../../components/Link';

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
  const { t, i18n } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const topic = useSelector((state) => state.app.activeTopic);
  const layers = useSelector((state) => state.map.layers);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const isEmbeddedTopic = useMemo(() => {
    return /(-iframe|\.sts)$/.test(topic.key);
  }, [topic]);
  const classes = useStyles();

  useEffect(() => {
    let featureChangeListener;
    if (layer.visible) {
      if (feature) {
        const cartaroFeature = layer.allFeatures.find(
          (feat) => feat.get('name') === feature.get('name'),
        );
        if (cartaroFeature) {
          /** Zoom on feature
           * We get the full geometry from the cartaro feature,
           * since the feature from the map clips the feature at the viewport edges
           */
          const view = map.getView();
          const geom = cartaroFeature.getGeometry();
          const extent = view.calculateExtent();
          let padding = [100, 100, 400, 100]; // Bottom padding for feature centering on mobile
          if (!isMobile) {
            if (isEmbeddedTopic) {
              // Left padding for feature centering on desktop embedded (left menu)
              extent[0] += (extent[0] + extent[2]) / 4;
              padding = [100, 100, 100, 500];
            } else {
              // Right padding for feature centering on desktop (right overlay)
              extent[2] -= (extent[0] + extent[2]) / 4;
              padding = [100, 500, 100, 100];
            }
          } else {
            // Bottom padding when overlay slides in from bottom
            extent[1] += (extent[3] - extent[1]) / 3;
            padding = [100, 100, 200, 100];
          }

          if (
            !view.getAnimating() &&
            !containsExtent(extent, geom.getExtent())
          ) {
            view.cancelAnimations();
            view.fit(geom.getExtent(), {
              duration: 500,
              padding,
              callback: () => layer.select([feature]),
              maxZoom: view.getZoom(), // Prevent zooming in
            });
          }
        }
      }
      return;
    }
    // eslint-disable-next-line consistent-return
    return () => {
      layer.select();
      unByKey(featureChangeListener);
    };
  }, [layer, feature, map, isMobile, isEmbeddedTopic, layers]);

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

DirektverbindungPopup.renderTitle = (feat) => <DVPopupTitle feature={feat} />;
DirektverbindungPopup.defaultProps = defaultProps;

DirektverbindungPopup.propTypes = propTypes;
export default DirektverbindungPopup;
