import React from 'react';
import { useTranslation } from 'react-i18next';

const comps = {
  de: (
    <div>
      <p>
        Der geographisch exakte Verlauf der Buslinien wurde über ein
        automatisiertes Routing-Verfahren (
        <a
          href="https://geops.ch/blog/mapping-von-netzen-des-offentlichen-verkehrs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Details hier
        </a>
        ) hergeleitet. Die Daten sind nicht redaktionell überarbeitet und werden
        laufend verbessert.
      </p>
    </div>
  ),
  fr: (
    <div>
      <p>
        Le tracé géographique exact des lignes de bus a été déduit d’une
        procédure d’itinérance automatisée (
        <a
          href="https://geops.ch/en/blog/mapping-public-transit-networks"
          rel="noopener noreferrer"
          target="_blank"
        >
          détails
        </a>
        ). Les données ne sont pas traitées d’un point de vue rédactionnel et
        sont améliorées en continu.
      </p>
    </div>
  ),
  en: (
    <div>
      <p>
        The exact geographic course of the bus routes was established via an
        automated routing procedure (
        <a
          href="https://geops.ch/en/blog/mapping-public-transit-networks"
          rel="noopener noreferrer"
          target="_blank"
        >
          details
        </a>
        ). The data are not editorial revised and improved continuously.
      </p>
    </div>
  ),
  it: (
    <div>
      <p>
        Il tracciato geografico esatto delle linee di autobus è stato ricavato
        tramite una procedura di routing automatizzata (
        <a
          href="https://geops.ch/en/blog/mapping-public-transit-networks"
          rel="noopener noreferrer"
          target="_blank"
        >
          dettagli
        </a>
        ). I dati non sono rielaborati a livello redazionale e vengono
        costantemente ottimizzati.
      </p>
    </div>
  ),
};

const BuslinesLayerInfo = () => {
  const { i18n } = useTranslation();
  return comps[i18n.language];
};

export default BuslinesLayerInfo;
