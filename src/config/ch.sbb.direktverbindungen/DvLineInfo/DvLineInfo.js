/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { useSelector } from 'react-redux';
import { unByKey } from 'ol/Observable';
import Link from '../../../components/Link';
import panCenterFeature from '../../../utils/panCenterFeature';
import useIsMobile from '../../../utils/useIsMobile';
import highlightPointFeatures from '../../../utils/highlightPointFeatures';

const useStyles = makeStyles((theme) => ({
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
    borderRadius: 4,
    '&:hover': {
      backgroundColor: theme.colors.lightGray,
    },
  },
  rowSelected: {
    backgroundColor: theme.colors.lightGray,
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
}));

const propTypes = {
  feature: PropTypes.instanceOf(Feature),
};

const defaultProps = {
  feature: null,
};

const DvLineInfo = ({ feature, layer }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const map = useSelector((state) => state.app.map);
  const highlightLayer = useSelector((state) => state.map.highlightLayer);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const isMobile = useIsMobile();
  const [viaUid, setViaUid] = useState(
    highlightLayer.getSource().getFeatures()?.[0]?.get('uid'),
  );

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

  useEffect(() => {
    const onHighlightFeatureChange = highlightLayer
      .getSource()
      .on('addfeature', (evt) => setViaUid(evt.feature.get('uid')));
    return () => unByKey(onHighlightFeatureChange);
  }, [highlightLayer]);

  if (!feature) {
    return null;
  }

  const {
    vias,
    line,
    [`description_${i18n.language}`]: description,
    [`url_${i18n.language}`]: link,
    color,
  } = feature?.getProperties();

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
        {vias.map((via, index, arr) => {
          let extraRowClass = '';
          let extraVerticalClass = '';
          let selectedClass = '';
          const isFirst = index === 0;
          const isLast = index === arr.length - 1;
          const isSelected = via.uid === viaUid;
          const { coordinates } = via;

          if (isFirst) {
            extraRowClass = ` ${classes.rowFirst}`;
            extraVerticalClass = ` ${classes.routeVerticalFirst}`;
          } else if (isLast) {
            extraRowClass = ` ${classes.rowLast}`;
            extraVerticalClass = ` ${classes.routeVerticalLast}`;
          }

          if (isSelected) {
            selectedClass = ` ${classes.rowSelected}`;
          }

          return (
            <Box
              key={via.uid}
              className={classes.row + extraRowClass + selectedClass}
              style={{ cursor: coordinates ? 'pointer' : 'auto' }}
              onClick={() => {
                if (isSelected) {
                  highlightLayer.getSource().clear();
                  setViaUid();
                  return;
                }
                if (coordinates) {
                  setViaUid(via.uid);
                  panCenterFeature(
                    map,
                    [layer],
                    coordinates,
                    !menuOpen, // default menuOpen to false
                    isMobile,
                    true, // useOverlay
                    null,
                    null,
                    null,
                    null,
                    true,
                  );
                  highlightPointFeatures(
                    [
                      new Feature({
                        geometry: new Point(coordinates),
                        ...via,
                      }),
                    ],
                    layer,
                    highlightLayer,
                    [coordinates],
                    true, // silent
                  );
                }
              }}
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
            </Box>
          );
        })}
      </div>
    </div>
  );
};

DvLineInfo.defaultProps = defaultProps;
DvLineInfo.propTypes = propTypes;

export default DvLineInfo;
