import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import Link from '../../components/Link';

const useStyles = makeStyles({
  legend: {
    maxHeight: 150,
    overflowY: 'auto',
  },
  legendItem: {
    margin: '0 0 5 0',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  legendSymbol: {
    width: 35,
    minWidth: 35,
    height: 18,
    margin: 5,
    marginLeft: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 35px',
  },
  legendText: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    padding: '0 3px',
    fontSize: 13,
    transform: 'scale(.8)',
  },
  legendLine: {
    position: 'absolute',
    width: 4,
    height: 35,
    transform: 'rotate(90deg)',
  },
});

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
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

const colors = {
  'SBB CFF FFS': 'rgba(209, 1, 7, 1)',
  BLS: 'rgba(53,164,48, 1)',
  SOB: 'rgba(195, 156, 54, 1)',
  default: 'rgba(0,91,169 , 1)',
};

const InfrastrukturBetreiberTVSLayerInfo = ({
  t,
  language,
  properties: layer,
}) => {
  const classes = useStyles();
  const { title, description, dataInfo1, dataInfo2 } = translations[language];
  return (
    <div>
      {title}
      <p>{description}</p>
      <div className={classes.legend}>
        {Object.entries(layer.get('shortToLongName')).map(
          ([shortName, longName]) => {
            const color = colors[shortName] || colors.default;
            return (
              <div className={classes.legendItem} key={shortName}>
                <div className={classes.legendSymbol}>
                  <div
                    className={classes.legendLine}
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className={classes.legendText}
                    style={{ backgroundColor: color }}
                  >
                    <span>{shortName.substring(0, 3)}</span>
                  </div>
                </div>
                <div>{t(longName)}</div>
              </div>
            );
          },
        )}
      </div>
      <p>
        <Link href="www.tvs.ch">www.tvs.ch</Link>
        {dataInfo1}
        <br />
        {dataInfo2}
      </p>
    </div>
  );
};

InfrastrukturBetreiberTVSLayerInfo.propTypes = propTypes;

export default React.memo(InfrastrukturBetreiberTVSLayerInfo);
