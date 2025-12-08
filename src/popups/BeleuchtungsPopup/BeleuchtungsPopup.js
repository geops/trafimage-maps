import React, { memo } from "react";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import useTranslation from "../../utils/useTranslation";
import { lightingMapping } from "../../layerInfos/BeleuchtungLayerInfo/lightingMapping";
import LegendCircle from "../../components/LegendCircle/LegendCircle";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const useStyles = makeStyles(() => {
  return {
    line: {
      display: "grid",
      gridTemplateColumns: "auto 4fr",
      gridGap: 10,
      alignItems: "center",
      "& svg": {
        marginLeft: 10,
      },
    },
  };
});

function BeleuchtungsPopup({ feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const stationClass = feature.get("rte_klasse");
  const { color } = lightingMapping[stationClass];

  return (
    <div>
      <p className={classes.line}>
        {t("Bahnhofklasse")}
        <LegendCircle fillColor={color} radius={10} borderWidth={2}>
          <b
            style={{
              color: stationClass.match(/(3|4|2b)/) && "white",
              fontSize: 12,
            }}
          >
            {stationClass}
          </b>
        </LegendCircle>
      </p>
    </div>
  );
}

BeleuchtungsPopup.propTypes = propTypes;
const memoized = memo(BeleuchtungsPopup);
memoized.renderTitle = (feat) => feat.get("name");
export default memoized;
