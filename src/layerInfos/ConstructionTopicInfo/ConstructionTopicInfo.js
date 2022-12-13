import React from 'react';
import { useTranslation } from 'react-i18next';
import DataLink from '../../components/DataLink';

const comps = {
  de: (
    <>
      <p>
        Auf dieser Karte finden Sie eine Auswahl von Bahnausbau- und
        Unterhaltsprojekten der SBB – solche, die in Planung sind und solche,
        die ausgeführt werden. Jeder Eintrag enthält Links zu Webseiten oder
        Faktenblättern mit den wichtigsten Projektinformationen.
      </p>
      <p>
        Verantwortlich: Kommunikation SBB Infrastruktur,&nbsp;
        <a href="mailto:Kommunikation-Infrastruktur@sbb.ch">
          Kommunikation-Infrastruktur@sbb.ch
        </a>
        .
      </p>
    </>
  ),
  fr: (
    <>
      <p>
        Sur cette carte, vous trouverez une sélection de projets d’aménagement
        et de maintenance des CFF, qu’ils soient planifiés ou déjà en cours de
        réalisation. Chaque entrée contient des liens vers des sites web et des
        fiches d’information comprenant les informations les plus importantes
        sur le projet en question.
      </p>
      <p>
        Responsable: Communication CFF Infrastructure,&nbsp;
        <a href="mailto:Kommunikation-Infrastruktur@sbb.ch">
          Kommunikation-Infrastruktur@sbb.ch
        </a>
        .
      </p>
    </>
  ),
  en: (
    <>
      <p>
        This map shows you a selection of SBB’s rail upgrades and maintenance
        projects – some that are still in the planning stages and others that
        are currently being implemented. Each entry contains links to websites
        or fact sheets with the most important project information.
      </p>
      <p>
        Responsibility lies with: Communications at SBB Infrastructure,&nbsp;
        <a href="mailto:Kommunikation-Infrastruktur@sbb.ch">
          Kommunikation-Infrastruktur@sbb.ch
        </a>
        .
      </p>
    </>
  ),
  it: (
    <>
      <p>
        Su questa cartina è riportata una gamma di progetti di manutenzione e
        ampliamento ferroviario delle FFS. Alcuni sono pianificati e altri sono
        in fase di realizzazione. Ciascun elemento contiene link a pagine
        Internet o schede informative con le informazioni più importanti sul
        progetto.
      </p>
      <p>
        Responsabile: Comunicazione FFS Infrastruttura,&nbsp;
        <a href="mailto:Kommunikation-Infrastruktur@sbb.ch">
          Kommunikation-Infrastruktur@sbb.ch
        </a>
        .
      </p>
    </>
  ),
};

function ConstructionTopicInfo() {
  const { i18n } = useTranslation();
  return (
    <div>
      {comps[i18n.language]}
      <hr />
      <p>
        <DataLink href="https://data.sbb.ch/explore/dataset/construction-projects/information/" />
      </p>
    </div>
  );
}

export default React.memo(ConstructionTopicInfo);
