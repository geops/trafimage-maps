import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';

const useStyles = makeStyles({
  legendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  itemColor: {
    width: 30,
    height: 20,
    margin: 5,
    marginLeft: 0,
    border: '1px solid #767676',
  },
});

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const comps = {
  de: (
    <p>
      Diese Karte bildet alle Fernverkehrsverbindungen ab, welche über Nacht
      direkt ab der Schweiz nach Europa verkehren.
    </p>
  ),
  fr: (
    <p>
      Cette carte représente toutes les relations de trafic longue distance qui
      circulent la nuit directement de la Suisse vers l&apos;Europe.
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
};

const IpvNachtLayerInfo = ({ t, language, properties }) => {
  const classes = useStyles();
  return (
    <div>
      {comps[language]}
      <div className={classes.legendItem}>
        <div
          className={classes.itemColor}
          style={{ backgroundColor: properties.get('color') }}
        />
        <div>{t(properties.key)}</div>
      </div>
    </div>
  );
};

IpvNachtLayerInfo.propTypes = propTypes;

export default React.memo(IpvNachtLayerInfo);
