import React from "react";
import PropTypes from "prop-types";
import { Layer } from "mobility-toolbox-js/ol";
import { useTranslation } from "react-i18next";
import OperatorShortAndLongName from "../IsbTVSLayerInfo/OperatorShortAndLongName";

const propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const translations = {
  de: {
    description:
      "Infrastrukturbetreiberinnen, die Schmalspurstrecken betreiben.",
    dataInfo1: "Datengrundlage: SBB",
    dataInfo2: "Datenstand: Dezember 2023",
  },
  fr: {
    description:
      "Les gestionnaires d'infrastructure qui exploitent des lignes à voie étroite.",
    dataInfo1: "Base de données: CFF",
    dataInfo2: "État des données: Décembre 2023",
  },
  it: {
    description:
      "Gestori di infrastrutture che operano su linee a scartamento ridotto.",
    dataInfo1: "Base dati: FFS",
    dataInfo2: "Aggiornamento dei dati: Dicembre 2023",
  },
  en: {
    description: "Infrastructure managers who operate narrow gauge lines.",
    dataInfo1: "Data basis: SBB",
    dataInfo2: "Data status: December 2023",
  },
};

function IsbSchmalspurLayerInfo({ properties: layer }) {
  const { i18n } = useTranslation();
  const { description, dataInfo1, dataInfo2 } = translations[i18n.language];

  const shortToLongName = Object.entries(
    layer.get("shortToLongName") || {},
  ).sort(([key1], [key2]) =>
    key1.toUpperCase() < key2.toUpperCase() ? -1 : 1,
  );
  return (
    <div>
      <p>{description}</p>
      {shortToLongName.map(([shortName, longName]) => {
        return (
          <OperatorShortAndLongName
            key={shortName}
            shortName={shortName}
            longName={longName}
          />
        );
      })}
      <p>
        {dataInfo1}
        <br />
        {dataInfo2}
      </p>
    </div>
  );
}

IsbSchmalspurLayerInfo.propTypes = propTypes;

export default React.memo(IsbSchmalspurLayerInfo);
