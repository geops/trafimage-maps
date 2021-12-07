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

const DirektVerbindungenLayerInfo = ({ t, language, properties }) => {
  const classes = useStyles();
  const legend = (
    <div>
      <div className={classes.legendItem}>
        <div
          className={classes.itemColor}
          style={{ backgroundColor: properties.children[0].get('color') }}
        />
        <div>{t(properties.children[0].key)}</div>
      </div>
      <div className={classes.legendItem}>
        <div
          className={classes.itemColor}
          style={{ backgroundColor: properties.children[1].get('color') }}
        />
        <div>{t(properties.children[1].key)}</div>
      </div>
    </div>
  );
  return (
    <>
      {language === 'de' && (
        <div>
          Die Karte bildet alle Fernverkehrsverbindungen ab, welche direkt ab
          der Schweiz nach Europa verkehren. Auf der Karte können Informationen
          zu allen abgebildeten Linien mit einem Klick abgefragt werden. Es
          besteht die Option nur Tages- oder nur Nachtzuglinien anzuzeigen.
          <br />
          <div>{legend}</div>
          <p>
            Datenstand 12. Dezember 2021.
            <br />
            Die Karte wird jährlich zum Fahrplanwechsel aktualisiert.
            <br />
            Internationaler Personenverkehr, SBB AG
          </p>
        </div>
      )}
      {language === 'fr' && (
        <div>
          La carte représente toutes les liaisons longue distance qui circulent
          directement de la Suisse vers l&apos;Europe. Sur la carte, il est
          possible d&apos;obtenir des informations sur toutes les lignes
          représentées en un seul clic. Il est possible d&apos;afficher
          uniquement les lignes de jour ou uniquement les lignes de nuit.
          <br />
          <div>{legend}</div>
          <p>
            Mise à jour des données le 12 décembre 2021.
            <br />
            La carte est actualisée chaque année lors du changement
            d&apos;horaire.
            <br />
            Trafic voyageurs international, CFF SA
          </p>
        </div>
      )}
      {language === 'en' && (
        <div>
          The map shows all long-distance services that run directly from
          Switzerland to Europe. Information on all the lines shown on the map
          can be called up with one click. There is the option to display only
          day or only night train lines.
          <br />
          <div>{legend}</div>
          <p>
            Data updated on 12 December 2021.
            <br />
            The map is updated annually at the time of the timetable change.
            <br />
            International Passenger Traffic, SBB
          </p>
        </div>
      )}
      {language === 'it' && (
        <div>
          La mappa mostra tutti i collegamenti a lunga percorrenza che circolano
          direttamente tra la Svizzera e l&apos;Europa. Le informazioni su tutte
          le linee mostrate sulla mappa possono essere richiamate con un clic.
          C&apos;è l&apos;opzione di visualizzare solo le linee ferroviarie
          diurne o solo quelle notturne.
          <br />
          <div>{legend}</div>
          <p>
            Stato dei dati 12 dicembre 2021.
            <br />
            La mappa viene aggiornata ogni anno al momento del cambio
            d&apos;orario.
            <br />
            Traffico passeggeri internazionale, FFS
          </p>
        </div>
      )}
    </>
  );
};

DirektVerbindungenLayerInfo.propTypes = propTypes;

export default React.memo(DirektVerbindungenLayerInfo);
