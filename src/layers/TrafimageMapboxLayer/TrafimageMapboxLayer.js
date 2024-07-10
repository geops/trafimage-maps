import {
  MaplibreLayer,
  // getMapGlCopyrights
} from "mobility-toolbox-js/ol";
// import { toLonLat } from "ol/proj";

// const applyFilters = (mbStyle, filters) => {
//   const newStyle = { ...mbStyle };
//   /* Apply filters, remove style layers */
//   if (mbStyle && filters) {
//     const layers = [];
//     (filters || []).forEach((filter) => {
//       const styleLayers = mbStyle.layers;
//       for (let i = 0; i < styleLayers.length; i += 1) {
//         const style = styleLayers[i];
//         /* filter.include boolean determines if the identified
//          * styleLayers or all others should be removed
//          */
//         const condition = filter.include
//           ? filter.value.test(style[filter.field])
//           : !filter.value.test(style[filter.field]);
//         if (condition) {
//           // mapboxStyle.layers.splice(i, 1);
//           layers.push(mbStyle.layers[i]);
//         }
//       }
//     });
//     newStyle.layers = layers;
//   }
//   return newStyle;
// };

class TrafimageMapboxLayer extends MaplibreLayer {
  constructor(options) {
    super({
      ...options,
    });
    // this.filters = options.filters;

    // TODO don't use process.env here it fails in Schulzug
    // this.stylePrefix = process?.env?.REACT_APP_STYLE_REVIEW_PREFIX || '';
    this.stylePrefix = "";
    this.style = options.style;
  }

  // attachToMap(map) {
  //   super.attachToMap(map);

  //   if (this.map) {
  //     this.dispatchEvent({
  //       type: "init",
  //       target: this,
  //     });
  //   }

  //   // Set zIndex if specified
  //   if (this.options && this.options.zIndex) {
  //     this.olLayer
  //       .getLayersArray()
  //       .forEach((layer) => layer.setZIndex(this.options.zIndex));
  //   }
  //   this.abortController = new AbortController();
  // }

  // detachFromMap(map) {
  //   if (this.abortController) {
  //     this.abortController.abort();
  //   }

  //   super.detachFromMap(map);

  //   this.dispatchEvent({
  //     type: "terminate",
  //     target: this,
  //   });
  // }

  setStyle(newStyle) {
    // TODO manage if newStyle is null
    if (this.style === newStyle || !newStyle) {
      return;
    }
    this.style = this.stylePrefix + newStyle;
    // this.setStyleConfig();
  }

  // applyStyle(data) {
  //   const styleFiltered = applyFilters(data, this.filters);

  //   this.maplibreMap.setStyle(styleFiltered);
  //   this.maplibreMap.once("styledata", () => {
  //     this.onStyleLoaded();
  //   });
  // }

  setStyleConfig(url, key, apiKeyName) {
    this.apiKeyName = apiKeyName;
    this.apiKey = key;
    this.url = url;

    // if (url && url !== this.url) {
    //   this.url = url;
    // }
    // if (key && key !== this.apiKey) {
    //   this.apiKey = key;
    // }
    // if (apiKeyName && apiKeyName !== this.apiKeyName) {
    //   this.apiKeyName = apiKeyName;
    // }

    // const searchParams = new URLSearchParams({
    //   [this.apiKeyName]: this.apiKey,
    // });

    // const newStyleUrl = `${this.url}/styles/${this.stylePrefix}${
    //   this.style
    // }/style.json?${searchParams.toString()}`;

    // // Don't apply style if not necessary otherwise
    // // it will remove styles applied by MapboxStyleLayer layers.
    // if (this.styleUrl === newStyleUrl) {
    //   return;
    // }

    // this.styleUrl = newStyleUrl;

    // if (!this.maplibreMap) {
    //   if (this.filters) {
    //     this.on("load", () => {
    //       this.applyStyle(this.maplibreMap.getStyle());
    //     });
    //   }
    //   return;
    // }

    // // We load the new style.
    // this.loadStyle(newStyleUrl);
  }

  // getFeatures({ source, sourceLayer, filter } = {}) {
  //   const { maplibreMap } = this;
  //   // Ignore the getFeatureInfo until the source is loaded
  //   if (
  //     !maplibreMap ||
  //     !maplibreMap.getSource(source) ||
  //     !maplibreMap.isSourceLoaded(source)
  //   ) {
  //     return [];
  //   }
  //   return maplibreMap.querySourceFeatures(source, {
  //     sourceLayer,
  //     filter,
  //   });
  // }

