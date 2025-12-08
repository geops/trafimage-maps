import React from "react";
import useTranslation from "../../utils/useTranslation";
import DataLink from "../../components/DataLink";

const comps = {
  de: (
    <>
      <p>
        Nützliche Informationen zum barrierefreien Reisen mit SBB und
        Privatbahnen sowie zur Ausrüstung von Bahnhöfen.
      </p>
      <p>
        Verantwortlich: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </>
  ),
  fr: (
    <>
      <p>
        Vous trouverez sur cette carte des informations utiles pour voyager en
        toute autonomie avec les CFF et les chemins de fer privés ainsi que des
        renseignements sur l’équipement des gares.
      </p>
      <p>
        Responsable: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </>
  ),
  en: (
    <>
      <p>
        Information about accessible travel with SBB and private railways as
        well as about equipment at railway stations.
      </p>
      <p>
        Responsible: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </>
  ),
  it: (
    <>
      <p>
        Informazioni utili per viaggiare senza barriere con le FFS e le ferrovie
        private e sulla dotazione delle stazioni.
      </p>
      <p>
        Responsabile: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </>
  ),
};

function HandicapTopicInfo() {
  const { i18n } = useTranslation();
  return (
    <div>
      {comps[i18n.language]}
      <hr />
      <p>
        <DataLink href="https://opentransportdata.swiss/de/cookbook/accessibility/" />
      </p>
    </div>
  );
}

export default React.memo(HandicapTopicInfo);
