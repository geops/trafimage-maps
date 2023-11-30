import React from "react";
import { useTranslation } from "react-i18next";

const linkMapset = (
  <a href="https://mapset.ch" target="_blank" rel="noopener noreferrer">
    mapset
  </a>
);
const descr = {
  de: (
    <>
      Bei diesem Layer handelt es sich um eine in {linkMapset} erstellte
      Zeichnung. Der Layer bleibt beim Wechsel des Kartenthemas erhalten.
    </>
  ),
  fr: (
    <>
      Cette couche a été créée dans {linkMapset}. La couche est conservé lorsque
      le thème de la carte est modifié.
    </>
  ),

  en: (
    <>
      This layer has been created in {linkMapset}. The layer is retained when
      the map theme is changed.
    </>
  ),

  it: (
    <>
      Questo strato è stato creato in {linkMapset}. Lo strato è mantenuto quando
      il tema della mappa viene modificato.
    </>
  ),
};

const DrawLayerInfo = () => {
  const { i18n } = useTranslation();
  return descr[i18n.language];
};

export default React.memo(DrawLayerInfo);
