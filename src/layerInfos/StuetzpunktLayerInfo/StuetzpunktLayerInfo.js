import React from 'react';

import './StuetzpunktLayerInfo.scss';

const comps = {
  de: (
    <div className="stuetzpunkt-layer-info">
      <div className="stuetzpunkt-layer-icon" />
      <div>
        Bahnhöfe an denen beim SBB Call Center Handicap unter der Nummer{' '}
        <a href="tel:0800 007 102">0800 007 102</a> eine Hilfestellung bestellt
        werden kann.
      </div>
    </div>
  ),
  fr: (
    <div className="stuetzpunkt-layer-info">
      <div className="stuetzpunkt-layer-icon" />
      <div>
        Gares pour lesquelles il est possible de commander un service
        d’assistance auprès du Call Center Handicap CFF au numéro{' '}
        <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    </div>
  ),
  en: (
    <div className="stuetzpunkt-layer-info">
      <div className="stuetzpunkt-layer-icon" />
      <div>
        Stations where assistance can be requested from the SBB Call Center
        Handicap by calling <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    </div>
  ),
  it: (
    <div className="stuetzpunkt-layer-info">
      <div className="stuetzpunkt-layer-icon" />
      <div>
        Stazioni in cui è possibile richiedere assistenza contattando il Call
        Center Handicap FFS al numero{' '}
        <a href="tel:0800 007 102">0800 007 102</a>.
      </div>
    </div>
  ),
};

const StuetzpunktLayerInfo = ({ language }) => comps[language];

export default React.memo(StuetzpunktLayerInfo);
