import React from 'react';

const comps = {
  de: (
    <div>
      <p>
        Die Infrastrukturkarte zeigt die komplette Schweizer
        Eisenbahninfrastruktur inkl. den streckenbezogenen Betriebspunkten. In
        der Karte kann zwischen der Infrastruktur der SBB inkl.
        Tochtergesellschaften und der Infrasturktur der übrigen
        Eisenbahnunternehmen unterschieden werden. Das Kartenmaterial dient in
        erster Linie bei SBB-internen Kartenthemen als Hintergrundkarte.
      </p>
      <p>Die Daten und die Kartengrundlage werden jährlich aktualisiert.</p>
      <p>
        Verantwortlich: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  fr: (
    <div>
      <p>
        La carte des infrastructures indique l’emplacement de toutes les
        infrastructures ferroviaires de Suisse, points d’exploitation propres
        aux tronçons compris. Cette carte réalise une distinction entre les
        infrastructures des CFF et de leurs filiales, d’une part, et celles des
        autres entreprises de chemin de fer, d’autre part. Elle est conçue en
        premier lieu pour servir de référence dans le cadre des thèmes internes
        aux CFF en matière de cartographie.
      </p>
      <p>
        Les données et la base cartographique sont mises à jour chaque année.
      </p>
      <p>
        Responsable: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  en: (
    <div>
      <p>
        The infrastructure map shows all Swiss railway infrastructure including
        route operating points. The map differentiates between SBB
        infrastructure, including subsidiaries, and the infrastructure of other
        railway companies. The map is primarily used as a background map for SBB
        internal map topics.
      </p>
      <p>The data and the map base are updated annually.</p>
      <p>
        Contact person: Trafimage System Manager Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  it: (
    <div>
      <p>
        La cartina infrastruttura mostra l’intera infrastruttura ferroviaria
        della Svizzera, comprensiva dei punti di esercizio per una determinata
        tratta. La cartina distingue tra l’infrastruttura delle FFS (con
        relative società affiliate) e l’infrastruttura delle altre imprese
        ferroviarie. Il materiale cartografico serve principalmente da supporto
        per le cartine tematiche interne alle FFS.
      </p>
      <p>I dati e la base cartografica vengono aggiornati annualmente.</p>
      <p>
        Responsabile: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
};

const InfrastrukturTopicInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(InfrastrukturTopicInfo);
