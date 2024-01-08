import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { Tabs, Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { Layer } from "mobility-toolbox-js/ol";
import Region from "./Region";
import Nl from "./Nl";
import Av from "./Av";

const PERMALINK_PARAM = "rkTab";
const TABS = ["region", "nl", "av"];

const useStyles = makeStyles((theme) => ({
  tabPanel: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    borderTop: "1px solid #dddddd",
    marginTop: -4,
  },
  tab: { minWidth: 0 },
}));

function RegionenkarteSegmentPopup({ layer, feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const accessType = layer.get("accessType") || "public";
  const isIntern = accessType === "intern";
  const parsed = qs.parseUrl(window.location.href);
  const [tab, setTab] = useState(parsed.query[PERMALINK_PARAM] || TABS[2]);
  const [avRole, setAvRole] = useState();
  const handleChange = (event, newTab) => {
    setTab(TABS[newTab]);
  };

  useEffect(() => {
    if (isIntern && tab !== parsed.query[PERMALINK_PARAM]) {
      parsed.query[PERMALINK_PARAM] = tab;
      window.history.replaceState(
        undefined,
        undefined,
        `?${qs.stringify(parsed.query)}`,
      );
    }
  }, [isIntern, parsed, tab]);

  useEffect(() => {
    let property;
    let value;

    if (tab === TABS[0]) {
      property = "region";
      value = feature.get("region");
    } else if (tab === TABS[1]) {
      property = "niederlassung_name";
      value = feature.get("niederlassung_name");
    } else if (tab === TABS[2]) {
      property = avRole;
      value = feature.get(avRole);
    }

    if (property && value) {
      layer.setHighlightFilter(["==", ["get", property], value]);
    }

    return () => layer.setHighlightFilter(null);
  }, [feature, isIntern, layer, layer.mapboxLayer, tab, avRole]);

  return (
    <div className={classes.root}>
      {isIntern && (
        <>
          <Tabs
            value={TABS.indexOf(tab)}
            onChange={handleChange}
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab className={classes.tab} label={t("Region")} />
            <Tab className={classes.tab} label={t("NL")} />
            <Tab className={classes.tab} label={t("Av")} />
          </Tabs>
          <div className={classes.tabPanel}>
            {tab === TABS[2] && (
              <Av
                layer={layer}
                feature={feature}
                onChangeRole={(role) => {
                  setAvRole(role);
                }}
              />
            )}
            {tab === TABS[1] && <Nl layer={layer} feature={feature} />}
            {tab === TABS[0] && <Region layer={layer} feature={feature} />}
          </div>
        </>
      )}
      {!isIntern && (
        <Av
          layer={layer}
          feature={feature}
          onChangeRole={(role) => {
            setAvRole(role);
          }}
        />
      )}
    </div>
  );
}

RegionenkarteSegmentPopup.propTypes = {
  layer: PropTypes.instanceOf(Layer).isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
};

RegionenkarteSegmentPopup.renderTitle = (feat, layer, t) =>
  t("Detailinformationen");

export default RegionenkarteSegmentPopup;
