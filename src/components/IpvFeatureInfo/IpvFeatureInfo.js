import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../Menu/MenuItem';
import usePrevious from '../../utils/usePrevious';
import DirektverbindungPopup from '../../popups/DirektverbindungPopup';
import removeDuplicates, { getId } from '../../utils/removeDuplicateFeatures';
import parseIpvFeatures from '../../utils/ipvParseFeatures';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
        border: 'none !important',
      },
      '& .wkp-menu-item-header.open': {
        borderBottom: 'none !important',
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
    },
    titleWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    title: {
      maxWidth: 280,
    },
    featureInfos: {
      maxHeight: '100%',
      overflow: 'auto',
    },
    featureInfoItem: {
      padding: 15,
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

function IpvFeatureInfo() {
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const [infoKey, setInfoKey] = useState();
  const [teaser, setTeaser] = useState(true);
  const classes = useStyles({ teaser });

  const dvFeatures = useMemo(() => {
    const features = featureInfo.reduce((feats, info) => {
      info.features.forEach((feat) => feat.set('layer', info.layer));
      return [...feats, ...info.features];
    }, []);
    return removeDuplicates(parseIpvFeatures(features));
  }, [featureInfo]);

  const previousDvFeatures = usePrevious(dvFeatures);

  useEffect(() => {
    if (dvFeatures !== previousDvFeatures) {
      setInfoKey(getId(dvFeatures[0]));
      setTeaser(true);
    }
  }, [dvFeatures, previousDvFeatures, infoKey]);

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
              const isNightTrain = feat.get('nachtverbindung');
              const active = infoKey === id;
              return (
                <Fragment key={id}>
                  <MenuItem
                    dataId={id}
                    onCollapseToggle={(open) => {
                      if (!(active && teaser)) {
                        setInfoKey(open ? null : id);
                      }
                      setTeaser(false);
                    }}
                    className={`wkp-gb-topic-menu ${classes.root}${
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
                    menuHeight="unset"
                  >
                    <div className={classes.featureInfoItem}>
                      <DirektverbindungPopup
                        feature={active ? feat : null}
                        layer={layer}
                      />
                    </div>
                  </MenuItem>
                  <Divider />
                </Fragment>
              );
            })
          ) : (
            <>
              <div style={{ padding: 10 }}>
                <DvTitle
                  title={dvFeatures[0].get('name')}
                  active
                  isNightTrain={dvFeatures[0].get('nachtverbindung')}
                />
              </div>
              <div className={classes.featureInfoItem}>
                <DirektverbindungPopup
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

export default IpvFeatureInfo;
