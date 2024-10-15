import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const comps = {
  de: (
    <div className="tm-imprint">
      <p>
        <b>Gesamtverantwortung Trafimage.</b>
        <br />
        SBB AG
        <br />
        Infrastruktur – Anlagen und Technologie – Operation Center Technik –
        Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6<br />
        3072 Ostermundingen
        <br />
        Schweiz <br />
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>

      <p>
        <b>
          Betrieb, Wartung und Weiterentwicklung der Trafimage-Anwendungen,
          Datenintegration.
        </b>
        <br />
        geOps AG
        <br />
        Solothurnerstrasse 235
        <br />
        CH-4600 Olten
        <br />
        <a href="http://www.geops.ch">www.geops.ch</a>
        <br />
      </p>

      <p>
        <b>Karten- und Bahnhofplanerstellung.</b>
        <br />
        evoq communications AG
        <br />
        Ottikerstrasse 59
        <br />
        CH-8006 Zürich
        <br />
        <a href="http://www.evoq.ch">www.evoq.ch</a>
        <br />
      </p>

      <p>
        <b>Verantwortlich für die Inhalte der Webkarten:</b> Die Zuständigkeit
        und Kontaktangabe für die einzelnen Kartenthemen sind im Info-Pop-up{" "}
        <FaInfoCircle /> in der entsprechenden Menüzeile aufgeführt.
      </p>
    </div>
  ),
  fr: (
    <div className="tm-imprint">
      <p>
        <b>Ensemble de la responsabilité Trafimage.</b>
        <br />
        CFF SA
        <br />
        Infrastructure – Installations et technologie – Operation Center
        Technique – Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6<br />
        3072 Ostermundingen
        <br />
        Suisse
        <br />
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>

      <p>
        <b>
          Exploitation, maintenance et développement des applications Trafimage,
          intégration des données.
        </b>
        <br />
        geOps AG
        <br />
        Solothurnerstrasse 235
        <br />
        CH-4600 Olten
        <br />
        <a href="http://www.geops.ch">www.geops.ch</a>
        <br />
      </p>

      <p>
        <b>Établissement des cartes et des plans des gares.</b>
        <br />
        evoq communications AG
        <br />
        Ottikerstrasse 59
        <br />
        CH-8006 Zürich
        <br />
        <a href="http://www.evoq.ch">www.evoq.ch</a>
        <br />
      </p>

      <p>
        <b>Responsables des contenus des cartes Web:</b> La compétence et les
        coordonnées de contact pour chaque thème de la carte sont indiquées dans
        le pop-up d&apos;information <FaInfoCircle /> dans la ligne de menu
        correspondante.
      </p>
    </div>
  ),
  en: (
    <div className="tm-imprint">
      <p>
        <b>Overall responsibility for Trafimage.</b>
        <br />
        SBB AG
        <br />
        Infrastructure – Installations and Technology – Technology Operation
        Center – Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6<br />
        3072 Ostermundingen
        <br />
        Switzerland
        <br />
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>

      <p>
        <b>
          Operation, maintenance and further development of the Trafimage
          applications, data integration.
        </b>
        <br />
        geOps AG
        <br />
        Solothurnerstrasse 235
        <br />
        CH-4600 Olten
        <br />
        <a href="http://www.geops.ch">www.geops.ch</a>
        <br />
      </p>

      <p>
        <b>Map and station plan production.</b>
        <br />
        evoq communications AG
        <br />
        Ottikerstrasse 59
        <br />
        CH-8006 Zürich
        <br />
        <a href="http://www.evoq.ch">www.evoq.ch</a>
        <br />
      </p>

      <p>
        <b>Responsibility for the content of the web maps:</b> The
        responsibility and contact details for the individual map topics are
        listed in the info pop-up <FaInfoCircle /> in the corresponding menu
        bar.
      </p>
    </div>
  ),
  it: (
    <div className="tm-imprint">
      <p>
        <b>Responsabilità generale Trafimage.</b>
        <br />
        FFS SA
        <br />
        Infrastruttura – Impianti e tecnologia – Operation Center Tecnica –
        Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6<br />
        3072 Ostermundingen
        <br />
        Svizzera
        <br />
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>

      <p>
        <b>
          Gestione, manutenzione e ulteriore sviluppo delle applicazioni
          Trafimage, integrazione dei dati.
        </b>
        <br />
        geOps AG
        <br />
        Solothurnerstrasse 235
        <br />
        CH-4600 Olten
        <br />
        <a href="http://www.geops.ch">www.geops.ch</a>
        <br />
      </p>

      <p>
        <b>Realizzazione di cartine e piante delle stazioni.</b>
        <br />
        evoq communications AG
        <br />
        Ottikerstrasse 59
        <br />
        CH-8006 Zürich
        <br />
        <a href="http://www.evoq.ch">www.evoq.ch</a>
        <br />
      </p>

      <p>
        <b>Responsabilità per i contenuti delle cartine:</b> La responsabilità e
        i dettagli di contatto per i singoli argomenti della mappa sono elencati
        nel pop-up delle informazioni <FaInfoCircle /> nella barra dei menu
        corrispondente.
      </p>
    </div>
  ),
};

function Imprint({ language }) {
  return comps[language];
}

export default React.memo(Imprint);
