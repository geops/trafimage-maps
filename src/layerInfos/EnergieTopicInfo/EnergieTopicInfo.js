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
      Schalt- und Erdberechtigt
    </div>
  ),
  fr: (
    <div>
      Übersicht der Anlagenverantwortungen für die Anlagen der SBB-Energie Für
      die Übertragungsleitungen UL, Unterwerke UW inkl.fahrbare Unterwerke fUW,
      Autotrafo sowie Produktionsanlagen. Die Karten enthalten zusätzlich
      Informationen über Innhaber und regionale Zuständigkeiten der Rollen
      Anlagenmanager (LCM), Anlagenmanager Betrieb und Instandhaltung (BUI),
      Anlagenverantwortlicher/AVANT, Anlagenbetreuer UL, Intervention und
      Schalt- und Erdberechtigt
    </div>
  ),
  en: (
    <div>
      Übersicht der Anlagenverantwortungen für die Anlagen der SBB-Energie Für
      die Übertragungsleitungen UL, Unterwerke UW inkl.fahrbare Unterwerke fUW,
      Autotrafo sowie Produktionsanlagen. Die Karten enthalten zusätzlich
      Informationen über Innhaber und regionale Zuständigkeiten der Rollen
      Anlagenmanager (LCM), Anlagenmanager Betrieb und Instandhaltung (BUI),
      Anlagenverantwortlicher/AVANT, Anlagenbetreuer UL, Intervention und
      Schalt- und Erdberechtigt
    </div>
  ),
  it: (
    <div>
      Übersicht der Anlagenverantwortungen für die Anlagen der SBB-Energie Für
      die Übertragungsleitungen UL, Unterwerke UW inkl.fahrbare Unterwerke fUW,
      Autotrafo sowie Produktionsanlagen. Die Karten enthalten zusätzlich
      Informationen über Innhaber und regionale Zuständigkeiten der Rollen
      Anlagenmanager (LCM), Anlagenmanager Betrieb und Instandhaltung (BUI),
      Anlagenverantwortlicher/AVANT, Anlagenbetreuer UL, Intervention und
      Schalt- und Erdberechtigt
    </div>
  ),
};

const EnergieTopicInfo = ({ language }) => {
  return comps[language];
};

export default EnergieTopicInfo;
