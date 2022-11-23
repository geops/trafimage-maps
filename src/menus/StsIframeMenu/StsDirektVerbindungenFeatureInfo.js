import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
// import Link from '../../components/Link';
import usePrevious from '../../utils/usePrevious';
import DirektverbindungPopup from '../../popups/DirektverbindungPopup';
import { parseFeaturesInfos } from '../../utils/stsParseFeatureInfo';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
        '&:not(:last-child)': {
          borderBottom: '1px solid gray !important',
          borderBottomWidth: '1px !important',
        },
        '&.open': {
          borderBottom: '1px solid #eee',
        },
      },
    },
    featureInfos: {
      border: '1px solid gray',
    },
    featureInfoItem: {
      padding: 15,
      borderBottom: '1px solid #eee',
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
    return parseFeaturesInfos(featureInfo);
  }, [featureInfo]);

  const previousDvFeatures = usePrevious(dvFeatures);

  useEffect(() => {
    if (dvFeatures !== previousDvFeatures) {
      setInfoKey();
    }
    if (dvFeatures?.length && infoKey === undefined) {
      setInfoKey(dvFeatures[0].getId() || dvFeatures[0].get('id'));
    }
  }, [dvFeatures, previousDvFeatures, infoKey]);

  console.log(dvFeatures);
  if (!dvFeatures?.length) {
    return null;
  }
  return (
    <>
      <br />
      {!isMobile && (
        <>
          <Divider />
          <br />
        </>
      )}
      {dvFeatures?.length ? (
        <>
          <br />
          <div className={classes.featureInfos}>
            {dvFeatures.map((feat) => {
              const id = feat.getId() || feat.get('id');
              const title = feat.get('name');
              const layer = feat.get('layer');
              feat.set('vias', JSON.stringify(feat.get('vias')));
              return (
                <MenuItem
                  onCollapseToggle={(open) => setInfoKey(open ? null : id)}
                  className={`wkp-gb-topic-menu ${classes.root}`}
                  collapsed={infoKey !== id}
                  title={<b>{title}</b>}
                  menuHeight={400}
                >
                  <div className={classes.featureInfoItem}>
                    <DirektverbindungPopup feature={feat} layer={layer} />
                  </div>
                </MenuItem>
              );
            })}
          </div>
        </>
      ) : null}
      {/* {mainFeatures?.length ? (
        <>
          <br />
          <div className={classes.featureInfos}>
            {mainFeatures.map((feat) => {
              const id = feat.getId() || feat.get('id');
              const title =
                feat.get('route_names_premium') ||
                feat.get('route_names_gttos') ||
                feat.get('title');
              const images = feat.get('images') && feat.get('images').length;
              const description = feat.get('lead_text');
              const link = id && DETAILS_BASE_URL + id;
              return (
                <MenuItem
                  onCollapseToggle={(open) => setInfoKey(open ? null : id)}
                  className={`wkp-gb-topic-menu ${classes.root}`}
                  collapsed={infoKey !== id}
                  title={<b>{title}</b>}
                  menuHeight={400}
                >
                  <div className={classes.featureInfoItem}>
                    {images ? (
                      <div className={classes.imageLine}>
                        <a
                          href={`${feat.get('highlight_url') || link}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img src={feat.get('images')[0].url} alt={title} />
                        </a>
                      </div>
                    ) : null}
                    {description && <p>{description}</p>}
                    {link && <Link href={link}>Details</Link>}
                  </div>
                </MenuItem>
              );
            })}
          </div>
        </>
      ) : null} */}
    </>
  );
}

StsDirektVerbindungenFeatureInfo.propTypes = {};

export default StsDirektVerbindungenFeatureInfo;
