import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { unByKey } from 'ol/Observable';
import { Point, LineString, MultiLineString } from 'ol/geom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../../../components/Menu/MenuItem';
import usePrevious from '../../../utils/usePrevious';
import DvLineInfo from '../DvLineInfo';
import DvLineTitle from '../DvLineTitle';
import removeDuplicates, {
  getId,
} from '../../../utils/removeDuplicateFeatures';
import parseDvFeatures from '../../../utils/dvParseFeatures';
import { DV_DAY_NIGHT_REGEX, DV_KEY } from '../../../utils/constants';
import useIsMobile from '../../../utils/useIsMobile';
import useDisableIosElasticScrollEffect from '../../../utils/useDisableIosElasticScrollEffect';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
        border: 'none !important',
      },
      '& .wkp-menu-item-header': {
        height: '40px !important',
        '&.open': {
          borderBottom: 'none !important',
        },
      },
      '& .wkp-menu-item-header-toggler': {
        marginRight: 5,
      },
    },
    teaser: {
      maxHeight: (props) => (props.isMobile ? 200 : 400),
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: 'none',
      '&::after': {
        ...theme.styles.bottomFade['&::after'],
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '10em',
      },
      '& .open': {
        '& .wkp-menu-item-header-toggler': {
          transform: 'rotate(180deg)',
        },
      },
    },
    featureInfos: {
      maxHeight: '100%',
      overflow: 'auto',
    },
    featureInfoItem: {
      marginLeft: 38,
      marginRight: 16,
    },
    imageLine: {
      '& img': {
        width: '100%',
      },
    },
    spacer: { height: 100 },
  };
});

