import React from "react";
import { useTranslation } from "react-i18next";
import DataLink from "../../components/DataLink";

const translations = {
  de: {
    title: "Infrastrukturbetreiberinnen",
    description:
      "Die Karte der Normalspur- und Schmalspur-Infrastrukturbetreiberinnen zeigt farblich unterscheidbar deren geographische Ausbreitung. Beim Anklicken einer Strecke öffnen sich weitere Informationen, insbesondere zum Netzzugang als Eisenbahnverkehrsunternehmen.",
    responsible: "Verantwortlich",
    responsibleContent: "SBB Infrastruktur - Netzzugang",
  },
  fr: {
    title: "Gestionnaires d'infrastructure",
    description:
      "La carte des gestionnaires d'infrastructure à voie normale et à voie étroite montre, par des couleurs distinctes, leur extension géographique. En cliquant sur une ligne, des informations supplémentaires s'ouvrent, notamment sur l'accès au réseau en tant qu'entreprise de transport ferroviaire.",
    responsible: "Responsable",
    responsibleContent: "CFF Infrastructure - Accès au réseau",
  },
  en: {
    title: "Infrastructure managers",
    description:
      "The map of the standard and narrow gauge infrastructure managers shows their geographical spread in different colours. Clicking on a route opens further information, in particular on network access as a railway undertaking.",
    responsible: "Responsible",
    responsibleContent: "SBB Infrastructure - Network Access",
  },
  it: {
    title: "Gestori dell’infrastruttura",
    description:
      "La cartina dei gestori di infrastrutture a scartamento normale e a scartamento ridotto mostra la loro diffusione geografica in diversi colori. Cliccando su un percorso si aprono ulteriori informazioni, in particolare sull'accesso alla rete come impresa ferroviaria.",
    responsible: "Responsabile",
    responsibleContent: "FFS Infrastruttura - Accesso alla rete",
  },
};

function IsbTopicInfo() {
  const { i18n, t } = useTranslation();
  const { title, description, responsible, responsibleContent } =
    translations[i18n.language];
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <p>
        {responsible}:
        <br />
        {responsibleContent},
        <br />
        <a href="mailto:netzzugang@sbb.ch">netzzugang@sbb.ch</a>.
      </p>
      <hr />
      <p>
        <DataLink href="https://data.sbb.ch/explore/dataset/infrastrukturbetreiberinnen/information/" />
      </p>
      <p>
        <DataLink href="https://geo.sbb.ch/portal/home/group.html?id=4778f8efa0ad41a6829f0094339158e2#overview">
          {t("Zu den Trafimage-Datensätzen im SBB Geoportal (SBB-intern)")}
        </DataLink>
      </p>
    </div>
  );
}

export default React.memo(IsbTopicInfo);
