import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Link from "../../components/Link";
import TarifverbundkarteLayer from "../../layers/TarifverbundkarteLayer";
import TarifverbundPartner from "../../components/TarifverbundPartner";

const useStyles = makeStyles(() => ({
  zone: {
    margin: "8px 0",
  },
  zoneNumber: {
    color: "#888",
    fontSize: 12,
  },
}));

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(TarifverbundkarteLayer).isRequired,
};

function TarifverbundkartePopup({ feature, layer }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const properties = feature.getProperties();
  const { zPass, zones, partners_json: partners } = properties;
  const verbunde = useMemo(() => JSON.parse(partners), [partners]);

  useEffect(() => {
    layer.set("clicked", false);
    return () => {
      /**
       * When the unmount happens due to a click on the map (with the clicked property === true),
       * the deselection is handled in TarifverbundkarteLayer. If the "x"-Button in the popup is clicked
       * it is handled here.
       * @ignore
       */
      if (!layer.get("clicked")) {
        layer.removeSelection();
      }
    };
  });

  if (!zones && !zPass?.tarifverbund_urls) {
    return null;
  }

  return (
    <div className="wkp-tarifverbundkarte-popup">
      {verbunde?.length ? (
        <>
          <Typography variant="h4">
            <b>{t(`Tarifverbunde in ${feature.get("name")}`)}</b>
          </Typography>
          {verbunde
            .filter((v) => !!(v.url && v.name && v.colour))
            .map((v) => {
              return (
                <TarifverbundPartner
                  iconSize={12}
                  key={v.code}
                  color={`#${v.colour}`}
                  label={<Link href={v.url}>{v.name}</Link>}
                />
              );
            })}
          {zPass?.tarifverbund_urls && (
            <TarifverbundPartner
              iconSize={12}
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 2px, #bd9189 2px, #bd9189 4px)",
              }}
              label={<Link href={zPass?.tarifverbund_urls}>Z-Pass</Link>}
            />
          )}
          <br />
        </>
      ) : null}
      {zones ? (
        <>
          <Typography variant="h4">
            <b>{t("Ausgewählte Zonen")}</b>
          </Typography>
          {zones.map((tarifZone) => {
            return (
              <div className={classes.zone} key={tarifZone.id}>
                <Typography>{tarifZone.verbund}</Typography>
                <div className={classes.zoneNumber}>
                  {`${t("Zone")} ${tarifZone.zone}`}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

TarifverbundkartePopup.propTypes = propTypes;

const memoized = React.memo(TarifverbundkartePopup);
memoized.renderTitle = (feat) => feat.get("name");

export default memoized;
