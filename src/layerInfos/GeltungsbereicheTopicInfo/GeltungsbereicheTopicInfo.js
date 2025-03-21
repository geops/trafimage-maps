import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import DataLink from "../../components/DataLink";

const comps = {
  de: (
    <>
      <Typography paragraph>
        Diese Karte zeigt die aktuellen Geltungsbereiche der verschiedenen
        Abonnemente für den öffentlichen Verkehr (öV) in der Schweiz. Die Daten
        werden aus der öV-Vertriebsdatenbank entnommen und für diese Ansicht
        aufbereitet. Die Aktualisierung der Karte erfolgt zweimal pro Jahr (Juni
        und Dezember). Die Karte ist seit Anfang 2023 öffentlich zugänglich und
        auf einigen Webseiten von beteiligten Transportunternehmen integriert.
        Alle Angaben ohne Gewähr.
      </Typography>
      <Typography>Datenstand Januar 2025</Typography>
    </>
  ),
  fr: (
    <>
      <Typography paragraph>
        Cette carte montre les rayons de validité actuels des différents
        abonnements de transports publics en Suisse. Les données sont extraites
        de la base de données de distribution des transports publics et traitées
        pour constituer cet affichage. La carte est mise à jour deux fois par an
        (en juin et en décembre). La carte est en libre accès depuis début 2023
        et intégrée aux sites Internet de certaines entreprises de transport
        participantes. Informations fournies sans garantie.
      </Typography>
      <Typography>État des données janvier 2025</Typography>
    </>
  ),
  it: (
    <>
      <Typography paragraph>
        La mappa mostra il raggio di validità dei vari abbonamenti ai trasporti
        pubblici svizzeri. I dati provengono dalla banca dati dei trasporti
        pubblici e sono stati elaborati per questa visualizzazione.
        L’aggiornamento avviene due volte all’anno (giugno e dicembre). La mappa
        viene pubblicata dall’inizio del 2023 ed è integrata in alcuni siti web
        delle imprese di trasporto partecipanti. Tutte le informazioni si
        intendono senza garanzia.
      </Typography>
      <Typography>Aggiornamento dei dati gennaio 2025</Typography>
    </>
  ),
  en: (
    <>
      <Typography paragraph>
        This map shows the current areas of validity of the various public
        transport travelcards in Switzerland. The data is taken from the public
        transport sales database and then prepared for this form of
        presentation. The map is updated twice a year (June and December). The
        map has been publicly accessible since the beginning of 2023 and has
        been integrated into the websites of some participating transport
        companies. No liability is taken for the accuracy of this information.
      </Typography>
      <Typography>Data status January 2025</Typography>
    </>
  ),
};

function GeltungsbereicheTopicInfo() {
  const { i18n, t } = useTranslation();
  return (
    <div>
      {comps[i18n.language]}
      <hr />
      <p>
        <DataLink href="https://geo.sbb.ch/portal/home/group.html?id=4778f8efa0ad41a6829f0094339158e2#overview">
          {t("Zu den Trafimage-Datensätzen im SBB Geoportal (SBB-intern)")}
        </DataLink>
      </p>
    </div>
  );
}

export default GeltungsbereicheTopicInfo;
