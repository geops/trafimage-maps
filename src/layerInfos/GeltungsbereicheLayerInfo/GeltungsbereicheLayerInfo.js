/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Divider, Typography } from "@mui/material";
import { Layer } from "mobility-toolbox-js/ol";
import GeltungsbereicheLegend, {
  getLegends,
  defaultDashArray,
} from "../../popups/GeltungsbereicheGaPopup/GeltungsbereicheLegend";

export const infos = {
  ga: {
    100: "Freie Fahrt",
    50: "Fahrt zum ermässigten Preis",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
    footer: true,
  },
  tk: {
    100: "Freie Fahrt",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
    footer: true,
  },
  hta: {
    100: "Fahrt zum ermässigten Preis",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
    footer: true,
  },
  sts: {
    100: "Freie Fahrt",
    50: "50% Ermässigung",
    25: "25% Ermässigung",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
    footer: true,
  },
  at: {
    100: "Automatisches Ticketing gültig",
    0: "Automatisches Ticketing nicht gültg",
    footer: true,
  },
};

const warranty = {
  de: (
    <i>
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
    </i>
  ),
  fr: (
    <i>
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
    </i>
  ),
  en: (
    <i>
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
    </i>
  ),
  it: (
    <i>
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
    </i>
  ),
};

function GbLegendValidity({
  valid = 100,
  legends,
  products,
  productsRemark = null,
  lineDashArray50 = defaultDashArray,
  lineDashArray25 = defaultDashArray,
  text,
}) {
  const { t } = useTranslation();
  return (
    <>
      <div style={{ display: "flex", gap: 5 }}>
        {legends
          .filter(({ mots: [mot] }) => !!mot)
          .map(({ mots: [mot] }) => {
            return (
              <GeltungsbereicheLegend
                key={mot}
                mot={mot}
                valid={valid}
                lineDashArray50={lineDashArray50}
                lineDashArray25={lineDashArray25}
              />
            );
          })}
      </div>
      <br />
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
        {!!productsRemark && <b>, {t(productsRemark)}</b>}
        {products.length || !!productsRemark ? ": " : ""}
        {t(text)}
      </Typography>
      <br />
      <br />
    </>
  );
}

GbLegendValidity.propTypes = {
  valid: PropTypes.number,
  legends: PropTypes.arrayOf(PropTypes.object).isRequired,
  products: PropTypes.arrayOf(PropTypes.string).isRequired,
  productsRemark: PropTypes.string,
  lineDashArray50: PropTypes.arrayOf(PropTypes.number),
  lineDashArray25: PropTypes.arrayOf(PropTypes.number),
  text: PropTypes.string.isRequired,
};

function GeltungsbereicheLayerInfo({ properties: layer }) {
  const { t, i18n } = useTranslation();
  const cardsScope = layer.get("cardsScope") || "ga";
  const cardsInfos = infos[cardsScope];
  const full = infos[cardsScope]["100"];
  const reduced50 = infos[cardsScope]["50"];
  const reduced25 = infos[cardsScope]["25"];
  const none = infos[cardsScope]["0"] || "Keine Ermässigung";
  const { vorOrt, footer } = infos[cardsScope];
  const products = layer.get("products") || [];
  const productsRemark = layer.get("productsRemark");
  const lineDashArray50 = layer.get("lineDashArray50");
  const lineDashArray25 = layer.get("lineDashArray25");
  const legends = getLegends(lineDashArray50, lineDashArray25);
  return (
    <div style={{ maxHeight: 450 }}>
      {legends
        .filter(({ mots: [mot] }) => !!mot)
        .map(({ mots: [mot], validity }) => {
          return (
            <React.Fragment key={mot + validity}>
              <table style={{ borderSpacing: 0 }}>
                <thead />
                <tbody>
                  {validity
                    .filter(({ value }) => !!cardsInfos[`${value}`])
                    .map(({ value }, index) => {
                      return (
                        <tr key={mot + value}>
                          <td>
                            <GeltungsbereicheLegend
                              mot={mot}
                              valid={value}
                              lineDashArray50={lineDashArray50}
                              lineDashArray25={lineDashArray25}
                            />
                          </td>
                          {index === 0 && (
                            <td
                              rowSpan={validity.length}
                              style={{ paddingLeft: 5 }}
                            >
                              {t(`gb.mot.${mot}`)}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <br />
            </React.Fragment>
          );
        })}
      <br />
      <br />
      {full && (
        <GbLegendValidity
          legends={legends}
          products={products}
          productsRemark={productsRemark}
          text={full}
        />
      )}
      {reduced50 && (
        <GbLegendValidity
          valid={50}
          legends={legends}
          products={products}
          productsRemark={productsRemark}
          lineDashArray25={lineDashArray25}
          lineDashArray50={lineDashArray50}
          text={reduced50}
        />
      )}
      {reduced25 && (
        <GbLegendValidity
          valid={25}
          legends={legends}
          products={products}
          productsRemark={productsRemark}
          lineDashArray25={lineDashArray25}
          lineDashArray50={lineDashArray50}
          text={reduced25}
        />
      )}
      <GeltungsbereicheLegend />
      <br />
      <br />
      <Typography paragraph>{t(none)}</Typography>
      {!!vorOrt && (
        <>
          <GeltungsbereicheLegend mot="ferry" valid={-1} />
          <br />
          <br />
          <Typography paragraph>{t("Gültigkeit vor Ort erfragen")}</Typography>
        </>
      )}
      {footer && (
        <>
          <br />
          <Divider />
          <br />
          <br />
          <Typography paragraph>
            <i>
              {i18n.exists(`${layer.key}.layerinfo-footer`)
                ? t(`${layer.key}.layerinfo-footer`)
                : t("ch.sbb.geltungsbereiche.layerinfo-footer")}
            </i>
          </Typography>
          <Typography paragraph>{warranty[i18n.language]}</Typography>
          <br />
        </>
      )}
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
