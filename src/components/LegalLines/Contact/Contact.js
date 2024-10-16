import React from "react";

const comps = {
  de: (
    <div className="tm-imprint">
      <p>
        Haben Sie Fragen, Verbesserungsvorschläge, Hinweise auf Unstimmigkeiten
        oder Interesse an Karten und Plänen? Dann nehmen Sie bitte mit uns
        Kontakt auf!
      </p>
      <p>
        <b>SBB AG</b>
        <br />
        Infrastruktur – Anlagen und Technologie – Operation Center Technik –
        Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6
        <br />
        CH-3072 Ostermundingen
      </p>
      <p>
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>
    </div>
  ),
  fr: (
    <div className="tm-imprint">
      <p>
        Vous avez des questions, des suggestions, des remarques sur des
        inexactitudes ? Les cartes et plans vous intéressent? N’hésitez pas à
        nos contacter.
      </p>
      <p>
        <b>CFF SA</b>
        <br />
        Infrastructure – Installations et technologie – Operation Center
        Technique – Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6
        <br />
        CH-3072 Ostermundingen
      </p>
      <p>
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>
    </div>
  ),
  en: (
    <div className="tm-imprint">
      <p>
        Do you have any questions about our maps and plans or suggestions for
        improvement? Or would you like to point out any errors? If so, please
        contact us.
      </p>
      <p>
        <b>SBB AG</b>
        <br />
        Infrastructure – Installations and Technology – Technology Operation
        Center – Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6
        <br />
        CH-3072 Ostermundingen
      </p>
      <p>
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>
    </div>
  ),
  it: (
    <div className="tm-imprint">
      <p>
        Avete domande, proposte di miglioramento, segnalazioni di inesattezze o
        siete interessati.
      </p>
      <p>
        <b>FFS SA</b>
        <br />
        Infrastruttura – Impianti e tecnologia – Operation Center Tecnica –
        Technical Management
        <br />
        Fachbus Trafimage
        <br />
        Poststrasse 6
        <br />
        CH-3072 Ostermundingen
      </p>
      <p>
        <a href="http://www.trafimage.ch">www.trafimage.ch</a>
        <br />
      </p>
    </div>
  ),
};

function Contact({ language }) {
  return comps[language];
}

export default React.memo(Contact);
