import React from "react";
import { useTranslation } from "react-i18next";
import DataLink from "../../components/DataLink";

const comps = {
  de: (
    <>
      Die Netzkarte Energie bildet das Netz der SBB Hochspannnungs
      Übertragungsleitungen (UL) ab. Die Karte richtet sich an die Bauherr:innen
      mit Bauvorhaben mit weniger als 51m Abstand zur Übertragungsleitung.
      Bauvorhaben innerhalb dieses Bereiches sind gemäss Art. 18m des
      Eisenbahngesetzes der SBB Energie zur Genehmigung einzureichen.
      Detaillierte Informationen und Einreichung finden Sie unter:
      <p>
        <a href="https://company.sbb.ch/de/ueber-die-sbb/projekte/genehmigung-von-bauarbeiten-projekten.html">
          SBB Genehmigung-von-Bauprojekten, EBG 18m
        </a>
        .
      </p>
      <p>
        Verantwortlich: I-EN-DAE-OAN-BUI, Operatives Anlagemanagement Netz,
        Betrieb und Instandhaltung (
        <a href="mailto:trassensicherung-energie@sbb.ch">
          trassensicherung-energie@sbb.ch
        </a>
        )
      </p>
    </>
  ),
  fr: (
    <>
      La carte du réseau énergétique représente le réseau des lignes de
      transport d&apos;électricité à haute tension (UL) des CFF. La carte
      s&apos;adresse aux maîtres d&apos;ouvrage dont les projets de construction
      se situent à moins de 51 m de la ligne de transport. Conformément à
      l&apos;art. 18m de la loi sur les chemins de fer, les projets de
      construction situés dans cette zone doivent être soumis à CFF Energie pour
      approbation. Vous trouverez des informations détaillées et la soumission
      sous:
      <p>
        <a href="https://company.sbb.ch/fr/entreprise/projets/autorisation-de-travaux-projets-en-voisinage.html">
          Autorisation de travaux/ projets en voisinage des chemins de fer, LCdF
          18m
        </a>
        .
      </p>
      <p>
        Responsable: I-EN-DAE-OAN-BUI, Operatives Anlagemanagement Netz, Betrieb
        und Instandhaltung (
        <a href="mailto:trassensicherung-energie@sbb.ch">
          trassensicherung-energie@sbb.ch
        </a>
        )
      </p>
    </>
  ),
  en: (
    <>
      The Energy Network Map displays the network of SBB high-voltage
      transmission lines (UL). The map is intended for developers with building
      projects less than 51m from the transmission line. Construction projects
      within this area must be submitted to SBB Energie for approval in
      accordance with Art. 18m of the Railway Act. Detailed information and
      submission can be found at:
      <p>
        <a href="https://company.sbb.ch/en/the-company/projects/authorisation-for-works-projects-near-railways.html">
          Authorisation for works/projects near railways, RA 18m
        </a>
        .
      </p>
      <p>
        Responsible: I-EN-DAE-OAN-BUI, Operatives Anlagemanagement Netz, Betrieb
        und Instandhaltung (
        <a href="mailto:trassensicherung-energie@sbb.ch">
          trassensicherung-energie@sbb.ch
        </a>
        )
      </p>
    </>
  ),
  it: (
    <>
      La carta della rete energetica visualizza la rete delle linee di
      trasmissione ad alta tensione delle FFS (UL). La mappa è destinata agli
      sviluppatori con progetti di costruzione a meno di 51 metri dalla linea di
      trasmissione. I progetti di costruzione all&apos;interno di
      quest&apos;area devono essere sottoposti all&apos;approvazione di FFS
      Energia ai sensi dell&apos;art. 18m della Legge sulle ferrovie.
      Informazioni dettagliate e modalità di presentazione sono disponibili sul
      sito::
      <p>
        <a href="https://company.sbb.ch/it/azienda/progetti/autorizzazione-ai-lavori-progetti.html">
          Autorizzazione ai lavori/ progetti nelle vicinanze della ferrovia,
          LCdF 18m
        </a>
        .
      </p>
      <p>
        Responsabile: I-EN-DAE-OAN-BUI, Operatives Anlagemanagement Netz,
        Betrieb und Instandhaltung (
        <a href="mailto:trassensicherung-energie@sbb.ch">
          trassensicherung-energie@sbb.ch
        </a>
        )
      </p>
    </>
  ),
};

function EnergieTopicInfo() {
  const { i18n, t } = useTranslation();
  return (
    <div>
      {comps[i18n.language]}
      <hr />
      <p>
        <DataLink href="https://geo.sbb.ch/site/rest/services/Trafimage_PUBLIC/">
          {t("Diesen Datensatz als Service einbinden (SBB-intern)")}
        </DataLink>
      </p>
    </div>
  );
}

export default EnergieTopicInfo;
