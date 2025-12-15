/* eslint-disable import/no-extraneous-dependencies */
import "jest-canvas-mock";
import "react-app-polyfill/stable";
import ResizeObserver from "resize-observer-polyfill";
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";
import "@testing-library/jest-dom";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import proj4 from "proj4";
import Map from "ol/Map";
import { register } from "ol/proj/proj4";
import mediaQuery from "css-mediaquery";
import { loadI18n } from "./i18n";

proj4.defs(
  "EPSG:21781",
  "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 " +
    "+x_0=600000 +y_0=200000 +ellps=bessel " +
    "+towgs84=660.077,13.551,369.344,2.484,1.783,2.939,5.66 +units=m +no_defs",
);

proj4.defs(
  "EPSG:2056",
  "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 " +
    "+x_0=2600000 +y_0=1200000 +ellps=bessel " +
    "+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
);

register(proj4);

// We don't want to test translations content so we reinitialize the 'de' bundle with empty translations.
const i18n = loadI18n();
i18n.removeResourceBundle("de", "translation");
i18n.addResourceBundle("de", "translation", {});

global.i18n = i18n;

global.URL.createObjectURL = jest.fn(() => "fooblob");

global.ResizeObserver = ResizeObserver;

global.mockStore = configureStore([thunk]);

global.store = global.mockStore({
  map: {},
  app: {
    i18n: global.i18n,
    t: global.i18n.t,
    language: "de",
    map: new Map({}),
  },
});

// See https://mui.com/components/use-media-query/#testing
global.createMatchMedia = (width) => {
  return (query) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  });
};

global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
  clearWatch: jest.fn(),
};

global.matchMedia = global.createMatchMedia(window.innerWidth);

global.sampleKml = `
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd">
    <Document>
        <name>editLayer</name>
        <Placemark>
            <description />
            <Style>
                <IconStyle>
                    <scale>0.333333</scale>
                    <Icon>
                        <href>http://localhost:3000/static/images/RBS/5022_Einfahrt_Verboten.png</href>
                        <gx:w>144</gx:w>
                        <gx:h>144</gx:h>
                    </Icon>
                </IconStyle>
            </Style>
            <ExtendedData>
                <Data name="zIndex">
                    <value>3</value>
                </Data>
            </ExtendedData>
            <Point>
                <coordinates>7.85387959595456,46.72612847778316</coordinates>
            </Point>
        </Placemark>
      </Document>
    </kml>`;
