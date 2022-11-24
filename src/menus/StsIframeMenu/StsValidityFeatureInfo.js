import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Point from 'ol/geom/Point';
import { makeStyles, Divider } from '@material-ui/core';
import MenuItem from '../../components/Menu/MenuItem';
import Link from '../../components/Link';
import usePrevious from '../../utils/usePrevious';
import GeltungsbereichePopup from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheGaPopup';
import {
  otherRoutes,
  highlightRoutes,
  highlights,
} from '../../config/ch.sbb.sts';
import { parseFeaturesInfos } from '../../utils/stsParseFeatureInfo';
import { DETAILS_BASE_URL } from '../../utils/constants';
import { getId } from '../../utils/removeDuplicateFeatures';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&.wkp-menu-item': {
        marginTop: '0 !important',
        border: '1px solid #666 !important',
        '&:not(:last-child)': {
          borderBottom: '1px solid #666 !important',
          borderBottomWidth: '1px !important',
        },
        '& .wkp-menu-item-header.open': {
          borderBottom: 'none !important',
        },
      },
    },
    fit: {
      '& .wkp-collapsible-vertical': {
        height: 'fit-content !important',
      },
    },
    featureInfos: {
      border: '1px solid #666',
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

const clearHighlightsSelection = () =>
  highlights.olLayer
    .getSource()
    .getFeatures()
    .forEach((feat) => feat.set('selected', false));

function StsValidityFeatureInfo() {
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const [tours, setTours] = useState([]);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

  const [selectedFeature, setSelectedFeature] = useState();
  const previousSelectedFeature = usePrevious(selectedFeature);

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

  const select = useCallback(
    (feature) => {
      if (previousSelectedFeature) {
        previousSelectedFeature.set('selected', false);
      }
      if (!feature) {
        clearHighlightsSelection();
        highlightRoutes.highlightRoutes([]);
        return;
      }
      if (feature.getGeometry() instanceof Point) {
        feature.set('selected', true);
        highlightRoutes.highlightRoutes([]);
      } else {
        clearHighlightsSelection();
        highlightRoutes.highlightRoutes(
          [feature.get('title')],
          feature.get('routeProperty') || null,
        );
      }
      setSelectedFeature(feature);
    },
    [previousSelectedFeature],
  );

  const onCollapseToggle = useCallback(
    (open, feat) => {
      setSelectedFeature(open ? null : feat);
      select(open ? null : feat);
    },
    [select],
  );

  useEffect(() => {
    fetch('../data/tours.json')
      .then((response) => response.json())
      .then((data) => setTours(data));
    return () => select();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mainFeatures?.length) {
      select();
    }
    if (mainFeatures !== prevMainFeatures) {
      setSelectedFeature();
    }
    if (mainFeatures?.length && selectedFeature === undefined) {
      setSelectedFeature(mainFeatures[0]);
      select(mainFeatures[0]);
    }
  }, [mainFeatures, prevMainFeatures, selectedFeature, select]);

  if (!gbFeatureInfo?.features?.length && !mainFeatures.length) {
    select();
    return null;
  }

  return (
    <>
      {!isMobile && <Divider />}
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
              const id = getId(feat) || feat.get('title');
              const title =
                feat.get('route_names_premium') ||
                feat.get('route_names_gttos') ||
                feat.get('title');
              const images = feat.get('images') && feat.get('images').length;
              const description = feat.get('lead_text');
              const link = id && DETAILS_BASE_URL + id;
              const active = !!selectedFeature && getId(selectedFeature) === id;
              return (
                <MenuItem
                  key={id}
                  onCollapseToggle={(open) => onCollapseToggle(open, feat)}
                  className={`wkp-gb-topic-menu ${classes.root} ${classes.fit}`}
                  collapsed={!active}
                  title={active ? <b>{title}</b> : title}
                  open={active}
                  menuHeight="unset"
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
