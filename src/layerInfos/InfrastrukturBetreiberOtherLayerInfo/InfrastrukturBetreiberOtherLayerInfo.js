import React from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import { useTranslation } from 'react-i18next';
import InfrastruktueBetrieberLegend from '../InfrastrukturBetreiberTVSLayerInfo/InfrastruktueBetrieberLegend';

const propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const translations = {
  de: {
    title: 'Normalspurstrecken - übrige',
    description:
      'Übrige Normalspurstrecken, die sich nicht im Zuständigkeitsbereich der Schweizerischen Trassenvergabestelle TVS befinden.',
    dataInfo1: 'Datengrundlage: BAV',
    dataInfo2: 'Datenstand: 02.2022',
  },
  fr: {
    title: 'Voies normales - autres',
    description:
      "Autres lignes à voie normale qui ne se trouvent pas dans le domaine de compétence du service suisse d'attribution des sillons SAS.",
    dataInfo1: 'Base de données: OFT',
    dataInfo2: 'État des données: 02.2022',
  },
  it: {
    title: 'Tratte a scartamento normale - altre',
    description:
      "Altre linee a scartamento normale che non rientrano nell'area di responsabilità del Servizio svizzero di assegnazione delle tracce SAT.",
    dataInfo1: 'Base dati: UFT',
    dataInfo2: 'Aggiornamento dei dati: 02.2022',
  },
  en: {
    title: 'Standard gauge - other',
    description:
      'Other standard gauge lines which are not within the area of responsibility of the Swiss train path allocation body TVS.',
    dataInfo1: 'Data basis: FOT',
    dataInfo2: 'Data status: 02.2022',
  },
};

const InfrastrukturBetreiberOtherLayerInfo = ({ properties: layer }) => {
  const { i18n } = useTranslation();
  const { title, description, dataInfo1, dataInfo2 } =
    translations[i18n.language];
  const defaultColor = layer.get('defaultColor') || {};
  const colors = layer.get('colors') || '';
  const shortToLongName = layer.get('shortToLongName') || {};

  // Importamt operators
  const operators = Object.entries(shortToLongName).filter(
    ([key]) => !!colors[key],
  );

  // Others
  const othersOperators = Object.keys(shortToLongName).filter(
    (key) => !colors[key],
  );
  operators.push(['OTH', othersOperators.join(', ')]);
  return (
    <div>
      {title}
      <p>{description}</p>
      <div>
        {operators.map(([shortName, longName]) => {
          const color = colors[shortName] || defaultColor;
          return (
            <InfrastruktueBetrieberLegend
              key={shortName}
              color={color}
              longName={longName}
              shortName={shortName}
            />
          );
        })}
      </div>
      <p>
        {dataInfo1}
        <br />
        {dataInfo2}
      </p>
    </div>
  );
};

InfrastrukturBetreiberOtherLayerInfo.propTypes = propTypes;

export default React.memo(InfrastrukturBetreiberOtherLayerInfo);
