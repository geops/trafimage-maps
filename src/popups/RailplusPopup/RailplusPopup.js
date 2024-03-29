import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Feature } from "ol";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import RailplusLayer from "../../layers/RailplusLayer";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  logo: {
    marginTop: 15,
    display: "flex",
  },
}));

function RailplusPopup({ feature, layer }) {
  const classes = useStyles();
  const apiKey = useSelector((state) => state.app.apiKey);
  const tuDetails = layer.railplusProviders[feature.get("isb_tu_nummer")];
  const [spriteStyle, setSpriteStyle] = useState();

  useEffect(() => {
    const style = layer.mapboxLayer.mbMap.getStyle();

    const abortController = new AbortController();

    const fetchSpriteData = () => {
      fetch(`${style.sprite}.json?key=${apiKey}`, {
        signal: abortController.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          const detail = data[tuDetails.tu_nummer] || data[tuDetails.name];
          if (!detail) {
            // eslint-disable-next-line no-console
            console.log(
              "No image for",
              tuDetails.name,
              tuDetails.tu_nummer,
              data,
            );
            setSpriteStyle();
          } else {
            const { width, height, x, y } = detail;
            setSpriteStyle({
              background: `url('${style.sprite}.png?key=${apiKey}') -${x}px -${y}px`,
              width,
              height,
            });
          }
        });
    };

    fetchSpriteData();

    return () => {
      abortController?.abort();
    };
  }, [apiKey, layer, tuDetails]);

  return (
    <div className={classes.root}>
      {spriteStyle && (
        <div className={classes.logo}>
          <div style={spriteStyle} />
        </div>
      )}
      <Typography variant="body2">{tuDetails.long_name}</Typography>
    </div>
  );
}

RailplusPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(RailplusLayer).isRequired,
};

export default React.memo(RailplusPopup);
