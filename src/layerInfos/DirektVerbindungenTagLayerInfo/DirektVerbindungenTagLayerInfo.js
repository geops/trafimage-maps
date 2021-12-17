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
      Diese Karte bildet alle Fernverkehrsverbindungen ab, welche den Tag durch
      direkt ab der Schweiz nach Europa verkehren.
    </div>
  ),
  fr: (
    <div>
      Cette carte représente toutes les liaisons longue distance qui circulent
      toute la journée directement de la Suisse vers l&apos;Europe.
    </div>
  ),
  en: (
    <div>
      This map shows all long-distance train services that run directly from
      Switzerland to Europe during the day.
    </div>
  ),
  it: (
    <div>
      Questa mappa mostra tutti i collegamenti a lunga percorrenza che circulano
      direttamente tra la Svizzera e l&apos;Europa durante il giorno.
    </div>
  ),
};

const DirektVerbindungenTagLayerInfo = ({ t, language, properties }) => {
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

DirektVerbindungenTagLayerInfo.propTypes = propTypes;

export default React.memo(DirektVerbindungenTagLayerInfo);
