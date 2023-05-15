import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import DvLegendLine from '../../config/ch.sbb.direktverbindungen/DvLegendLine/DvLegendLine';

const useStyles = makeStyles({
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
});

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const comps = {
  day: {
    de: (
      <p>
        Diese Karte bildet alle Fernverkehrsverbindungen ab, welche den Tag
        durch direkt ab der Schweiz nach Europa verkehren.
      </p>
    ),
    fr: (
      <p>
        Cette carte représente toutes les liaisons longue distance qui circulent
        toute la journée directement de la Suisse vers l&apos;Europe.
      </p>
    ),
    en: (
      <p>
        This map shows all long-distance train services that run directly from
        Switzerland to Europe during the day.
      </p>
    ),
    it: (
      <p>
        Questa mappa mostra tutti i collegamenti a lunga percorrenza che
        circulano direttamente tra la Svizzera e l&apos;Europa durante il
        giorno.
      </p>
    ),
  },
  night: {
    de: (
      <p>
        Diese Karte bildet alle Fernverkehrsverbindungen ab, welche über Nacht
        direkt ab der Schweiz nach Europa verkehren.
      </p>
    ),
    fr: (
      <p>
        Cette carte représente toutes les relations de trafic longue distance
        qui circulent la nuit directement de la Suisse vers l&apos;Europe.
      </p>
    ),
    en: (
      <p>
        This map shows all long-distance train services run overnight directly
        from Switzerland to Europe.
      </p>
    ),
    it: (
      <p>
        Questa mappa mostra tutti i servizi a lunga percorrenza che circulano
        durante la notte direttamente tra la Svizzera e l&apos;Europa.
      </p>
    ),
  },
};

const DvLayerInfo = ({ t, language, properties }) => {
  const classes = useStyles();
  return (
    <div>
      {comps[properties.get('routeType')][language]}
      <div className={classes.legendItem}>
        <DvLegendLine color={properties.get('color')} />
        <div>{t(properties.key)}</div>
      </div>
    </div>
  );
};

DvLayerInfo.propTypes = propTypes;

export default React.memo(DvLayerInfo);
