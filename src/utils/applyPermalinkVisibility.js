import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import qs from "query-string";

/**
 * This function apply permalink 'layers' to a list of layers.
 * Useful on load of a topic to avoid loading unecessary data or styles.
 */
const applPermalinkVisiblity = (layers, filterTopic) => {
  const isSSR = typeof window === "undefined";
  // We apply the visibility depending on the layers parameter only if it's the good topic.
  const { pathname } = !isSSR ? window.location : {};
  if (!isSSR && filterTopic(pathname)) {
    const { layers: layersParam, baselayers: baseLayersParam } = qs.parse(
      window.location.search,
    );

    const hasBaseLayersParam = !!(
      baseLayersParam !== null && baseLayersParam !== undefined
    );

    if (hasBaseLayersParam) {
      const [baseLayerVisible] =
        (baseLayersParam && baseLayersParam.split(",")) || [];

      // We use the layer service only to update properly the inital visibility to parent layer.
      getLayersAsFlatArray(layers)
        .filter((layer) => layer.get("isBaseLayer"))
        .forEach((layer) => {
          // eslint-disable-next-line no-param-reassign
          layer.visible = baseLayerVisible === layer.key;

          // When the base layer refers to a MapboxLayer we have to update the style of the
          // mapbox layer too, too avoid seeing the previous background first.
          if (layer.visible && layer.style && layer.mapboxLayer) {
            // eslint-disable-next-line no-param-reassign
            layer.mapboxLayer.style = layer.style;
          }
        });
    }

    const hasLayersParam = !!(
      layersParam !== null && layersParam !== undefined
    );

    if (hasLayersParam) {
      const layerKeys = (layersParam && layersParam.split(",")) || [];

      // We use the layer service only to update properly the inital visibility to parent layer.
      getLayersAsFlatArray(layers)
        // Permalink layers param only use layer in legend and non baselayer
        .filter(
          (layer) => !layer.get("isBaseLayer") && !layer.get("hideInLegend"),
        )
        .forEach((layer) => {
          // eslint-disable-next-line no-param-reassign
          layer.visible = layerKeys.includes(layer.key);
        });
    }
  }
};

export default applPermalinkVisiblity;
