import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import usePrevious from '../../utils/usePrevious';
import DirektverbindungPopup from '../../popups/DirektverbindungPopup';
import { parseFeaturesInfos } from '../../utils/stsParseFeatureInfo';
import removeDuplicates, { getId } from '../../utils/removeDuplicateFeatures';

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

function StsDirektVerbindungenFeatureInfo() {
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const containerRef = useRef();

  const [infoKey, setInfoKey] = useState(undefined);

  const dvFeatures = useMemo(() => {
    return removeDuplicates(parseFeaturesInfos(featureInfo));
  }, [featureInfo]);

  const previousDvFeatures = usePrevious(dvFeatures);

  useEffect(() => {
    if (dvFeatures !== previousDvFeatures) {
      setInfoKey();
    }
    if (dvFeatures?.length && dvFeatures.length < 5 && infoKey === undefined) {
      setInfoKey(getId(dvFeatures[0]));
    }
  }, [dvFeatures, previousDvFeatures, infoKey]);

  if (!dvFeatures?.length) {
    return null;
  }
  return (
    <>
      {!isMobile && <Divider />}
      {dvFeatures?.length ? (
        <div
          className={classes.featureInfos}
          ref={containerRef}
          id="test"
          style={{ overflowY: 'scroll' }}
        >
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
                    onCollapseToggle={(open) => setInfoKey(open ? null : id)}
                    className={`wkp-gb-topic-menu ${classes.root}`}
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
                  {dvFeatures?.length > 1 ? <Divider /> : null}
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

StsDirektVerbindungenFeatureInfo.propTypes = {};

export default StsDirektVerbindungenFeatureInfo;
