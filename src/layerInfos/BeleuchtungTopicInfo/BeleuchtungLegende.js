import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { lightingMapping } from "../BeleuchtungLayerInfo/lightingMapping";
import LegendCircle from "../../components/LegendCircle/LegendCircle";

const useStyles = makeStyles(() => {
  return {
    legendWrapper: {
      margin: "10px 0",
    },
    legendRow: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gridGap: 10,
      alignItems: "center",
      minHeight: 70,
      "& svg": {
        marginRight: 10,
      },
    },
    subtext: {
      color: "#888",
      fontSize: 12,
    },
  };
});

export function BeleuchtungLegendeRow({ lightClass }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.legendRow} key={lightClass}>
      <LegendCircle
        fillColor={lightingMapping[lightClass].color}
        radius={15}
        borderWidth={3}
      >
        <b
          style={{
            color: lightClass.match(/(3|4|2b)/) && "white",
            fontSize: 16,
          }}
        >
          {lightClass}
        </b>
      </LegendCircle>
      <div>
        <Typography variant="h4">
          {`${t("Bahnhofklasse")} ${lightClass}`}
        </Typography>
        {t(lightingMapping[lightClass].info[1])} <br />
        <span className={classes.subtext}>{`${
          lightingMapping[lightClass].info[0]
        } ${t("Passagiere/Tag")}`}</span>
      </div>
    </div>
  );
}

BeleuchtungLegendeRow.propTypes = {
  lightClass: PropTypes.string.isRequired,
};

function BeleuchtungLegende() {
  const classes = useStyles();
  return (
    <div className={classes.legendWrapper}>
      {Object.keys(lightingMapping)
        .sort()
        .map((lightClass) => {
          return (
            <BeleuchtungLegendeRow lightClass={lightClass} key={lightClass} />
          );
        })}
    </div>
  );
}

export default BeleuchtungLegende;
