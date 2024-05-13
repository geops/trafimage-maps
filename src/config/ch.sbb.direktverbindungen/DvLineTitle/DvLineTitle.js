import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Feature } from "ol";
import { IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import DirektverbindungenLayer from "../../../layers/DirektverbindungenLayer";
import { ReactComponent as TrainIconDay } from "../../../img/train-day.svg";
import { ReactComponent as TrainIconNight } from "../../../img/train-night.svg";
import useHasScreenSize from "../../../utils/useHasScreenSize";

const useStyles = makeStyles((theme) => ({
  titleWrapper: {
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 10,
  },
  title: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  zoomOnLineBtn: {
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(DirektverbindungenLayer).isRequired,
  isNightTrain: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  active: PropTypes.bool.isRequired,
  teaser: PropTypes.bool,
};

const defaultProps = {
  teaser: false,
};

function DvLineTitle({ feature, layer, isNightTrain, title, active, teaser }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  const topic = useSelector((state) => state.app.activeTopic);
  const isEmbeddedTopic = useMemo(() => {
    return /(-iframe|\.sts)$/.test(topic.key);
  }, [topic]);
  const isMobile = useHasScreenSize();
  const cartaroFeature = layer.allFeatures.find(
    (feat) => feat.get("id") === feature.get("id"),
  );
  return (
    <div className={classes.titleWrapper}>
      {isNightTrain ? (
        <TrainIconNight className={classes.titleIcon} />
      ) : (
        <TrainIconDay className={classes.titleIcon} />
      )}
      <Typography className={classes.title}>
        {active ? (
          <>
            <b>{title}</b>
            <IconButton
              className={classes.zoomOnLineBtn}
              title={t("Auf Linie zentrieren")}
              disabled={!cartaroFeature}
              onClick={(evt) => {
                if (!teaser) {
                  evt.stopPropagation();
                  evt.preventDefault();
                }
                const view = map.getView();
                const geom = cartaroFeature.getGeometry();
                const extent = view.calculateExtent();
                let padding = [100, 100, 400, 100]; // Bottom padding for feature centering on mobile
                if (!isMobile) {
                  if (isEmbeddedTopic) {
                    // Left padding for feature centering on desktop embedded (left menu)
                    extent[0] += (extent[0] + extent[2]) / 4;
                    padding = [100, 100, 100, 500];
                  } else {
                    // Right padding for feature centering on desktop (right overlay)
                    extent[2] -= (extent[0] + extent[2]) / 4;
                    padding = [100, 500, 100, 100];
                  }
                } else {
                  // Bottom padding when overlay slides in from bottom
                  extent[1] += (extent[3] - extent[1]) / 3;
                  padding = [100, 100, 200, 100];
                }
                view.cancelAnimations();
                view.fit(geom.getExtent(), {
                  duration: 500,
                  padding,
                  maxZoom: view.getZoom(), // Prevent zooming in
                });
              }}
            >
              <ZoomOutMapIcon fontSize="small" focusable={false} />
            </IconButton>
          </>
        ) : (
          title
        )}
      </Typography>
    </div>
  );
}

DvLineTitle.propTypes = propTypes;
DvLineTitle.defaultProps = defaultProps;

export default DvLineTitle;
