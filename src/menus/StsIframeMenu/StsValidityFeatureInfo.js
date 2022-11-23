import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import Link from '../../components/Link';
import usePrevious from '../../utils/usePrevious';
import GeltungsbereichePopup from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheGaPopup';
import { otherRoutes } from '../../config/ch.sbb.sts.iframe';
import { parseFeaturesInfos } from '../../utils/stsParseFeatureInfo';
import { DETAILS_BASE_URL } from '../../utils/constants';

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

function StsValidityFeatureInfo() {
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const [tours, setTours] = useState([]);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const [infoKey, setInfoKey] = useState(undefined);

  const mainFeatureInfos = useMemo(
    () => featureInfo.filter((info) => info.layer.key !== otherRoutes.key),
    [featureInfo],
  );
  const gbFeatureInfo = useMemo(
    () => featureInfo.find((info) => info.layer.key === otherRoutes.key),
    [featureInfo],
  );
  const mainFeatures = useMemo(() => {
    return mainFeatureInfos?.length
      ? parseFeaturesInfos(mainFeatureInfos, tours)
      : [];
  }, [mainFeatureInfos, tours]);
  const prevMainFeatures = usePrevious(mainFeatures);

  useEffect(() => {
    fetch('../data/tours.json')
      .then((response) => response.json())
      .then((data) => setTours(data));
  }, []);

  useEffect(() => {
    if (mainFeatures !== prevMainFeatures) {
      setInfoKey();
    }
    if (mainFeatures?.length && infoKey === undefined) {
      setInfoKey(mainFeatures[0].getId() || mainFeatures[0].get('id'));
    }
  }, [mainFeatures, prevMainFeatures, infoKey]);

  if (!gbFeatureInfo?.features?.length && !mainFeatures.length) {
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
      {gbFeatureInfo?.features?.length ? (
        <GeltungsbereichePopup
          feature={gbFeatureInfo.features.filter((feat) => feat.get('mot'))}
          layer={[gbFeatureInfo.layer]}
          renderValidityFooter={false}
        />
      ) : null}
      {mainFeatures?.length ? (
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
      ) : null}
    </>
  );
}

StsValidityFeatureInfo.propTypes = {};

export default StsValidityFeatureInfo;
