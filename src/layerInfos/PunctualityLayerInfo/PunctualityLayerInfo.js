import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import './PunctualityLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const PunctualityLayerInfo = ({ language, t }) => {
  const delays = [
    {
      color: '#00a00c', // green
      legend: 'ch.sbb.puenktlichkeit-ontime',
    },
    {
      color: '#f7bf00', // yellow
      legend: 'ch.sbb.puenktlichkeit-medium-delay',
    },
    {
      color: '#e13f20', // red
      legend: 'ch.sbb.puenktlichkeit-high-delay',
    },
    {
      dashed: true,
      color: '#a0a0a0', // grey
      legend: 'ch.sbb.puenktlichkeit-journey-no-realtime',
    },
    {
      color: '#a0a0a0', // grey
      legend: 'ch.sbb.puenktlichkeit-company-no-realtime',
    },
    {
      character: String.fromCodePoint(0x00d7),
      legend: 'Ausfall',
    },
  ];

  const legend = delays.map((d) => (
    <div className="tm-punctuality-delay">
      {d.character ? (
        <span className="tm-punctuality-character">{d.character}</span>
      ) : (
        <svg height="23" width="23">
          <circle
            cx="11"
            cy="11"
            r="10"
            fill={d.color}
            strokeWidth="1.5"
            stroke="#404040"
            strokeDasharray={d.dashed ? '5 3' : null}
          />
        </svg>
      )}
      <span>{t(d.legend)}</span>
    </div>
  ));

  const comps = {
    de: (
      <div>
        Der Zugtracker zeigt die aktuellen Verbindungen basierend auf dem Soll-
        und Ist-Fahrplan des Schweizer ÖV.
        <p>{legend}</p>
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
        <p>{legend}</p>
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
        <p>{legend}</p>
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
        <p>{legend}</p>
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

export default withTranslation()(PunctualityLayerInfo);
