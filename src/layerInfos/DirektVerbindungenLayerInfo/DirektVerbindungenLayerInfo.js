import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import DataLink from '../../components/DataLink';

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
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const DirektVerbindungenLayerInfo = ({ properties: layer }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const legend = layer.children.reverse().map((child) => (
    <div className={classes.legendItem} key={child.key}>
      <div
        className={classes.itemColor}
        style={{ backgroundColor: child.get('color') }}
      />
      <div>{t(child.name)}</div>
    </div>
  ));

  const dataLink = layer.get('dataLink') && (
    <>
      <hr />
      <p style={{ marginBottom: 0 }}>
        <DataLink layer={layer} />
      </p>
    </>
  );
  return (
    <>
      {i18n.language === 'de' && (
        <div>
          <p>
            Die Karte bildet alle Fernverkehrsverbindungen ab, welche direkt ab
            der Schweiz nach Europa verkehren. Auf der Karte können
            Informationen zu allen abgebildeten Linien mit einem Klick abgefragt
            werden. Es besteht die Option nur Tages- oder nur Nachtzuglinien
            anzuzeigen.
          </p>
          <div>{legend}</div>
          <p>
            Datenstand 11. Dezember 2022.
            <br />
            Die Karte wird jährlich zum Fahrplanwechsel aktualisiert.
            <br />
            Internationaler Personenverkehr, SBB AG
          </p>
          {dataLink}
        </div>
      )}
      {i18n.language === 'fr' && (
        <div>
          <p>
            La carte représente toutes les liaisons longue distance qui
            circulent directement de la Suisse vers l&apos;Europe. Sur la carte,
            il est possible d&apos;obtenir des informations sur toutes les
            lignes représentées en un seul clic. Il est possible d&apos;afficher
            uniquement les lignes de jour ou uniquement les lignes de nuit.
          </p>
          <div>{legend}</div>
          <p>
            Mise à jour des données le 11 décembre 2022.
            <br />
            La carte est actualisée chaque année lors du changement
            d&apos;horaire.
            <br />
            Trafic voyageurs international, CFF SA
          </p>
          {dataLink}
        </div>
      )}
      {i18n.language === 'en' && (
        <div>
          <p>
            The map shows all long-distance services that run directly from
            Switzerland to Europe. Information on all the lines shown on the map
            can be called up with one click. There is the option to display only
            day or only night train lines.
          </p>
          <div>{legend}</div>
          <p>
            Data updated on 11 December 2022.
            <br />
            The map is updated annually at the time of the timetable change.
            <br />
            International Passenger Traffic, SBB
          </p>
          {dataLink}
        </div>
      )}
      {i18n.language === 'it' && (
        <div>
          <p>
            La mappa mostra tutti i collegamenti a lunga percorrenza che
            circolano direttamente tra la Svizzera e l&apos;Europa. Le
            informazioni su tutte le linee mostrate sulla mappa possono essere
            richiamate con un clic. C&apos;è l&apos;opzione di visualizzare solo
            le linee ferroviarie diurne o solo quelle notturne.
          </p>
          <div>{legend}</div>
          <p>
            Stato dei dati 11 dicembre 2022.
            <br />
            La mappa viene aggiornata ogni anno al momento del cambio
            d&apos;orario.
            <br />
            Traffico passeggeri internazionale, FFS
          </p>
          {dataLink}
        </div>
      )}
    </>
  );
};

DirektVerbindungenLayerInfo.propTypes = propTypes;

export default React.memo(DirektVerbindungenLayerInfo);
