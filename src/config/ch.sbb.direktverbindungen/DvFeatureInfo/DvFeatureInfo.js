import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { unByKey } from 'ol/Observable';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../../../components/Menu/MenuItem';
import usePrevious from '../../../utils/usePrevious';
import DvLineInfo from '../DvLineInfo';
import removeDuplicates, {
  getId,
} from '../../../utils/removeDuplicateFeatures';
import parseDvFeatures from '../../../utils/dvParseFeatures';
import { DV_DAY_NIGHT_REGEX, DV_KEY } from '../../../utils/constants';

const useStyles = makeStyles(() => {
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
      maxHeight: 400,
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        zIndex: 10,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255, 1) 90%)',
        width: '100%',
        height: '10em',
      },
      '& .open': {
        '& .wkp-menu-item-header-toggler': {
          transform: 'rotate(180deg)',
        },
      },
    },
    titleWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    title: {
      maxWidth: 280,
      zIndex: 10,
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
  };
});

function DvTitle({ isNightTrain, title, active }) {
  const classes = useStyles();
  return (
    <div className={classes.titleWrapper}>
      <img
        src={
          isNightTrain
            ? 'https://icons.app.sbb.ch/kom/locomotive-profile-moon-small.svg'
            : 'https://icons.app.sbb.ch/kom/train-profile-small.svg'
        }
        alt="icon"
        className={classes.titleIcon}
      />
      <span className={classes.title}>{active ? <b>{title}</b> : title}</span>
    </div>
  );
}

DvTitle.propTypes = {
  isNightTrain: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  active: PropTypes.bool.isRequired,
};

function DvFeatureInfo({ filterByType }) {
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const layers = useSelector((state) => state.map.layers);
  const [infoKey, setInfoKey] = useState();
  const [teaser, setTeaser] = useState(true);
  const [expandedHeight, setExpandedHeight] = useState();
  const classes = useStyles({ teaser });
  const teaserOnClick = useCallback(() => {
    return teaser ? setTeaser(false) : undefined;
  }, [teaser]);
  const [revision, forceRender] = useState();

  const getVisibleLayerKeys = useCallback(
    () =>
      layers
        .filter((l) => DV_DAY_NIGHT_REGEX.test(l.key) && l.visible)
        .map((l) => l.key),
    [layers],
  );

  const dvMainLayer = useMemo(
    () => layers.find((l) => l.key === `${DV_KEY}.main`),
    [layers],
  );
  const [layersVisible, setLayersVisible] = useState(getVisibleLayerKeys());

  const dvFeatures = useMemo(() => {
    const features = featureInfo.reduce((feats, info) => {
      info.features.forEach((feat) => feat.set('layer', info.layer));
      return [...feats, ...info.features];
    }, []);
    features.sort((feat) => (feat.get('line') === 'night' ? -1 : 1));
    const cleaned = removeDuplicates(parseDvFeatures(features)).filter(
      (feat) => !!feat.get('mapboxFeature'),
    );
    return filterByType
      ? cleaned.filter(
          (feat) =>
            !!layersVisible.find((layerKey) => {
              return `${DV_KEY}.${feat.get('line')}` === layerKey;
            }),
        )
      : cleaned;
  }, [featureInfo, layersVisible, filterByType]);

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
        setInfoKey(previousSelectedFeature && getId(previousSelectedFeature));
      }
    }
  }, [
    dvFeatures,
    previousDvFeatures,
    previousInfoKey,
    layersVisible,
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
            setLayersVisible(getVisibleLayerKeys());
            setInfoKey(null);
          }
        });
      }) || [];
    // Force render after first render because visibility of layers is  not yet applied.
    if (revision === undefined) {
      forceRender(0);
      setLayersVisible(getVisibleLayerKeys());
    }
    return () => {
      unByKey(olKeys);
    };
  }, [getVisibleLayerKeys, layers, layersVisible, revision]);

  if (!dvFeatures?.length) {
    return null;
  }

  return (
    <>
      {dvFeatures?.length ? (
        <div className={classes.featureInfos}>
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
                      if (active && teaser) {
                        setTeaser(false);
                        return;
                      }
                      setInfoKey(open ? null : id);
                      setTeaser(false);
                      // We select the feature here instead of DvLineInfo
                      // to prevent excessive map layer rerenders.
                      dvMainLayer.select(open ? [] : [feat]);
                    }}
                    className={`wkp-dv-feature-info ${classes.root}${
                      active && teaser ? ` ${classes.teaser}` : ''
                    }`}
                    collapsed={!active}
                    open={active}
                    title={
                      <DvTitle
                        title={title}
                        active={active}
                        isNightTrain={isNightTrain}
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
                      <DvLineInfo
                        feature={active ? feat : null}
                        layer={layer}
                      />
                    </div>
                  </MenuItem>
                  <Divider />
                </div>
              );
            })
          ) : (
            <>
              <div style={{ padding: 10 }}>
                <DvTitle
                  title={dvFeatures[0].get('name')}
                  active
                  isNightTrain={dvFeatures[0].get('line') === 'night'}
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
        </div>
      ) : null}
    </>
  );
}

DvFeatureInfo.propTypes = {
  filterByType: PropTypes.bool,
};

DvFeatureInfo.defaultProps = {
  filterByType: false,
};

export default DvFeatureInfo;
