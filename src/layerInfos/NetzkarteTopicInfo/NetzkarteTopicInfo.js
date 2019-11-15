import React from 'react';

const comps = {
  de: (
    <div>
      Die Netzkarte richtet sich an die Nutzerinnen und Nutzer des öffentlichen
      Verkehrs. Es handelt sich um eine Basiskarte auf der Grundlage von
      Fahrplandaten. Direkt auf der Karte können mit einem Klick auf die
      gewünschte Station die entsprechenden Informationen abgefragt werden.
      Unter Layer gibt es weitere Inhalte, die auf der Karte abgebildet werden
      können.
      <p>
        Verantwortlich: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  fr: (
    <div>
      La carte du réseau est destinée aux utilisatrices et utilisateurs des
      transports publics. Il s’agit d’une carte de base reposant sur les données
      horaire. Il est possible de consulter les informations relatives à une
      gare donnée en cliquant directement sur la carte. D’autres contenus
      pouvant être représentés sur la carte figurent sous «Couche».
      <p>
        Responsable: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@cff.ch">trafimage@cff.ch</a>.
      </p>
    </div>
  ),
  en: (
    <div>
      The network map is aimed at public transport users. It is a basic map
      derived from timetable data. Relevant information can be accessed directly
      from the map by clicking on the required station. Under Layer, there is
      further content which can be displayed on the map.
      <p>
        Responsible: Trafimage System Manager Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  it: (
    <div>
      La carta di rete è destinata agli utenti dei trasporti pubblici. Si tratta
      di una cartina di base che fa riferimento ai dati dell’orario. È
      sufficiente fare clic sulla stazione desiderata direttamente sulla cartina
      per consultare le informazioni corrispondenti. Alla voce «Layer» sono
      disponibili ulteriori contenuti che possono essere visualizzati sulla
      carta.
      <p>
        Responsabile: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@ffs.ch">trafimage@ffs.ch</a>.
      </p>
    </div>
  ),
};

const NetzkarteTopicInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(NetzkarteTopicInfo);
