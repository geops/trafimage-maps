import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const defaultProps = {};

const PunctualityLayerInfo = ({ language, t, staticFilesUrl }) => {
  const img = (
    <img
      src={`${staticFilesUrl}/img/layers/puenktlichkeit/puenktlichkeit_legend_${language}.png`}
      draggable="false"
      alt={t('Kein Bildtext')}
    />
  );

  const comps = {
    de: (
      <div>
        Der Zugtracker zeigt die aktuellen Verbindungen basierend auf dem Soll-
        und Ist-Fahrplan des Schweizer ÖV.
        <p>{img}</p>
        <p>
          Daten:&nbsp;
          <a
            href="https://opentransportdata.swiss/"
            rel="noopener noreferrer"
            target="_blank"
          >
            opentransportdata.swiss
          </a>
          .
        </p>
      </div>
    ),
    fr: (
      <div>
        Le train tracker indique les trajets en cours en se basant sur l’horaire
        théorique et réel des transports publiques suisses.
        <p>{img}</p>
        <p>
          Données:&nbsp;
          <a
            href="https://opentransportdata.swiss/"
            rel="noopener noreferrer"
            target="_blank"
          >
            opentransportdata.swiss
          </a>
          .
        </p>
      </div>
    ),
    en: (
      <div>
        The train tracker shows current connections based on the planned and
        actual timetable for Swiss public transport.
        <p>{img}</p>
        <p>
          Data:&nbsp;
          <a
            href="https://opentransportdata.swiss/"
            rel="noopener noreferrer"
            target="_blank"
          >
            opentransportdata.swiss
          </a>
          .
        </p>
      </div>
    ),
    it: (
      <div>
        Il train tracker mostra i collegamenti aggiornati sulla base dell’orario
        teorico e attuale dei trasporti pubblici svizzeri.
        <p>{img}</p>
        <p>
          Dati:&nbsp;
          <a
            href="https://opentransportdata.swiss/"
            rel="noopener noreferrer"
            target="_blank"
          >
            opentransportdata.swiss
          </a>
          .
        </p>
      </div>
    ),
  };

  return comps[language];
};

PunctualityLayerInfo.propTypes = propTypes;
PunctualityLayerInfo.defaultProps = defaultProps;

export default compose(withTranslation())(PunctualityLayerInfo);
