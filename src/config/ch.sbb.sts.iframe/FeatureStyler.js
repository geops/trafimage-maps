import { Style, Icon, Stroke, Fill, Circle } from 'ol/style';
import { GeoJSON } from 'ol/format';
import gttosColors from './GttosColors';
import poiImage from './img/poi.png';
import poiImageHL from './img/poi_hl.png';

class FeatureStyler {
  constructor() {
    this.routeColors = gttosColors;
    this.styleCache = {};
    this.format = new GeoJSON();

    this.poiStyle = new Style({
      image: new Icon({
        src: poiImage,
        anchor: [0.5, 41],
        anchorYUnits: 'pixels',
      }),
    });

    this.poiStyleHl = new Style({
      image: new Icon({
        src: poiImageHL,
        anchor: [0.5, 41],
        anchorYUnits: 'pixels',
      }),
    });

    this.validifyHighlight = new Style({
      stroke: new Stroke({
        color: 'rgba(255,255,255,0.8)',
        width: 8,
      }),
    });

    this.generalizationMap = {
      750: 10,
      500: 10,
      250: 30,
      100: 30,
      50: 100,
      20: 100,
      10: 100,
      5: 100,
    };
  }

  /**
   * Return a generalization level for a given resolution.
   * @param {Number} resolution Given resolution.
   */
  getGeneralization(resolution) {
    // some magic to find the closest valid resolution
    const closest = Object.keys(this.generalizationMap).reduce((p, c) =>
      Math.abs(c - resolution) < Math.abs(p - resolution) ? c : p,
    );

    return this.generalizationMap[closest];
  }

  /**
   * Highlight a feature by giving it's name.
   * @param {String} name Name of the feature to highlight.
   */
  setHighlightFeature(name) {
    this.highlightFeatureName = name;
  }

  validHighlightStyleFunction() {
    return this.validifyHighlight;
  }

  /**
   * Style function for Points of interests (Highlights).
   * @param {ol.Feature} feature Feature to style.
   * @returns {Array.<Style>}
   */
  poisStyleFunction(feature) {
    if (!feature.get('highlight_url')) {
      return null;
    }
    return feature.get('title') === this.highlightFeatureName
      ? this.poiStyleHl
      : this.poiStyle;
  }

  /**
   * Style static function for Geolocation Point.
   */
  geolocStyleFunction(rotation, opacity) {
    this.stroke = new Stroke({
      lineDash: [25, 5],
      lineCap: 'butt',
      width: 6,
      color: `rgba(0, 61, 133,${opacity})`,
    });

    return new Style({
      image: new Circle({
        radius: 20,
        rotation,
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.01)',
        }),
        stroke: this.stroke,
      }),
    });
  }

  /**
   * Style function for route stroke.
   * @param {ol.Feature} f Feature to style.
   * @param {Number} res Resolution.
   */
  routeStyleFunction(f, res) {
    if (f.get('generalization_level') !== this.getGeneralization(res)) {
      return [];
    }

    const title = f.get('title');
    const shortcutTitle = 'Optional Shortcut';
    const shortcutRegex = new RegExp(shortcutTitle);

    if (!this.styleCache[title]) {
      this.styleCache[title] = [];
      const titles = title.split(',');
      const containsShortcut = shortcutRegex.test(title);

      // generate stroke style
      for (let i = 0; i < titles.length; i += 1) {
        const isShortcut = shortcutRegex.test(titles[i]);
        let w = 10;
        if (isShortcut) {
          w *= 2 / 3;
        }
        if (!this.routeColors[titles[i]]) {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          this.routeColors[titles[i]] = `rgba(${r},${g},${b},0.7)`;
        }

        if (titles.length === 1 || containsShortcut) {
          this.styleCache[title].push(
            new Style({
              stroke: new Stroke({
                width: w,
                color: this.routeColors[titles[i]],
              }),
            }),
          );
        } else {
          this.styleCache[title].push(
            new Style({
              stroke: new Stroke({
                width: w,
                lineDash: [10, 10 * (titles.length - 1)],
                lineDashOffset: i * 10,
                lineCap: 'butt',
                color: this.routeColors[titles[i]],
              }),
            }),
          );
        }
      }
    }

    let style = this.styleCache[title];

    // add highlighting
    if (f.get('title').indexOf(this.highlightFeatureName) > -1) {
      style = [...style];
      style.unshift(
        new Style({
          stroke: new Stroke({
            width: 15,
            color: 'rgba(255,255,255,0.4)',
          }),
        }),
      );
    }

    return style;
  }
}

const styler = new FeatureStyler();
export default styler;
