/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Layer } from "mobility-toolbox-js/ol";
import GeltungsbereicheLegend, {
  legends,
} from "../../popups/GeltungsbereicheGaPopup/GeltungsbereicheLegend";

const useStyles = makeStyles(() => ({
  lowerCase: {
    "&::first-letter": {
      textTransform: "lowercase",
    },
  },
}));

export const infos = {
  ga: {
    100: "Freie Fahrt",
    50: "Fahrt zum ermässigten Preis",
  },
  tk: {
    100: "Freie Fahrt",
  },
  hta: {
    100: "Fahrt zum ermässigten Preis",
  },
  sts: {
    100: "Freie Fahrt",
    50: "50% oder 25% Ermässigung",
  },

  at: {
    100: "Gültig",
    0: "Ungültig",
  },
};

const warranty = {
  de: (
    <div>
      Aus Platzgründen sind, je nach Zoomstufe, nicht alle Linien angegeben.
      <br />
      Alle Angaben ohne Gewähr. Änderungen vorbehalten.
      <br />
      Es gilt der Anwendungsbereich (
      <a
        href="https://www.allianceswisspass.ch/de/tarife-vorschriften/uebersicht"
        rel="noopener noreferrer"
        target="_blank"
      >
        Übersicht der Tarife und Vorschriften - Alliance SwissPass
      </a>
      ).
    </div>
  ),
  fr: (
    <div>
      Faute de place, selon le niveau de zoom, toutes les lignes ne sont pas
      mentionnées.
      <br />
      Toutes les indications sont sans garantie. Sous réserve de modifications.
      <br />
      Le champ d&apos;application fait foi (
      <a
        href="https://www.allianceswisspass.ch/fr/tarifs/TarifsPrescriptions"
        rel="noopener noreferrer"
        target="_blank"
      >
        Tarifs et prescriptions Vue d&apos;ensemble - Alliance SwissPass
      </a>
      ).
    </div>
  ),
  en: (
    <div>
      Depending on the zoom level, not all lines shown due to lack of space.
      <br />
      All information without guarantee. Subject to change.
      <br />
      The scope of application applies (
      <a
        href="https://www.allianceswisspass.ch/de/tarife-vorschriften/uebersicht"
        rel="noopener noreferrer"
        target="_blank"
      >
        Übersicht der Tarife und Vorschriften - Alliance SwissPass
      </a>
      &nbsp;German only).
    </div>
  ),
  it: (
    <div>
      Per mancanza di spazio, a seconda del livello di zoom, non vi figurano
      tutte le linee.
      <br />
      Tutte le informazioni non sono garantite. Salvo modifiche.
      <br />
      Si applica il campi d&apos;applicazione (
      <a
        href="https://www.allianceswisspass.ch/it/Tariffeprescrizioni/Panoramica"
        rel="noopener noreferrer"
        target="_blank"
      >
        Tariffe e prescrizioni Panoramica - Alliance SwissPass
      </a>
      ).
    </div>
  ),
};

function GeltungsbereicheLayerInfo({ properties: layer }) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const cardsScope = layer.get("cardsScope") || "ga";
  const cardsInfos = infos[cardsScope];
  const full = infos[cardsScope]["100"];
  const reduced = infos[cardsScope]["50"];
  const none = infos[cardsScope]["0"] || "Keine Ermässigung";
  const products = layer.get("products");
  const productsRemark = layer.get("productsRemark");
  return (
    <div style={{ maxHeight: 450 }}>
      {legends.map(({ mots: [mot], validity }) => {
        if (mot === null) {
          return null;
        }
        return (
          <table key={mot + validity} style={{ marginBottom: 10 }}>
            <thead />
            <tbody>
              {validity.map(({ value }, index) => {
                if (!cardsInfos[`${value}`]) {
                  return null;
                }
                return (
                  <tr key={mot + value}>
                    <td>
                      <GeltungsbereicheLegend mot={mot} valid={value} />
                    </td>
                    {index === 0 && (
                      <td rowSpan={validity.length}>{t(`gb.mot.${mot}`)}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
      <br />
      <br />
      <table style={{ marginBottom: 10 }}>
        <thead />
        <tbody>
          <tr>
            {legends.map(({ mots: [mot] }) => {
              if (mot === null) {
                return null;
              }
              return (
                <td key={mot}>
                  <GeltungsbereicheLegend mot={mot} valid={100} />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      {full && (
        <Typography paragraph>
          {products.map((p, idx, arr) => (
            <b
              key={p}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `${t(p)}${idx !== arr.length - 1 ? ", " : ""}`, // We don't use .join() because of html parsing for line breaks
              }}
            />
          ))}
          {productsRemark ? (
            <b>
              , <span className={classes.lowerCase}>{t(productsRemark)}</span>
            </b>
          ) : (
            ""
          )}
          : {t(full)}
        </Typography>
      )}
      <br />
      <br />

      {reduced && (
        <>
          <table style={{ marginBottom: 10 }}>
            <thead />
            <tbody>
              <tr>
                {legends.map(({ mots: [mot] }) => {
                  if (mot === null) {
                    return null;
                  }
                  return (
                    <td key={mot}>
                      <GeltungsbereicheLegend mot={mot} valid={50} />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          <Typography paragraph>
            {products.map((p, idx, arr) => (
              <b
                key={p}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `${t(p)}${idx !== arr.length - 1 ? ", " : ""}`, // We don't use .join() because of html parsing for line breaks
                }}
              />
            ))}
            {productsRemark ? (
              <b>
                , <span className={classes.lowerCase}>{t(productsRemark)}</span>
              </b>
            ) : (
              ""
            )}
            : {t(reduced)}
          </Typography>
          <br />
          <br />
        </>
      )}
      <table style={{ marginBottom: 10 }}>
        <thead />
        <tbody>
          <tr>
            <td>
              <GeltungsbereicheLegend />
            </td>
          </tr>
        </tbody>
      </table>
      <Typography paragraph>{none}</Typography>
      <table style={{ marginBottom: 10 }}>
        <thead />
        <tbody>
          <tr>
            <td>
              <GeltungsbereicheLegend mot="ferry" valid={-1} />
            </td>
          </tr>
        </tbody>
      </table>
      <Typography paragraph>{t("Gültigkeit vor Ort erfragen")}</Typography>
      <br />
      <Divider />
      <br />
      <br />
      <Typography paragraph>
        <i>{t("ch.sbb.geltungsbereiche.layerinfo-footer")}</i>
      </Typography>
      <Typography paragraph>
        <i>{warranty[i18n.language]}</i>
      </Typography>
      <br />
    </div>
  );
}

GeltungsbereicheLayerInfo.propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

GeltungsbereicheLayerInfo.renderTitle = (layer, t) => {
  return t("ch.sbb.geltungsbereiche"); // - ${t(`${layer.name || layer.key}`)}`;
};

export default GeltungsbereicheLayerInfo;
