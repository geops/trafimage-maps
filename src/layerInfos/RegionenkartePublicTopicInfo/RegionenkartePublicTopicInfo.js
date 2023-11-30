import React from "react";

const comps = {
  de: (
    <div>
      <p>
        Hier finden Sie Ihre örtlichen Ansprechpartner zur Gewährleistung der
        Arbeitsstellensicherheit auf Baustellen von Dritten im Gefahrenbereich
        der Bahninfrastruktur. Die Koordinatoren Bahnnahes Bauen unterstützen
        Sie bei der korrekten Abwicklung Ihres Vorhabens.
      </p>
      <p>
        Verantwortlich: SBB Infrastruktur, Anlagen&Technologie, Überwachung,
        Hilfikerstrasse 3, 3000 Bern 65,&nbsp;
        <a href="mailto:ueberwachung@sbb.ch">ueberwachung@sbb.ch</a>.
      </p>
    </div>
  ),
  fr: (
    <div>
      <p>
        Vous trouvez ici votre partenaire local pour la garantie de la sécurité
        des chantiers sur des chantiers de tiers dans la zone de danger de
        l’infrastructure ferroviaire. Les coordinateurs travaux à proximité des
        voies vous aident à la bonne exécution de votre projet.
      </p>
      <p>
        Responsable: CFF Infrastructure, Installations & Technologie,
        Surveillance, Hilfikerstrasse 3, 3000 Bern 65,&nbsp;
        <a href="mailto:ueberwachung@sbb.ch">ueberwachung@sbb.ch</a>.
      </p>
    </div>
  ),
  en: (
    <div>
      <p>
        Find your local contacts for guaranteeing occupational safety on
        third-party construction sites in the hazardous area of railway
        infrastructure. The coordinators for construction work near railway
        installations will help you implement your projects correctly.
      </p>
      <p>
        Responsible: I-VU-UEW, Aurelia Kollros,&nbsp;
        <a href="mailto:aurelia.kollros@sbb.ch">aurelia.kollros@sbb.ch</a>.
      </p>
    </div>
  ),
  it: (
    <div>
      <p>
        Qui trovate i vostri interlocutori in loco per assicurare la sicurezza
        sulle aree dei lavori presso cantieri di terzi ubicati nella zona di
        pericolo dell’infrastruttura ferroviaria. I coordinatori Costruzioni in
        prossimità della ferrovia vi sostengono nello svolgimento corretto del
        vostro progetto.
      </p>
      <p>
        Responsabile: FFS Infrastruttura, Impianti&Tecnologia, Sorveglianza,
        Hilfikerstrasse 3, 3000 Bern 65,&nbsp;
        <a href="mailto:ueberwachung@sbb.ch">ueberwachung@sbb.ch</a>.
      </p>
    </div>
  ),
};

const RegionenkartePublicTopicInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(RegionenkartePublicTopicInfo);
