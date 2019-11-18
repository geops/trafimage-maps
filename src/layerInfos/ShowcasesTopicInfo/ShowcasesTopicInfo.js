import React from 'react';

const comps = {
  de: (
    <div>
      Das Kartenthema zeigt verschiedene Varianten der Trafimage Netzkarte.
      <p>
        Die Karten unterscheiden sich im Hinblick auf die Informationsdichte und
        die farbliche Gestaltung. Für die flexible Erstellung dieser und
        weiterer Karten nutzen wir unseren Web-basierten Workflow, welcher von
        Datenintegration über Styling bis hin zur Publikation alle Aspekte der
        Kartenproduktion abdeckt.
      </p>
      <p>
        Verantwortlich: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  fr: (
    <div>
      La carte thématique présente différentes variantes de la carte de réseau
      Trafimage.
      <p>
        Les cartes se différencient par la densité des informations présentées
        et l’agencement des couleurs. Pour la création flexible de ces cartes et
        d’autres, nous utilisons notre workflow basé sur le Web, qui couvre tous
        les aspects de la production de cartes, de l’intégration des données à
        la publication, en passant par le style.
      </p>
      <p>
        Responsable: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  en: (
    <div>
      The map theme shows different variants of the Trafimage network map.
      <p>
        The maps differ in terms of level of information and colour design. For
        the flexible creation of these and other maps, we use our web-based
        workflow, which covers all aspects of map production from data
        integration and styling to publication.
      </p>
      <p>
        Contact person: Trafimage System Manager Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
  it: (
    <div>
      Il tema carta mostra diverse varianti della carta della rete Trafimage.
      <p>
        Le carte si differenziano a livello cromatico e di quantità
        d’informazioni. Per la configurazione flessibile delle carte utilizziamo
        il nostro workflow basato su web, che copre tutti gli aspetti della
        produzione della carta (dall’integrazione dei dati, allo styling, alla
        pubblicazione).
      </p>
      <p>
        Responsabile: Fachbus Trafimage, Daniel Hofstetter,&nbsp;
        <a href="mailto:trafimage@sbb.ch">trafimage@sbb.ch</a>.
      </p>
    </div>
  ),
};

const ShowcasesTopicInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(ShowcasesTopicInfo);
