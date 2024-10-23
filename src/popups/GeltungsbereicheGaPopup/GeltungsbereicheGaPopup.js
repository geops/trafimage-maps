import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import Feature from "ol/Feature";
import { Layer } from "mobility-toolbox-js/ol";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { FaCircle } from "react-icons/fa";
import GeltungsbereicheLegend, { getLegends } from "./GeltungsbereicheLegend";
import { infos } from "../../layerInfos/GeltungsbereicheLayerInfo/GeltungsbereicheLayerInfo";

const propTypes = {
  feature: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired,
  layer: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
  renderValidityFooter: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    padding: "10px 0",
  },
  listItem: {
    padding: "0 10px 0",
    alignItems: "start",
    maxWidth: 280,
  },
  listItemIcon: {
    marginTop: 8,
    minWidth: 20,
    color: theme.palette.text.primary,
  },
}));

const translations = {
  de: {
    "Information gilt für diese Produkte":
      "Information gilt für diese Produkte",
  },
  en: {
    "Information gilt für diese Produkte":
      "Information applies to these products",
  },
  fr: {
    "Information gilt für diese Produkte":
      "L'information s'applique à ces produits",
  },
  it: {
    "Information gilt für diese Produkte":
      "Informazioni applicabili a questi prodotti",
  },
};

function GeltungsbereichePopup({
  feature: features,
  layer: layers,
  renderValidityFooter = true,
}) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const layer = layers[0];
  const products = layer.get("products") || [];
  const productsRemark = layer.get("productsRemark");
  const validPropertyName = layer.get("validPropertyName");
  const getTextFromValid =
    layer.get("getTextFromValid") ||
    ((valid) => {
      let text = "Keine Ermässigung";
      if (valid === 50 || valid === 25) {
        text = "Fahrt zum ermässigten Preis";
      }
      if (valid === 100) {
        text = "Freie Fahrt";
      }
      if (valid === -1) {
        text = "Gültigkeit vor Ort erfragen";
      }
      return text;
    });
  const lineDashArray50 = layer.get("lineDashArray50");
  const lineDashArray25 = layer.get("lineDashArray25");
  const legends = getLegends(lineDashArray50, lineDashArray25);

  // Keep same mot order as in the legends
  const featuresByMot = {};
  legends.forEach((legend) => {
    if (legend.mots.length) {
      featuresByMot[legend.mots[0]] = {};
    }
  });

  (features || []).forEach((feat) => {
    let mot = feat.get("mot");
    if (/^(tram|subway)$/.test(mot)) {
      mot = "rail";
    }
    if (mot === "funicular") {
      mot = "gondola";
    }
    if (!featuresByMot[mot]) {
      featuresByMot[mot] = {};
    }

    if (!featuresByMot[mot][feat.get(validPropertyName)]) {
      featuresByMot[mot][feat.get(validPropertyName)] = feat;
    }
  });

  return (
    <div className={classes.root}>
      {Object.entries(featuresByMot).map(([mot, validGa]) => {
        return Object.entries(validGa)
          .sort(([keyA], [keyB]) => {
            if (parseInt(keyA, 10) === -1) {
              return 1;
            }
            if (parseInt(keyB, 10) === -1) {
              return -1;
            }
            if (keyA > keyB) {
              return 1;
            }
            if (keyA < keyB) {
              return -1;
            }
            return 0;
          })
          .map(([, feature]) => {
            const valid = feature.get(validPropertyName);
            const text = getTextFromValid(valid);
            return (
              <div key={mot + valid} className={classes.legendItem}>
                <GeltungsbereicheLegend
                  mot={feature.get("mot")}
                  valid={valid}
                  background
                  lineDashArray50={lineDashArray50}
                  lineDashArray25={lineDashArray25}
                />
                <div>
                  <Typography variant="h4">{t(`gb.mot.${mot}`)}</Typography>
                  <Typography variant="subtitle1">{t(text)}</Typography>
                </div>
              </div>
            );
          });
      })}
      <div className={classes.legendItem}>
        <GeltungsbereicheLegend background />
        <Typography variant="subtitle1">
          {t(infos[layer.get("cardsScope")]?.["0"] || "Keine Ermässigung")}
        </Typography>
      </div>
      {renderValidityFooter && !!products.length && (
        <>
          <br />
          <Typography variant="h4">
            {translations[i18n.language]["Information gilt für diese Produkte"]}
            :
          </Typography>
          <List dense>
            {products.map((product) => {
              return (
                <ListItem className={classes.listItem} key={product}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <FaCircle size={7} />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ variant: "body1" }}>
                    {
                      // eslint-disable-next-line react/no-danger
                      <span dangerouslySetInnerHTML={{ __html: t(product) }} /> // For proper line breaks
                    }
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
          {!!productsRemark && (
            <Typography variant="body1">{t(productsRemark)}</Typography>
          )}
        </>
      )}
    </div>
  );
}

GeltungsbereichePopup.propTypes = propTypes;

GeltungsbereichePopup.renderTitle = (feat, layer, t) => {
  return t("ch.sbb.geltungsbereiche");
};

GeltungsbereichePopup.hidePagination = true;
export default GeltungsbereichePopup;
