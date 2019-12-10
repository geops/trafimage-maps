import React from 'react';

const comps = {
  de: (
    <div>
      Nützliche Informationen zum barrierefreien Reisen mit SBB und Privatbahnen
      sowie zur Ausrüstung von Bahnhöfen.
      <p>
        Verantwortlich: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </div>
  ),
  fr: (
    <div>
      Vous trouverez sur cette carte des informations utiles pour voyager en
      toute autonomie avec les CFF et les chemins de fer privés ainsi que des
      renseignements sur l’équipement des gares.
      <p>
        Responsable: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </div>
  ),
  en: (
    <div>
      Information about accessible travel with SBB and private railways as well
      as about equipment at railway stations.
      <p>
        Responsible: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </div>
  ),
  it: (
    <div>
      Informazioni utili per viaggiare senza barriere con le FFS e le ferrovie
      private e sulla dotazione delle stazioni.
      <p>
        Responsabile: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </div>
  ),
};

const HandicapTopicInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(HandicapTopicInfo);
