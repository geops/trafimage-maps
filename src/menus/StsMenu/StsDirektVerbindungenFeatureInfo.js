import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
        borderBottom: '1px solid rgba(0, 0, 0, 0.1) !important',
      },
      '& .wkp-menu-item-header.open': {
        borderBottom: 'none !important',
      },
    },
    fit: {
      '& .wkp-collapsible-vertical': {
        height: 'fit-content !important',
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
      maxHeight: 'calc(90vh - 31px)',
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

function StsDirektVerbindungenFeatureInfo() {
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

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
      {!isMobile && (
        <>
          <Divider />
        </>
      )}
      {dvFeatures?.length ? (
        <div className={classes.featureInfos}>
          {dvFeatures.map((feat) => {
            const id = getId(feat);
            const title = feat.get('name');
            const layer = feat.get('layer');
            const isNightTrain = feat.get('nachtverbindung');
            const active = infoKey === id;
            return (
              <MenuItem
                key={id}
                onCollapseToggle={(open) => setInfoKey(open ? null : id)}
                className={`wkp-gb-topic-menu ${classes.root} ${classes.fit}`}
                collapsed={!active}
                open={active}
                title={
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
                    <span className={classes.title}>
                      {active ? <b>{title}</b> : title}
                    </span>
                  </div>
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
            );
          })}
        </div>
      ) : null}
    </>
  );
}

StsDirektVerbindungenFeatureInfo.propTypes = {};

export default StsDirektVerbindungenFeatureInfo;
