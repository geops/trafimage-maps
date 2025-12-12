import React from "react";
import useTranslation from "../../utils/useTranslation";
import Link from "../../components/Link";

const desc = {
  de: (
    <p>
      Anzeige der Position des Messwagens. Der Funkmesswagen ist mit
      Messempfängern, Testgeräten für Mobilfunk, Messantennen und Computern
      ausgestattet. Im Wagen sind ausserdem Systeme zur Messung von Services
      (analoger Funk, GSM-R, Polycom, GSM, UMTS und LTE) installiert.
    </p>
  ),
  en: (
    <p>
      Display of the position of the measuring trolley. The measuring trolley,
      is equipped with measuring receivers, test devices for mobile radio,
      measuring antennas and computers. Systems for measuring services (analogue
      radio, GSM-R, Polycom, GSM, UMTS and LTE) are also installed in the
      vehicle.
    </p>
  ),
  fr: (
    <p>
      Affichage de la position du chariot de mesure. Le camion de mesure est
      équipé de récepteurs de mesure, d&rsquo;appareils de test pour la
      téléphonie mobile, d&rsquo;antennes de mesure et d&rsquo;ordinateurs. Des
      systèmes de mesure des services (radio analogique, GSM-R, Polycom, GSM,
      UMTS et LTE) sont également installés dans le wagon.
    </p>
  ),
  it: (
    <p>
      Visualizzazione della posizione del carrello di misura. Il furgone di
      misurazione è dotato di ricevitori di misurazione, dispositivi di test per
      la radio mobile, antenne di misurazione e computer. Nel veicolo sono
      installati anche sistemi per la misurazione dei servizi (radio analogica,
      GSM-R, Polycom, GSM, UMTS e LTE).
    </p>
  ),
};
const year = new Date().getFullYear();

function MesswagenTopicInfo() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      {desc[i18n?.language] || desc.de}
      <Link href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-vorjahr.pdf">
        {`${t("Einstazplanung")} ${year - 1}`}
      </Link>
      <Link href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-aktuell.pdf">
        {`${t("Einstazplanung")} ${year}`}
      </Link>
      <Link href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-folgejahr.pdf">
        {`${t("Einstazplanung")} ${year + 1}`}
      </Link>
    </div>
  );
}

export default MesswagenTopicInfo;
