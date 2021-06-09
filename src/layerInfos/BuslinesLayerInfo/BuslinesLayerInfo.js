import React from 'react';
import { useTranslation } from 'react-i18next';

const comps = {
  de: (
    <div>
      Der geographisch exakte Verlauf der Buslinien wurde über ein
      automatisiertes Routing-Verfahren (
      <a
        href="http://geops.de/blog/mapping-von-netzen-des-%C3%B6ffentlichen-verkehrs"
        rel="noopener noreferrer"
        target="_blank"
      >
        Details hier
      </a>
      ) hergeleitet. Die Daten sind nicht redaktionell überarbeitet und werden
      laufend verbessert.
    </div>
  ),
  fr: (
    <div>
      Le tracé géographique exact des lignes de bus a été déduit d’une procédure
      d’itinérance automatisée (
      <a
        href="http://geops.de/blog/mapping-von-netzen-des-%C3%B6ffentlichen-verkehrs"
        rel="noopener noreferrer"
        target="_blank"
      >
        détails
      </a>
      ). Les données ne sont pas traitées d’un point de vue rédactionnel et sont
      améliorées en continu.
    </div>
  ),
  en: (
    <div>
      The exact geographic course of the bus routes was established via an
      automated routing procedure (
      <a
        href="http://geops.de/node/171?language=en"
        rel="noopener noreferrer"
        target="_blank"
      >
        details
      </a>
      ). The data are not editorial revised and improved continuously.
    </div>
  ),
  it: (
    <div>
      Il tracciato geografico esatto delle linee di autobus è stato ricavato
      tramite una procedura di routing automatizzata (
      <a
        href="http://geops.de/blog/mapping-von-netzen-des-%C3%B6ffentlichen-verkehrs"
        rel="noopener noreferrer"
        target="_blank"
      >
        dettagli
      </a>
      ). I dati non sono rielaborati a livello redazionale e vengono
      costantemente ottimizzati.
    </div>
  ),
};

const BuslinesLayerInfo = () => {
  const { i18n } = useTranslation();
  return comps[i18n.language];
};

export default BuslinesLayerInfo;
