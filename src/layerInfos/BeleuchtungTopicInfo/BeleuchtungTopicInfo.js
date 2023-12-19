import React from "react";
import { useTranslation } from "react-i18next";
import BeleuchtungLegende from "./BeleuchtungLegende";

const comps = {
  de: (
    <div>
      <p>
        Werkzeug für Grundlagengespräche u.a. mit Behörden, Gemeinden, Projekt-
        und Anlagenverantwortlichen über die Spezifikationen von
        Beleuchtungsanlagen.
      </p>
      <BeleuchtungLegende />
      <p>Bahnhofklassen gemäss VöV RTE 26201.</p>
      <p>
        Verantwortlich: SBB Infrastruktur, Anlagenmanagement für Beleuchtung,
        &nbsp;
        <a href="mailto:784dad45.sbb.onmicrosoft.com@emea.teams.ms">
          784dad45.sbb.onmicrosoft.com@emea.teams.ms
        </a>
        .
      </p>
    </div>
  ),
  fr: (
    <div>
      <p>
        Outil pour les discussions de base, entre autres avec les autorités, les
        communes, les responsables de projets et d&apos;installations, sur les
        spécifications des installations d&apos;éclairage.
      </p>
      <BeleuchtungLegende />
      <p>Classes de gare selon VÖV RTE 26201.</p>
      <p>
        Responsable: CFF Infrastructure, gestion des installations pour
        l&apos;éclairage, &nbsp;
        <a href="mailto:784dad45.sbb.onmicrosoft.com@emea.teams.ms">
          784dad45.sbb.onmicrosoft.com@emea.teams.ms
        </a>
        .
      </p>
    </div>
  ),
  it: (
    <div>
      <p>
        Strumento per discussioni di base sulle specifiche degli impianti di
        illuminazione con autorità, comuni, responsabili di progetti e
        installazioni, tra gli altri.
      </p>
      <BeleuchtungLegende />
      <p>Classi di stazioni secondo VÖV RTE 26201.</p>
      <p>
        Responsabile: SBB Infrastructure, gestione degli asset per
        l&apos;illuminazione, &nbsp;
        <a href="mailto:784dad45.sbb.onmicrosoft.com@emea.teams.ms">
          784dad45.sbb.onmicrosoft.com@emea.teams.ms
        </a>
        .
      </p>
    </div>
  ),
  en: (
    <div>
      <p>
        Tool for basic discussions with, among others, authorities,
        municipalities, project and plant managers on the specifications of
        lighting installations.
      </p>
      <BeleuchtungLegende />
      <p>Station classes according to VÖV RTE 26201.</p>
      <p>
        Responsibility lies with: SBB Infrastructure, asset management for
        lighting, &nbsp;
        <a href="mailto:784dad45.sbb.onmicrosoft.com@emea.teams.ms">
          784dad45.sbb.onmicrosoft.com@emea.teams.ms
        </a>
        .
      </p>
    </div>
  ),
};

const BeleuchtungTopicInfo = () => {
  const { i18n } = useTranslation();
  return comps[i18n.language];
};

export default BeleuchtungTopicInfo;
