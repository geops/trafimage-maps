import ship100GothardPanoramExpress from './GS100_Gotthard_Panorama_Expresses_shiplines.json';
import ship150GothardPanoramExpress from './GS150_Gotthard_Panorama_Expresses_shiplines.json';

export default {
  'Basel SBB - Aarau - Zürich HB - St. Gallen': {
    property: 'hauptlinie',
    shortname: 'IR 37',
    color: '#B8D989',
  },
  'Basel SBB - Bern - Brig': {
    property: 'hauptlinie',
    shortname: 'IC 6',
    color: '#8BC63E',
  },
  'Basel SBB - Bern - Interlaken Ost': {
    property: 'hauptlinie',
    shortname: 'IC 61',
    color: '#EF59A1',
  },
  'Basel SBB - Biel/Bienne': {
    property: 'hauptlinie',
    shortname: 'IC 51',
    color: '#B00D15',
  },
  'Basel SBB - Brugg AG - Zürich HB (- Zürich Flughafen)': {
    property: 'hauptlinie',
    shortname: 'IR 36',
    color: '#AD227A',
  },
  'Basel SBB - Luzern - Erstfeld (- Göschenen)': {
    property: 'hauptlinie',
    shortname: 'IR 26',
    color: '#AF8789',
  },
  'Basel SBB - Luzern - Lugano': {
    property: 'hauptlinie',
    shortname: 'IC 21',
    color: '#FEC70C',
  },
  'Basel SBB - Olten - Luzern': {
    property: 'hauptlinie',
    shortname: 'IR 27',
    color: '#5B6E24',
  },
  'Basel SBB - Zürich HB - Chur': {
    property: 'hauptlinie',
    shortname: 'IC 3',
    color: '#00984A',
  },
  'Bern - Burgdorf - Olten (- Zürich HB)': {
    property: 'hauptlinie',
    shortname: 'IR 17',
    color: '#24529B',
  },
  'Bern - Olten - Brugg AG - Zürich HB': {
    property: 'hauptlinie',
    shortname: 'IR 16',
    color: '#9F6F32',
  },
  'Brig - Bern - Zürich HB - Romanshorn': {
    property: 'hauptlinie',
    shortname: 'IC 8',
    color: '#009BDE',
  },
  'Genève-Aéroport - Bern - Zürich HB - St.Gallen': {
    property: 'hauptlinie',
    shortname: 'IC 1',
    color: '#E43A2B',
  },
  'Genève-Aeroport - Lausanne - Bern - Luzern': {
    property: 'hauptlinie',
    shortname: 'IR 15',
    color: '#0CB795',
  },
  'Genève-Aéroport - Lausanne - Brig': {
    property: 'hauptlinie',
    shortname: 'IR 90',
    color: '#007CA3',
  },
  'Genève-Aéroport/Lausanne - Biel/Bienne - Zürich HB (- St.Gallen)': {
    property: 'hauptlinie',
    shortname: 'IC 5',
    color: '#F7931D',
  },
  'Luzern - Zürich HB - Konstanz': {
    property: 'hauptlinie',
    shortname: 'IR 75',
    color: '#744B97',
  },
  'Luzern - Zürich HB (- Zürich Flughafen)': {
    property: 'hauptlinie',
    shortname: 'IR 70',
    color: '#F390BC',
  },
  'Zürich HB - Schaffhausen': {
    property: 'hauptlinie',
    shortname: 'IC 4',
    color: '#C9A428',
  },
  'Zürich HB - Zug - Erstfeld (- Göschenen)': {
    property: 'hauptlinie',
    shortname: 'IR 46',
    color: '#006C89',
  },
  'Zürich HB - Zug - Lugano': {
    property: 'hauptlinie',
    shortname: 'IC 2',
    color: '#8781BD',
  },

  'Bernina Express: Chur – Poschiavo – Tirano (– Lugano mit Bus)': {
    property: 'touristische_linie',
    color: '#7c00ff',
  },
  'Bernina Express: Landquart – Klosters Platz – Davos – Poschiavo – Tirano (– Lugano mit Bus)': {
    property: 'touristische_linie',
    color: '#00aaff',
  },
  'Bernina Express: St. Moritz – Poschiavo – Tirano (– Lugano mit Bus)': {
    property: 'touristische_linie',
    color: '#ffff00',
  },
  'Brienzer Rothorn: Brienz – Brienzer Rothorn': {
    property: 'touristische_linie',
    color: '#00d1ff',
  },
  'Centovalli: Domodossola – Locarno': {
    property: 'touristische_linie',
    color: '#8ae234',
  },
  'Chur – Arosa: Chur – Arosa': {
    property: 'touristische_linie',
    color: '#00ff00',
  },
  'Chur – St.Moritz: Chur – St.Moritz': {
    property: 'touristische_linie',
    color: '#007832',
  },
  'Glacier Express: Zermatt – Visp – Brig – Andermatt – Chur – St.Moritz': {
    property: 'touristische_linie',
    color: '#ff00fa',
  },
  'Golden Pass Panoramic: Luzern – Brünig-Hasliberg – Interlaken Ost – Zweisimmen – Montreux': {
    property: 'touristische_linie',
    color: '#ff0000',
  },
  'Gotthard Panorama Express: Arth-Goldau – Flüelen – Gotthard-Bergstrecke – Bellinzona – Locarno': {
    property: 'touristische_linie',
    color: '#ab267d',
  },
  'Gotthard Panorama Express: Luzern – Vierwaldstättersee – Flüelen – Gotthard-Bergstrecke – Bellinzona – Lugano': {
    property: 'touristische_linie',
    color: '#fff200',
    extraSources: {
      ship100: {
        type: 'geojson',
        data: ship100GothardPanoramExpress,
      },
      ship150: {
        type: 'geojson',
        data: ship150GothardPanoramExpress,
      },
    },
    extraStyleLayers: [
      {
        maxzoom: 12,
      },
      {
        minzoom: 12,
      },
    ],
  },
  'Jungfrau-Region: Interlaken Ost – Grindelwald – Kleine Scheidegg – Jungfraujoch': {
    property: 'touristische_linie',
    color: '#00b9c0',
  },
  'Jungfrau-Region: Interlaken Ost – Lauterbrunnen – Wengen – Kleine Scheidegg – Jungfraujoch': {
    property: 'touristische_linie',
    color: '#000000',
  },
  'Landquart – Scuol-Tarasp: Landquart – Klosters Platz – Sagliains – Scuol-Tarasp': {
    property: 'touristische_linie',
    color: '#ff004c',
  },
  'Mont Blanc Express: Martigny – Le Châtelard – Chamonix': {
    property: 'touristische_linie',
    color: '#ff9f00',
  },
  'Pilatus: Alpnachstad – Pilatus Kulm': {
    property: 'touristische_linie',
    color: '#00ff21',
  },
  'Rigi-Region: Arth-Goldau – Rigi Kulm': {
    property: 'touristische_linie',
    color: '#aaad00',
  },
  'Rigi-Region: Vitznau – Rigi Kulm': {
    property: 'touristische_linie',
    color: '#00fff1',
  },
  'Rigi-Region: Weggis – Rigi Kaltbad': {
    property: 'touristische_linie',
    color: '#16cb00',
  },
  'Titlis-Region: Engelberg – Titlis': {
    property: 'touristische_linie',
    color: '#6800ff',
  },
  'Voralpenexpress: St. Gallen – Rapperswil – Arth-Goldau – Küssnacht am Rigi – Luzern': {
    property: 'touristische_linie',
    color: '#0000ff',
  },
};