  /**
   * Request feature information for a given coordinate and read clustered features.
   * @param {ol/coordinate~Coordinate} coordinate Coordinate to request the information at.
   * @param {Object} options A [mapboxgl.Map#queryrenderedfeatures](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#queryrenderedfeatures) options parameter.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   * @ignore
   */
  // async getFeatureInfoAtCoordinate(coordinate, options) {
  //   // Ignore the getFeatureInfo until the mapbox map is loaded
  //   if (
  //     !options ||
  //     !this.format ||
  //     !this.maplibreMap ||
  //     !this.maplibreMap.isStyleLoaded() ||
  //     this.map?.getView().getAnimating() ||
  //     this.map?.getView().getInteracting()
  //   ) {
  //     return Promise.resolve({ coordinate, features: [], layer: this });
  //   }

  //   let pixel = coordinate && this.maplibreMap.project(toLonLat(coordinate));

  //   if (this.hitTolerance) {
  //     const { x, y } = pixel;
  //     pixel = [
  //       { x: x - this.hitTolerance, y: y - this.hitTolerance },
  //       { x: x + this.hitTolerance, y: y + this.hitTolerance },
  //     ];
  //   }

  //   // At this point we get GeoJSON Mapbox feature, we transform it to an OpenLayers
  //   // feature to be consistent with other layers.
  //   const renderedFeatures = this.maplibreMap.queryRenderedFeatures(
  //     pixel,
  //     options,
  //   );
  //   const features = [];
  //   const promises = [];

  //   for (let i = 0; i < renderedFeatures.length; i += 1) {
  //     const feature = renderedFeatures[i];
  //     if (feature.properties.cluster) {
  //       const source = this.maplibreMap.getSource(feature.layer.source);
  //       const { cluster_id: id, point_count: count } = feature.properties;
  //       // because Mapbox GL JS should be fast ...
  //       // eslint-disable-next-line no-await-in-loop
  //       promises.push(
  //         new Promise((resolve) => {
  //           source.getClusterLeaves(id, count, 0, (_, cfs) => {
  //             cfs?.forEach((cf) => {
  //               const olFeature = this.format.readFeature(cf);
  //               if (olFeature) {
  //                 olFeature.set("mapboxFeature", cf);
  //               }
  //               features.push(olFeature);
  //             });
  //             resolve(cfs);
  //           });
  //         }),
  //       );
  //     } else {
  //       const olFeature = this.format.readFeature(feature);
  //       if (olFeature) {
  //         olFeature.set("mapboxFeature", feature);
  //       }
  //       features.push(olFeature);
  //     }
  //   }

  //   if (promises.length) {
  //     return Promise.all(promises).then(() => {
  //       return { layer: this, features, coordinate };
  //     });
  //   }

  //   return Promise.resolve({ layer: this, features, coordinate });
  // }

  // loadStyle(newStyleUrl) {
  //   if (!newStyleUrl) {
  //     return;
  //   }
  //   if (this.abortController) {
  //     this.abortController.abort();
  //   }
  //   this.abortController = new AbortController();
  //   fetch(newStyleUrl, { signal: this.abortController.signal })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (!this.maplibreMap) {
  //         return;
  //       }
  //       this.applyStyle(data);
  //     })
  //     .catch((err) => {
  //       if (err && err.name === "AbortError") {
  //         // ignore user abort request
  //         return;
  //       }
  //       // eslint-disable-next-line no-console
  //       console.log("Loading of mapbox style failed: ", newStyleUrl, err);
  //     });
  // }

  // onStyleLoaded() {
  //   this.loaded = true;

  //   this.olLayer
  //     .getSource()
  //     .setAttributions(this.copyrights || getMapGlCopyrights(this.maplibreMap));

  //   this.dispatchEvent({
  //     type: "load",
  //     target: this,
  //   });
  // }

  /**
   * Create a copy of the TrafimageMapboxLayer.
   * @param {Object} newOptions Options to override
   * @returns {TrafimageMapboxLayer} A TrafimageMapboxLayer
   * @ignore
   */
  clone(newOptions) {
    return new TrafimageMapboxLayer({ ...this.options, ...newOptions });
  }
}

export default TrafimageMapboxLayer;
