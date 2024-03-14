import React from "react";
import PropTypes from "prop-types";
import RegionenkarteLegend from "./RegionenkarteLegend";

const title = {
  de: "Regionenkarte I-VU-UEW",
  fr: "Cartes régionales I-VU-UEW",
  en: "Regional map I-VU-UEW",
  it: "Cartina della regione I-VU-UEW",
};

const description = {
  de: (
    <p>
      Örtliche Ansprechpartner für Arbeitsstellensicherheit auf Baustellen
      Dritter im Gefahrenbereich der Bahninfrastruktur.
    </p>
  ),
  fr: (
    <p>
      Partenaire local pour la securité des chantiers sur des chantiers de tiers
      dans la zone de danger de l’infrastructure ferroviaire.
    </p>
  ),
  en: (
    <p>
      Local contacts for occuppational safety on third-party construction sites
      in the hazardous area of railway infrastructure.
    </p>
  ),
  it: (
    <p>
      Interlocutori in loco per la sicurezza sulle aree dei lavori presso
      cantieri di terzi ubicati nella zona di pericolo dell’infrastruttura
      ferroviaria.
    </p>
  ),
};

function RegionenkartePublicLayerInfo({ language }) {
  return (
    <div>
      <p>{title[language]}</p>
      <RegionenkarteLegend />
      {description[language]}
    </div>
  );
}

RegionenkartePublicLayerInfo.propTypes = {
  language: PropTypes.string.isRequired,
};

export default React.memo(RegionenkartePublicLayerInfo);
