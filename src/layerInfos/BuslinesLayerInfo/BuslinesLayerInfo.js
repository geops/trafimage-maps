import React from 'react';
import Link from '../../components/Link';

const comps = {
  de: (
    <div>
      Der geographisch exakte Verlauf der Buslinien wurde über ein
      automatisiertes Routing-Verfahren (
      <Link href="http://geops.de/blog/mapping-von-netzen-des-%C3%B6ffentlichen-verkehrs">
        Details hier
      </Link>
      ) hergeleitet. Die Daten sind nicht redaktionell überarbeitet und werden
      laufend verbessert.
    </div>
  ),
  fr: (
    <div>
      Le tracé géographique exact des lignes de bus a été déduit d’une procédure
      d’itinérance automatisée (
      <Link href="http://geops.de/blog/mapping-von-netzen-des-%C3%B6ffentlichen-verkehrs">
        détails
      </Link>
      ). Les données ne sont pas traitées d’un point de vue rédactionnel et sont
      améliorées en continu.
    </div>
  ),
  en: (
    <div>
      The exact geographic course of the bus routes was established via an
      automated routing procedure (
      <Link href="http://geops.de/node/171?language=en">details</Link>
      ). The data are not editorial revised and improved continuously.
    </div>
  ),
  it: (
    <div>
      Il tracciato geografico esatto delle linee di autobus è stato ricavato
      tramite una procedura di routing automatizzata (
      <Link href="http://geops.de/blog/mapping-von-netzen-des-%C3%B6ffentlichen-verkehrs">
        dettagli
      </Link>
      ). I dati non sono rielaborati a livello redazionale e vengono
      costantemente ottimizzati.
    </div>
  ),
};

const BuslinesLayerInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(BuslinesLayerInfo);
