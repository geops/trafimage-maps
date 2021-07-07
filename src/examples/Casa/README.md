#

The Casa module is a sub module of trafimage-maps which is integrated in the SBB selling application. It is used for visualizing the planned [route](/docjs.html#routelayer) with different means of transportation and allows the selection of relevant [fare network](/docjs.html#zonelayer).

```jsx
import 'trafimage-maps';
import React, { useEffect, useRef,useState } from 'react';
import RouteLayer from 'trafimage-maps/layers/RouteLayer';
import ZoneLayer from 'trafimage-maps/layers/ZoneLayer';
import { casa } from 'trafimage-maps/config/topics';
import 'trafimage-maps/examples/Casa/casa.css'

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const apiKeyName = 'key';

// Intialization of zone layer.
const zoneLayer = new ZoneLayer({
  apiKey: apiKey,
  apiKeyName: apiKeyName,
  validFrom: '2019-12-16',
  validTo: '2020-12-01',
});

// Select zones.
zoneLayer.loadZones([
  {
    partnerCode: 801,
    zones: [
      {
        zoneCode: 10,
        zoneName: 'Davos',
        isClickable: true,
      },
    ],
  },
  {
    partnerCode: 490,
    zones: [
       {
        zoneCode: 163,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 164,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 120,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 121,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 122,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 123,
        isSelected: false,
        isClickable: false,
      },
      {
        zoneCode: 124,
        isSelected: false,
        isClickable: false,
      },
    ],
  },
  {
    partnerCode: 446,
    zones: [
      {
        zoneCode: 170,
        isSelected: false,
        isClickable: true,
      },
      {
        zoneCode: 116,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 126,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 626,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 710,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 700,
        isSelected: true,
        isClickable: true,
      },
      {
        zoneCode: 701,
        isSelected: true,
        isClickable: true,
      },
    ],
  },
]);

zoneLayer.onClick(f => {
  console.log('Clicked', f);
});

// Initialize route layer.
const routeLayer = new RouteLayer({
  key: 'ch.sbb.casa.routeLayer',
  apiKey: apiKey,
  apiKeyName: apiKeyName,
});
window.routeLayer=routeLayer;
// Visualize a route on the map.
// routeLayer
//   .loadRoutes([
//     {
//       isClickable: true,
//       isSelected: false,
//       popupTitle: 'Route Biel/Bienne >> Freiburg/Fribourg',
//       popupContent: ['Von: Bern', 'Nach: Freiburg/Fribourg'],
//       sequences: [
//         {
//           uicFrom: 8507000,
//           uicTo: 8504100,
//           mot: 'rail',
//         },
//       ],
//     },
//     {
//       isClickable: true,
//       isSelected: true,
//       sequences: [
//         {
//           uicFrom: 8500218,
//           uicTo: 8507000,
//           mot: 'rail',
//         },
//         {
//           uicFrom: 8507000,
//           lonLatTo: [46.94691, 7.44079],
//           mot: 'foot',
//         },
//         {
//           uicFrom: 8576646,
//           uicTo: 8507180,
//           mot: 'bus',
//         },
//         {
//           uicFrom: 8507180,
//           uicTo: 8507150,
//           mot: 'foot',
//         },
//         {
//           uicFrom: 8507150,
//           lonLatTo: [46.68848, 7.68974],
//           mot: 'ferry',
//         },
//       ],
//     },
//   ])
//   .then(f => {
//     routeLayer.zoomToRoute({duration: 1000});
//   });

routeLayer.onClick(f => {
  console.log('Clicked', f);
});
const topics = 
[{
      ...casa,
      layers: [...casa.layers,  routeLayer],
      elements: {
        mapControls: true,
        menu: false,
        popup: true,
        baseLayerSwitcher: true,
      }}];
const App = () => {
  const ref = useRef();
  const [show,setShow] = useState(false);

  useEffect(() => {
    console.log(ref.current);
    if (!show || !ref.current){
      return;
    }
    const map = ref.current;
      console.log('set topics ', casa.layers);
    map.topics =  topics;

    return () => {
      routeLayer.terminate();
      console.log('topics=null');casa.layers.forEach((l)=> {
l.terminate();
      });
      map.topics = null;
    };
  }, [ref.current, show]);

  /* To use casa style sheet, add the casa class in the parent class */
  return (
    <div>
    <button onClick={()=> {
      setShow(!show);
    }} >Show/hide</button>
    <button onClick={()=> {// Visualize a route on the map.
      // setShow(false);
      routeLayer
        .loadRoutes([
          {
            isClickable: true,
            isSelected: false,
            popupTitle: 'Route Biel/Bienne >> Freiburg/Fribourg',
            popupContent: ['Von: Bern', 'Nach: Freiburg/Fribourg'],
            sequences: [
              {
                uicFrom: 8507000,
                uicTo: 8504100,
                mot: 'rail',
              },
            ],
          },
          {
            isClickable: true,
            isSelected: true,
            sequences: [
              {
                uicFrom: 8500218,
                uicTo: 8507000,
                mot: 'rail',
              },
              {
                uicFrom: 8507000,
                lonLatTo: [46.94691, 7.44079],
                mot: 'foot',
              },
              {
                uicFrom: 8576646,
                uicTo: 8507180,
                mot: 'bus',
              },
              {
                uicFrom: 8507180,
                uicTo: 8507150,
                mot: 'foot',
              },
              {
                uicFrom: 8507150,
                lonLatTo: [46.68848, 7.68974],
                mot: 'ferry',
              },
            ],
          },
        ])
        .then(f => {
          window.setTimeout(()=> {
             routeLayer.zoomToRoute({duration: 1000});

          }, 3000);
      // setShow(true);
        });
    }} >load route</button>
    <div className="container casa">
      { show && <trafimage-maps ref={ref} appName="casa" apiKey={apiKey} apiKeyName={apiKeyName} />}
    </div>
    </div>
  );
}

<App />

```
