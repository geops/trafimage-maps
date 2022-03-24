import React from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import { useTranslation } from 'react-i18next';
import Link from '../../components/Link';
import OperatorLegend from './OperatorLegend';
import OperatorShortAndLongName from './OperatorShortAndLongName';

const propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const translations = {
  de: {
    title: 'Normalspurstrecken - TVS',
    description:
      'Infrastrukturbetreiberinnen, die sich im Zuständigkeitsbereich der Schweizerischen Trassenvergabestelle TVS befinden.',
    dataInfo1: 'Datengrundlage: BAV und SBB',
    dataInfo2: 'Datenstand: 02.2022',
  },
  fr: {
    title: 'Voies normales - SAS',
    description:
      "Gestionnaires d'infrastructure qui se trouvent dans le domaine de compétence du service suisse d'attribution des sillons SAS.",
    dataInfo1: 'Base de données: OFT et CFF',
    dataInfo2: 'État des données: 02.2022',
  },
  it: {
    title: 'Tratte a scartamento normale - SAT',
    description:
      "I gestori dell'infrastruttura che rientrano nell'area di responsabilità del Servizio svizzero di assegnazione delle tracce SAT.",
    dataInfo1: 'Base dati: UFT e FFS',
    dataInfo2: 'Aggiornamento dei dati: 02.2022',
  },
  en: {
    title: 'Standard gauge - TVS',
    description:
      'Infrastructure managers who are within the area of responsibility of the Swiss train path allocation body TVS.',
    dataInfo1: 'Data basis: FOT and SBB',
    dataInfo2: 'Data status: 02.2022',
  },
};

const IsbTVSLayerInfo = ({ properties: layer }) => {
  const { i18n } = useTranslation();
  const { title, description, dataInfo1, dataInfo2 } =
    translations[i18n.language];
  const defaultColor = layer.get('defaultColor');
  const colors = layer.get('colors');
  const shortToLongName = layer.get('shortToLongName');

  // SBB , BLS, SOB
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
      <p>
        <Link href="https://www.tvs.ch/">www.tvs.ch</Link>
      </p>
      <div>
        {operators.map(([shortName, longName]) => {
          const color = colors[shortName] || defaultColor;
          return (
            <OperatorLegend
              key={shortName}
              color={color}
              longName={longName}
              shortName={shortName}
            />
          );
        })}
      </div>
      <p>
        {othersOperators.map((shortName) => {
          return (
            <OperatorShortAndLongName
              key={shortName}
              shortName={shortName}
              longName={shortToLongName[shortName]}
            />
          );
        })}
      </p>
      <p>
        {dataInfo1}
        <br />
        {dataInfo2}
      </p>
    </div>
  );
};

IsbTVSLayerInfo.propTypes = propTypes;

export default React.memo(IsbTVSLayerInfo);
