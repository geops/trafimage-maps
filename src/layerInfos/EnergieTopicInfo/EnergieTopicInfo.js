import React from 'react';

const comps = {
  de: (
    <div>
      Die Netzkarte Energie bildet das Netz der SBB Hochspannnungs
      Übertragungsleitungen (UL) ab. Die Karte richtet sich an die Bauherr:innen
      mit Bauvorhaben mit weniger als 51m Abstand zur Übertragungsleitung.
      Bauvorhaben innerhalb dieses Bereiches sind gemäss Art. 18m des
      Eisenbahngesetzes der SBB Energie zur Genehmigung einzureichen.
      Detailierte Informationen und Einreichung finden Sie unter:
      <p>
        <a href="https://company.sbb.ch/de/ueber-die-sbb/projekte/genehmigung-von-bauarbeiten-projekten.html">
          SBB Genehmigung-von-Bauprojekten, EBG 18m
        </a>
        .
      </p>
    </div>
  ),
  fr: (
    <div>
      La carte réseau énergie constitue le réseau à haute tension des CFF lignes
      de transmission (UL). La carte s&apos;adresse aux constructeurs avec des
      projets de construction à moins de 51 m de la ligne de transmission. Les
      projets de construction dans cette zone sont, conformément à
      l&apos;article 18m des Loi sur les chemins de fer à CFF Energie pour
      approbation. Des informations détaillées et la soumission peuvent être
      trouvées à:
      <p>
        <a href="https://company.sbb.ch/fr/entreprise/projets/autorisation-de-travaux-projets-en-voisinage.html">
          Autorisation de travaux/ projets en voisinage des chemins de fer, LCdF
          18m
        </a>
        .
      </p>
    </div>
  ),
  en: (
    <div>
      The energy network map displays the SBB high-voltage network transmission
      lines (UL). The map is aimed at the builder-owners with construction
      projects less than 51m from the transmission line. Construction projects
      within this area are, according to Art. 18m of the Railway Act, to be
      submitted to SBB Energie for approval. Detailed information and submission
      can be found at:
      <p>
        <a href="https://company.sbb.ch/en/the-company/projects/authorisation-for-works-projects-near-railways.html">
          Authorisation for works/projects near railways, RA 18m
        </a>
        .
      </p>
    </div>
  ),
  it: (
    <div>
      La carta di rete energetica costituisce la rete ad alta tensione delle FFS
      linee di trasmissione (UL). La carta è rivolta ai costruttori con progetti
      di costruzione a meno di 51 m dalla linea di trasmissione. I progetti di
      costruzione all&apos;interno di quest&apos;area sono, secondo
      l&apos;articolo 18m della Legge sulle ferrovie alle FFS Energie per
      l&apos;approvazione. Informazioni dettagliate e presentazione sono
      disponibili su:
      <p>
        <a href="https://company.sbb.ch/it/azienda/progetti/autorizzazione-ai-lavori-progetti.html">
          Autorizzazione ai lavori/ progetti nelle vicinanze della ferrovia,
          LCdF 18m
        </a>
        .
      </p>
    </div>
  ),
};

const EnergieTopicInfo = ({ language }) => {
  return comps[language];
};

export default EnergieTopicInfo;
