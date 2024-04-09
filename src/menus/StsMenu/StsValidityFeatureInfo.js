import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Point from "ol/geom/Point";
import { Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "../../components/Link";
import usePrevious from "../../utils/usePrevious";
import GeltungsbereichePopup from "../../popups/GeltungsbereicheGaPopup/GeltungsbereicheGaPopup";
import {
  otherRoutes,
  highlightRoutes,
  highlights,
} from "../../config/ch.sbb.sts";
import { parseFeaturesInfos } from "./stsParseFeatureInfo";
import panCenterFeature from "../../utils/panCenterFeature";
import useIsMobile from "../../utils/useHasScreenSize";

const useStyles = makeStyles(() => {
  return {
    featureInfoItem: {
      padding: "0 5px 10px",
    },
    mainInfo: {
      padding: "0 10px",
    },
    gbLegend: {
      padding: 10,
    },
    imageLine: {
      margin: "5px 0",
      "& img": {
        width: "100%",
      },
    },
    container: {
      height: "calc(100% - 17px)",
      overflow: "auto",
    },
  };
});

const clearHighlightsSelection = () =>
  highlights.olLayer
    .getSource()
    .getFeatures()
    .forEach((feat) => feat.set("selected", false));

const useFetchTours = (select) => {
  const [tours, setTours] = useState(null);
  useEffect(() => {
    fetch("https://maps.trafimage.ch/sts-static/tours.json")
      .then((response) => response.json())
      .then((data) => setTours(data));
    return () => select();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [tours];
};
function StsValidityFeatureInfo({ menuOpen }) {
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const map = useSelector((state) => state.app.map);
  const isMobile = useIsMobile();

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

  const select = useCallback(
    (feature) => {
      if (previousSelectedFeature) {
        previousSelectedFeature.set("selected", false);
      }
      if (!feature) {
        clearHighlightsSelection();
        highlightRoutes.highlightRoutes([]);
        return;
      }
      if (feature.getGeometry() instanceof Point) {
        feature.set("selected", true);
        panCenterFeature(
          map,
          [featureInfo.layer],
          feature.getGeometry().getCoordinates(),
          !menuOpen, // default menuOpen to false
          isMobile,
          true, // useOverlay
          0, // ignore right overlay for desktop
          410, // new overlayHeightMobile
        );
        highlightRoutes.highlightRoutes([]);
      } else {
        clearHighlightsSelection();
        highlightRoutes.highlightRoutes(
          [feature.get("title")],
          feature.get("routeProperty") || null,
        );
      }
      setSelectedFeature(feature);
    },
    [previousSelectedFeature, featureInfo, map, menuOpen, isMobile],
  );

  const [tours] = useFetchTours(select);

  const mainFeatures = useMemo(() => {
    const features =
      mainFeatureInfos?.length && tours?.length
        ? parseFeaturesInfos(mainFeatureInfos, tours)
        : [];
    // When a POI highlight is selected we only display the first one, with lines we display all
    return features[0]?.getGeometry() instanceof Point
      ? [features[0]]
      : features;
  }, [mainFeatureInfos, tours]);

  const prevMainFeatures = usePrevious(mainFeatures);

  useEffect(() => {
    if (!mainFeatures?.length) {
      select();
    }
    if (mainFeatures !== prevMainFeatures) {
      setSelectedFeature();
    }
    if (mainFeatures && selectedFeature === undefined) {
      setSelectedFeature(mainFeatures[0]);
      select(mainFeatures[0]);
    }
  }, [mainFeatures, prevMainFeatures, selectedFeature, select]);

  if (!gbFeatureInfo?.features?.length && !mainFeatures?.length) {
    select();
    return null;
  }

  return (
    <div className={classes.container}>
      {gbFeatureInfo?.features?.length ? (
        <div className={classes.gbLegend}>
          <GeltungsbereichePopup
            feature={gbFeatureInfo.features.filter((feat) => feat.get("mot"))}
            layer={[gbFeatureInfo.layer]}
            renderValidityFooter={false}
          />
        </div>
      ) : null}
      {gbFeatureInfo?.features?.length && mainFeatures.length ? (
        <Divider />
      ) : null}
      {mainFeatures?.length
        ? mainFeatures.map((feat, idx, array) => {
            const title =
              feat.get("title") ||
              feat.get("route_names_premium") ||
              feat.get("route_names_gttos");
            const images = feat.get("images") && feat.get("images").length;
            const description = feat.get("lead_text");
            const highlightUrl = feat.get("highlight_url");
            return (
              <React.Fragment key={title}>
                <div
                  className={classes.mainInfo}
                  data-testid="sts-validity-feature-info"
                >
                  <br />
                  <div className={classes.featureInfoItem}>
                    <Typography paragraph variant="h4">
                      {title}
                    </Typography>
                    {images ? (
                      <div className={classes.imageLine}>
                        <a
                          href={highlightUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img src={feat.get("images")[0].url} alt={title} />
                        </a>
                      </div>
                    ) : null}
                    {description && (
                      <Typography paragraph>{description}</Typography>
                    )}
                    {highlightUrl && <Link href={highlightUrl}>Details</Link>}
                  </div>
                </div>
                {array.length > 1 && idx !== array.length - 1 ? (
                  <Divider />
                ) : null}
              </React.Fragment>
            );
          })
        : null}
    </div>
  );
}

StsValidityFeatureInfo.propTypes = { menuOpen: PropTypes.bool };
StsValidityFeatureInfo.defaultProps = { menuOpen: true };

export default StsValidityFeatureInfo;
