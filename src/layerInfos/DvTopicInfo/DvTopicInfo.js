import React from "react";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { dvDay, dvNight } from "../../config/ch.sbb.direktverbindungen";
import DataLink from "../../components/DataLink";
import DvLegendLine from "../../config/ch.sbb.direktverbindungen/DvLegendLine/DvLegendLine";

const useStyles = makeStyles({
  legendItem: {
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
});

function DvTopicInfo() {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const legend = [dvDay, dvNight].map((layer) => (
    <div className={classes.legendItem} key={layer.key}>
      <DvLegendLine color={layer.get("color")} />
      <div>{t(layer.name)}</div>
    </div>
  ));
  const dataLink = dvDay.get("dataLink") && (
    <>
      <hr />
      <p style={{ marginBottom: 0 }}>
        <DataLink layer={dvDay} />
      </p>
      <p>
        <DataLink href="https://geo.sbb.ch/site/rest/services/Trafimage_PUBLIC/">
          {t("Diesen Datensatz als Service einbinden (SBB-intern)")}
        </DataLink>
      </p>
    </>
  );
  return (
    <>
      {i18n.language === "de" && (
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
            Datenstand Dezember 2023.
            <br />
            Die Karte wird jährlich zum Fahrplanwechsel aktualisiert.
            <br />
            Direktverbindungen nach Europa, SBB AG
          </p>
          {dataLink}
        </div>
      )}
      {i18n.language === "fr" && (
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
            Mise à jour des données en décembre 2023.
            <br />
            La carte est actualisée chaque année lors du changement
            d&apos;horaire.
            <br />
            Trafic voyageurs international, CFF SA
          </p>
          {dataLink}
        </div>
      )}
      {i18n.language === "en" && (
        <div>
          <p>
            The map shows all long-distance services that run directly from
            Switzerland to Europe. Information on all the lines shown on the map
            can be called up with one click. There is the option to display only
            day or only night train lines.
          </p>
          <div>{legend}</div>
          <p>
            Data updated in December 2023.
            <br />
            The map is updated annually at the time of the timetable change.
            <br />
            International Passenger Traffic, SBB
          </p>
          {dataLink}
        </div>
      )}
      {i18n.language === "it" && (
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
            Stato dei dati dicembre 2023.
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
}

export default React.memo(DvTopicInfo);
