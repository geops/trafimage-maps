import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';

const useStyles = makeStyles({
  legendItem: {
    margin: '10px 0',
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
    <div>
      Diese Karte bildet alle Fernverkehrsverbindungen ab, welche über Nacht
      direkt ab der Schweiz nach Europa verkehren.
    </div>
  ),
  fr: (
    <div>
      Cette carte représente toutes les relations de trafic longue distance qui
      circulent la nuit directement de la Suisse vers l&apos;Europe.
    </div>
  ),
  en: (
    <div>
      This map shows all long-distance train services run overnight directly
      from Switzerland to Europe.
    </div>
  ),
  it: (
    <div>
      Questa mappa mostra tutti i servizi a lunga percorrenza che circulano
      durante la notte direttamente tra la Svizzera e l&apos;Europa.
    </div>
  ),
};

const DirektVerbindungenNachtLayerInfo = ({ t, language, properties }) => {
  const classes = useStyles();
  return (
    <>
      {comps[language]}
      <div className={classes.legendItem}>
        <div
          className={classes.itemColor}
          style={{ backgroundColor: properties.get('color') }}
        />
        <div>{t(properties.key)}</div>
      </div>
    </>
  );
};

DirektVerbindungenNachtLayerInfo.propTypes = propTypes;

export default React.memo(DirektVerbindungenNachtLayerInfo);
