import React, { useMemo } from "react";
import useTranslation from "../../utils/useTranslation";
import {
  DV_DAY_LAYER_KEY,
  DV_NIGHT_LAYER_KEY,
  getDirektverbindungenLayers,
} from "../../config/ch.sbb.direktverbindungen";
import DataLink from "../../components/DataLink";
import DvLegendLine from "../../config/ch.sbb.direktverbindungen/DvLegendLine/DvLegendLine";

function DvTopicInfo() {
  const { t, i18n } = useTranslation();

  const layers = useMemo(() => {
    return getDirektverbindungenLayers();
  }, []);

  const dvDay = layers.find((l) => l.key === DV_DAY_LAYER_KEY);
  const dvNight = layers.find((l) => l.key === DV_NIGHT_LAYER_KEY);
  const legend = [dvDay, dvNight].map((layer) => (
    <div
      style={{
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
      key={layer.key}
    >
      <DvLegendLine color={layer.get("color")} />
      {t(layer.name)}
    </div>
  ));
  const dataLink = dvDay.get("dataLink") && (
    <>
      <hr />
      <p style={{ marginBottom: 0 }}>
        <DataLink layer={dvDay} />
      </p>
      <p>
        <DataLink href="https://geo.sbb.ch/portal/home/group.html?id=4778f8efa0ad41a6829f0094339158e2#overview">
          {t("Zu den Trafimage-Datensätzen im SBB Geoportal (SBB-intern)")}
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
          {legend}
          <p>
            Datenstand Dezember 2025.
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
          {legend}
          <p>
            Mise à jour des données en décembre 2025.
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
          {legend}
          <p>
            Data updated in December 2025.
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
          {legend}
          <p>
            Stato dei dati dicembre 2025.
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
