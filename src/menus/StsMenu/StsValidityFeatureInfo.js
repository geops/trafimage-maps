import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Point from 'ol/geom/Point';
import { makeStyles, Divider, Typography } from '@material-ui/core';
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
import { setCenter } from '../../model/map/actions';

const useStyles = makeStyles(() => {
  return {
    featureInfos: {
      border: '2px solid rgba(0, 0, 0, 0.3)',
      maxHeight: 'calc(90vh - 90px)',
    },
    featureInfoItem: {
      padding: 15,
    },
    imageLine: {
      margin: '5px 0',
      '& img': {
        width: '100%',
      },
    },
    container: {
      padding: 10,
    },
  };
});

const clearHighlightsSelection = () =>
  highlights.olLayer
    .getSource()
    .getFeatures()
    .forEach((feat) => feat.set('selected', false));

function StsValidityFeatureInfo() {
  const dispatch = useDispatch();
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
  const mainFeature = useMemo(() => {
    const features = mainFeatureInfos?.length
      ? parseFeaturesInfos(mainFeatureInfos, tours)
      : [];
    return features[0];
  }, [mainFeatureInfos, tours]);
  const prevMainFeature = usePrevious(mainFeature);

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
        dispatch(setCenter(feature.getGeometry().getCoordinates()));
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
    [previousSelectedFeature, dispatch],
  );

  useEffect(() => {
    fetch('../data/tours.json')
      .then((response) => response.json())
      .then((data) => setTours(data));
    return () => select();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mainFeature) {
      select();
    }
    if (mainFeature !== prevMainFeature) {
      setSelectedFeature();
    }
    if (mainFeature && selectedFeature === undefined) {
      setSelectedFeature(mainFeature);
      select(mainFeature);
    }
  }, [mainFeature, prevMainFeature, selectedFeature, select]);

  if (!gbFeatureInfo?.features?.length && !mainFeature) {
    select();
    return null;
  }

  return (
    <div className={classes.container}>
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
      {mainFeature
        ? (() => {
            const id = getId(mainFeature) || mainFeature.get('title');
            const title =
              mainFeature.get('route_names_premium') ||
              mainFeature.get('route_names_gttos') ||
              mainFeature.get('title');
            const images =
              mainFeature.get('images') && mainFeature.get('images').length;
            const description = mainFeature.get('lead_text');
            const link = id && DETAILS_BASE_URL + id;
            return (
              <>
                <br />
                <div className={classes.featureInfos}>
                  <div className={classes.featureInfoItem}>
                    <Typography paragraph variant="h4">
                      {title}
                    </Typography>
                    {images ? (
                      <div className={classes.imageLine}>
                        <a
                          href={`${mainFeature.get('highlight_url') || link}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img
                            src={mainFeature.get('images')[0].url}
                            alt={title}
                          />
                        </a>
                      </div>
                    ) : null}
                    {description && (
                      <Typography paragraph>{description}</Typography>
                    )}
                    {link && <Link href={link}>Details</Link>}
                  </div>
                </div>
              </>
            );
          })()
        : null}
    </div>
  );
}

StsValidityFeatureInfo.propTypes = {};

export default StsValidityFeatureInfo;
