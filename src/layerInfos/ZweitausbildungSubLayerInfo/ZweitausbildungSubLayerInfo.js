import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";

const propTypes = {
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const useStyles = makeStyles(() => ({
  legend: {
    "& > div": {
      height: 31,
      margin: 0,
      display: "flex",
      alignItems: "center",
    },

    "& img": {
      float: "left",
      paddingRight: 10,
    },
  },
}));

function ZweitausbildungSubLayerInfo({ properties, staticFilesUrl }) {
  const { t } = useTranslation();
  const { infos } = properties.get("zweitausbildung");
  const { title, legend } = infos;
  const classes = useStyles();

  return (
    <div>
      {title ? <p>{t(title)}</p> : null}
      <div className={classes.legend}>
        {legend.map((item) => (
          <div key={item.name}>
            <img
              src={`${staticFilesUrl}/img/layers/zweitausbildung/${item.image}`}
              draggable="false"
              alt={t("Kein Bildtext")}
            />
            {t(item.name)}
          </div>
        ))}
      </div>
    </div>
  );
}

ZweitausbildungSubLayerInfo.propTypes = propTypes;

export default ZweitausbildungSubLayerInfo;
