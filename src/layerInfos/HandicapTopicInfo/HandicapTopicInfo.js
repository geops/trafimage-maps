import React from 'react';

const comps = {
  de: (
    <div>
      Nützliche Informationen zum barrierefreien Reisen mit SBB und Privatbahnen
      sowie zur Ausrüstung von Bahnhöfen.
      <p>
        Verantwortlich: Produktmanagement Handicap,&nbsp;
        <a href="mailto:handicap@sbb.ch">handicap@sbb.ch</a>.
      </p>
    </div>
  ),
  fr: <div>Personen mit eingeschränkter Mobilität</div>,
  en: <div>Personen mit eingeschränkter Mobilität</div>,
  it: <div>Personen mit eingeschränkter Mobilität</div>,
};

const HandicapTopicInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(HandicapTopicInfo);
