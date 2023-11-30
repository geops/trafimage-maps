import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  language: PropTypes.string.isRequired,
};

const desc = (lng, date) => {
  if (lng === "de") {
    return `Angezeigt werden SBB-Bauprojekte bis ${date}, welche durch
      zusätzliche oder erweiterte Bahninfrastruktur mehr Leistung und/oder mehr
      Komfort ermöglichen.`;
  }
  if (lng === "fr") {
    return `Présentation des projets de construction des CFF jusqu'en ${date}
      permettant davantage de prestations et/ou de confort grâce à des
      infrastructures ferroviaires nouvelles ou étendues.`;
  }
  if (lng === "it") {
    return `Progetti di costruzione delle FFS fino al ${date} che rendono
      possibile una maggiore prestazione e/o un maggiore comfort grazie a
      un’infrastruttura ferroviaria supplementare o ampliata.`;
  }
  return `This shows you SBB construction projects up to ${date} that will
    create additional or expanded rail infrastructure to improve performance
    and/or enhance comfort.`;
};

function ConstructionFertigstellungLayerInfo({ language, properties }) {
  const key = properties.get("date");
  return desc(language, key);
}

ConstructionFertigstellungLayerInfo.propTypes = propTypes;

export default React.memo(ConstructionFertigstellungLayerInfo);
