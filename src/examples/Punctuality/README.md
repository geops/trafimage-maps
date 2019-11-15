#

Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://www.sbb.ch/en/bahnhof-services/bahnhoefe/karten-bahnhofplaene/trafimage-karten.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```jsx
import 'trafimage-maps';
import React, { useRef, useEffect } from 'react';
import Layer from 'react-spatial/layers/Layer';
import TrajservLayer from 'react-transit/layers/TrajservLayer';
import defaultBaseLayers, { buslines } from 'trafimage-maps/examples/Punctuality/layers';

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const map = ref.current;
    const apiKey = '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93';
    map.setAttribute('apiKey', apiKey);
    map.topics =  [{
      name: 'ÖV Netzkarte Schweiz',
      key: 'ch.sbb.netzkarte',
      layers: [
        ...defaultBaseLayers,
        new TrajservLayer({
          name: 'Zugtracker',
          key: 'ch.sbb.tracker',
          apiKey: apiKey,
        }),
        new TrajservLayer({
          name: 'ch.sbb.puenktlichkeit',
          key: 'ch.sbb.puenktlichkeit',
          apiKey: apiKey,
          visible: false,
          useDelayStyle: true,
          operator: 'SBB', // To filter operator
          publishedLineName: 's1,s2,s9,s10,s15', // To filter line number
        }),
        buslines,
      ],
      elements: {
        footer: true,
        header: true,
        mapControls: true,
        menu: true,
        popup: true,
        permalink: false,
      },
    }];
  }, []);

  return (
    <div className="container">
      <trafimage-maps ref={ref} zoom="14" center="[950690,6004000]" />
    </div>
  );
}

<App />

```