function DvFeatureInfo({ filterByType }) {
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const layers = useSelector((state) => state.map.layers);
  const embedded = useSelector((state) => state.app.embedded);
  const [infoKey, setInfoKey] = useState();
  const isMobile = useIsMobile();
  const [teaser, setTeaser] = useState(true);
  const [expandedHeight, setExpandedHeight] = useState();
  const classes = useStyles({ isMobile });
  const teaserOnClick = useCallback(() => {
    return teaser ? setTeaser(false) : undefined;
  }, [teaser]);
  const [revision, forceRender] = useState();
  const [overflowNode, setOverflowNode] = useState();

  useDisableIosElasticScrollEffect(embedded && overflowNode);

  const dvMainLayer = useMemo(
    () => layers.find((l) => l.key === `${DV_KEY}.main`),
    [layers],
  );

  const layersVisible = useMemo(
    () =>
      layers
        .filter((l) => DV_DAY_NIGHT_REGEX.test(l.key) && l.visible)
        .map((l) => l.key),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layers, revision],
  );

  const dvFeatures = useMemo(() => {
    const features = featureInfo.reduce((finalFeats, info) => {
      const newFeatures = info.features.reduce((feats, feat) => {
        // When we click a station or a station label we check the dv ids and select those instead of the station feature
        if (feat.getGeometry() instanceof Point) {
          const dvIds = JSON.parse(feat.get('direktverbindung_ids') || '[]');
          const stationLineFeatures = dvIds.map((id) => {
            return info.layer.allFeatures.find(
              (f) => !!f.get('mapboxFeature') && getId(f) === id,
            );
          });
          return [...feats, ...stationLineFeatures.filter((f) => !!f)];
        }
        if (
          feat.getGeometry() instanceof LineString ||
          feat.getGeometry() instanceof MultiLineString
        ) {
          const hasValidMapboxFeature =
            feat?.get('mapboxFeature')?.sourceLayer ===
            'ch.sbb.direktverbindungen_trips';
          return hasValidMapboxFeature ? [...feats, feat] : feats;
        }
        return feats;
      }, []);
      newFeatures.forEach((feat) => feat.set('layer', info.layer));
      return [...finalFeats, ...newFeatures];
    }, []);
    features.sort((feat) => (feat.get('line') === 'night' ? -1 : 1));
    const cleaned = removeDuplicates(parseDvFeatures(features));
    return filterByType
      ? cleaned.filter(
          (feat) =>
            !!layersVisible.find((layerKey) => {
              return `${DV_KEY}.${feat.get('line')}` === layerKey;
            }),
        )
      : cleaned;
  }, [featureInfo, filterByType, layersVisible]);

  const previousFeatureInfo = usePrevious(featureInfo);
  const previousDvFeatures = usePrevious(dvFeatures);
  const previousInfoKey = usePrevious(infoKey);

  useEffect(() => {
    if (featureInfo !== previousFeatureInfo) {
      setTeaser(true);
      setInfoKey(getId(dvFeatures[0]));
      return;
    }
    if (dvFeatures !== previousDvFeatures) {
      const previousSelectedFeature = dvFeatures.find(
        (feat) => getId(feat) === previousInfoKey,
      );
      if (previousInfoKey) {
        setInfoKey(getId(previousSelectedFeature) || getId(dvFeatures[0]));
      }
    }
  }, [
    dvFeatures,
    previousDvFeatures,
    previousInfoKey,
    featureInfo,
    previousFeatureInfo,
  ]);

  useEffect(() => {
    const olKeys =
      layers?.map((layer) => {
        return layer?.on('change:visible', (evt) => {
          forceRender(revision + 1);
          const { target: targetLayer } = evt;
          if (DV_DAY_NIGHT_REGEX.test(targetLayer.key)) {
            setInfoKey(null);
          }
        });
      }) || [];
    // Force render after first render because visibility of layers is  not yet applied.
    if (revision === undefined) {
      forceRender(0);
    }
    return () => {
      unByKey(olKeys);
    };
  }, [layers, revision]);

  if (!dvFeatures?.length) return null;

  return (
    <div
      className={`${classes.featureInfos}`}
      ref={(node) => {
        setOverflowNode(node);
      }}
    >
      {dvFeatures.length > 1 ? (
        dvFeatures.map((feat) => {
          const id = getId(feat);
          const title = feat.get('name');
          const layer = feat.get('layer');
          const isNightTrain = feat.get('line') === 'night';
          const active = infoKey === id;
          if (active && dvMainLayer) {
            dvMainLayer.select([feat]);
          }
          return (
            <div
              key={id}
              role="menuitem"
              tabIndex={teaser ? '-1' : null}
              onClick={teaserOnClick}
              onKeyDown={teaserOnClick}
              style={{ cursor: teaser ? 'pointer' : 'auto' }}
            >
              <MenuItem
                dataId={id}
                onCollapseToggle={(open) => {
                  setTeaser(false);
                  if (active && teaser) {
                    return;
                  }
                  setInfoKey(open ? null : id);
                  // We select the feature here instead of DvLineInfo
                  // to prevent excessive map layer rerenders.
                  dvMainLayer.select(open ? [] : [feat]);
                  const vias = feat.get('vias');
                  if (
                    !vias.find(
                      (via) =>
                        via.uid === dvMainLayer.highlightedStation?.get('uid'),
                    )
                  ) {
                    dvMainLayer.highlightStation();
                  }
                }}
                className={`wkp-dv-feature-info ${classes.root}${
                  active && teaser ? ` ${classes.teaser}` : ''
                }`}
                collapsed={!active}
                open={active}
                title={
                  <DvLineTitle
                    layer={dvMainLayer}
                    feature={feat}
                    title={title}
                    active={active}
                    isNightTrain={isNightTrain}
                    teaser={active && teaser}
                  />
                }
                menuHeight={expandedHeight}
              >
                <div
                  className={classes.featureInfoItem}
                  ref={
                    active
                      ? (el) =>
                          setExpandedHeight(
                            el?.clientHeight
                              ? el?.clientHeight + 10
                              : undefined,
                          )
                      : null
                  }
                >
                  <DvLineInfo feature={active ? feat : null} layer={layer} />
                </div>
              </MenuItem>
              <Divider />
            </div>
          );
        })
      ) : (
        <>
          <div style={{ padding: 10 }}>
            <DvLineTitle
              title={dvFeatures[0].get('name')}
              active
              isNightTrain={dvFeatures[0].get('line') === 'night'}
              layer={dvMainLayer}
              feature={dvFeatures[0]}
            />
          </div>
          <div className={classes.featureInfoItem}>
            <DvLineInfo
              feature={dvFeatures[0]}
              layer={dvFeatures[0].get('layer')}
            />
          </div>
        </>
      )}
      {!isMobile && dvFeatures.length ? (
        <div className={classes.spacer} />
      ) : null}
    </div>
  );
}

DvFeatureInfo.propTypes = {
  filterByType: PropTypes.bool,
};

DvFeatureInfo.defaultProps = {
  filterByType: false,
};

export default DvFeatureInfo;
