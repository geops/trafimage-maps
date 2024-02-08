/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Divider, Typography } from "@mui/material";
import { Layer } from "mobility-toolbox-js/ol";
import GeltungsbereicheLegend, {
  legends,
} from "../../popups/GeltungsbereicheGaPopup/GeltungsbereicheLegend";

export const infos = {
  ga: {
    100: "Freie Fahrt",
    50: "Fahrt zum ermässigten Preis",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
  },
  tk: {
    100: "Freie Fahrt",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
  },
  hta: {
    100: "Fahrt zum ermässigten Preis",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
  },
  sts: {
    100: "Freie Fahrt",
    50: "50% oder 25% Ermässigung",
    0: "Keine Ermässigung",
    vorOrt: "Gültigkeit vor Ort erfragen",
  },
  at: {
    100: "Automatisches Ticketing verfügbar",
    0: "Automatisches Ticketing nicht verfügbar",
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
  const cardsScope = layer.get("cardsScope") || "ga";
  const cardsInfos = infos[cardsScope];
  const full = infos[cardsScope]["100"];
  const reduced = infos[cardsScope]["50"];
  const none = infos[cardsScope]["0"] || "Keine Ermässigung";
  const { vorOrt } = infos[cardsScope];
  const products = layer.get("products") || [];
  const productsRemark = layer.get("productsRemark");
  return (
    <div style={{ maxHeight: 450 }}>
      {legends
        .filter(({ mots: [mot] }) => !!mot)
        .map(({ mots: [mot], validity }) => {
          return (
            <>
              <table key={mot + validity} style={{ borderSpacing: 0 }}>
                <thead />
                <tbody>
                  {validity
                    .filter(({ value }) => !!cardsInfos[`${value}`])
                    .map(({ value }, index) => {
                      return (
                        <tr key={mot + value}>
                          <td>
                            <GeltungsbereicheLegend mot={mot} valid={value} />
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
            </>
          );
        })}
      <br />
      <br />
      {full && (
        <>
          <div style={{ display: "flex", gap: 5 }}>
            {legends
              .filter(({ mots: [mot] }) => !!mot)
              .map(({ mots: [mot] }) => {
                return (
                  <GeltungsbereicheLegend key={mot} mot={mot} valid={100} />
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
            {t(full)}
          </Typography>
          <br />
          <br />
        </>
      )}
      {reduced && (
        <>
          <div style={{ display: "flex", gap: 5 }}>
            {legends
              .filter(({ mots: [mot] }) => !!mot)
              .map(({ mots: [mot] }) => {
                return (
                  <GeltungsbereicheLegend key={mot} mot={mot} valid={50} />
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
            {t(reduced)}
          </Typography>
          <br />
          <br />
        </>
      )}
      <GeltungsbereicheLegend />
      <br />
      <br />
      <Typography paragraph>{none}</Typography>
      {!!vorOrt && (
        <>
          <GeltungsbereicheLegend mot="ferry" valid={-1} />
          <br />
          <br />
          <Typography paragraph>{t("Gültigkeit vor Ort erfragen")}</Typography>
        </>
      )}
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
