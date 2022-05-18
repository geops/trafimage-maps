import React from 'react';

const comps = {
  de: (
    <div>
      Übersicht der Anlagenverantwortungen für die Anlagen der SBB-Energie Für
      die Übertragungsleitungen UL, Unterwerke UW inkl.fahrbare Unterwerke fUW,
      Autotrafo sowie Produktionsanlagen. Die Karten enthalten zusätzlich
      Informationen über Innhaber und regionale Zuständigkeiten der Rollen
      Anlagenmanager (LCM), Anlagenmanager Betrieb und Instandhaltung (BUI),
      Anlagenverantwortlicher/AVANT, Anlagenbetreuer UL, Intervention und
      Schalt- und Erdberechtigt.
      <p>
        <a href="mailto:energienetz-b-i@sbb.ch">energienetz-b-i@sbb.ch</a>
      </p>
    </div>
  ),
  fr: (
    <div>
      Aperçu des responsabilités des installations de CFF Energie, des lignes de
      transport UL, des sous-stations UW y compris les sous-stations mobiles
      fUW, des autotransformateurs ainsi que des installations de production.
      Les cartes contiennent en outre des informations sur les propriétaires et
      les compétences régionales des rôles de gestionnaire d&apos;installation
      (LCM), de gestionnaire d&apos;installation exploitation et maintenance
      (BUI), de responsable d&apos;installation/AVANT, de responsable
      d&apos;installation UL, d&apos;intervention et d&apos;autorisation de
      couplage et de mise à terre.
      <p>
        <a href="mailto:energienetz-b-i@sbb.ch">energienetz-b-i@sbb.ch</a>
      </p>
    </div>
  ),
  en: (
    <div>
      Overview of the plant responsibilities for the SBB-Energie plants, for the
      transmission lines UL, substations UW incl.mobile substations fUW,
      autotransformer as well as production plants. The maps also contain
      information on the owners and regional responsibilities of the roles of
      plant manager (LCM), plant manager operation and maintenance (BUI), plant
      manager/AVANT, plant supervisor UL, intervention and switching and
      grounding authority.
      <p>
        <a href="mailto:energienetz-b-i@sbb.ch">energienetz-b-i@sbb.ch</a>
      </p>
    </div>
  ),
  it: (
    <div>
      Panoramica delle responsabilità degli impianti delle FFS-Energie, delle
      linee di trasmissione UL, delle sottostazioni UW incluse le sottostazioni
      mobili fUW, degli autotrasformatori e degli impianti di produzione. Le
      mappe contengono anche informazioni sui proprietari e sulle responsabilità
      regionali dei ruoli di responsabile dell&apos;impianto (LCM), responsabile
      dell&apos;esercizio e della manutenzione (BUI), responsabile
      dell&apos;impianto/AVANT, supervisore dell&apos;impianto UL, intervento e
      commutazione e autorità di terra.
      <p>
        <a href="mailto:energienetz-b-i@sbb.ch">energienetz-b-i@sbb.ch</a>
      </p>
    </div>
  ),
};

const EnergieTopicInfo = ({ language }) => {
  return comps[language];
};

export default EnergieTopicInfo;
