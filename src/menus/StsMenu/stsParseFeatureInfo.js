import Feature from "ol/Feature";
import {
  DV_DAY_LAYER_KEY,
  DV_NIGHT_LAYER_KEY,
} from "../../config/ch.sbb.direktverbindungen";
import parseDvFeatures from "../../config/ch.sbb.direktverbindungen/dvParseFeatures";
import { getId } from "../../utils/removeDuplicateFeatures";
import { GTTOS_LAYER_KEY } from "../../config/ch.sbb.sts";

/**
 * Rearrange the features for the popup
 */
export const parseFeaturesInfos = (infos, tours = []) => {
  const infoFeatures = {};
  let featuresForPopup = [];

  // We order features by layer's name
  infos.forEach((info) => {
    const { layer, features } = info;

    features.forEach((feature) => {
      feature.set("layer", layer);
      infoFeatures[layer.key] = infoFeatures[layer.key] || [];
      infoFeatures[layer.key].push(feature);
    });
  });

  // Then we put all direktverbindung features
  if (infoFeatures[DV_DAY_LAYER_KEY] || infoFeatures[DV_NIGHT_LAYER_KEY]) {
    parseDvFeatures([
      ...(infoFeatures[DV_DAY_LAYER_KEY] || []),
      ...(infoFeatures[DV_NIGHT_LAYER_KEY] || []),
    ]).forEach((feature) => {
      featuresForPopup.push(feature);
    });
  }

  // Then we display the gttos features if a validity text has not been
  // found with the poi highlights.
  if (infoFeatures[GTTOS_LAYER_KEY]) {
    const [feature] = [...(infoFeatures[GTTOS_LAYER_KEY] || [])];
    const layerName = feature.get("layer").key;
    // Read routes for gttos or panorama layers
    const propertyName = "route_names_gttos";
    feature.set("routeProperty", propertyName);
    const routeNames = (feature.get(propertyName) || "").split(",");
    const toursByRoute = {};

    // For each route name we create a new feature.
    // eslint-disable-next-line
    routeNames.forEach((routeName) => {
      if (/Optional Shortcut/.test(routeName)) {
        featuresForPopup.push(
          new Feature({
            title: "Optional Shortcut",
            routeProperty: propertyName,
          }),
        );
      } else {
        toursByRoute[routeName] = tours.find(
          (tour) => tour.title === routeName.trim(),
        );
        const clone = feature.clone();
        clone.setProperties({
          ...feature.getProperties(),
          ...toursByRoute[routeName],
          id: getId(feature),
        });
        if (toursByRoute[routeName]) {
          featuresForPopup = featuresForPopup.concat(clone);
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `Layer ${layerName}: There is no info for the tour '${routeName}' `,
            clone.getProperties(),
          );
        }
      }
    });

    // Add a feature for Optional Shortcut which have not pois
    if (/Optional Shortcut/.test(feature.get("title"))) {
      featuresForPopup.push(
        new Feature({
          title: "Optional Shortcut",
        }),
      );
    }
  }

  // Remove duplicate routes (at intersections)
  const routeNames = [];
  featuresForPopup = featuresForPopup.filter((f) => {
    const title = f.get("title");
    if (!title || routeNames.indexOf(title) === -1) {
      routeNames.push(title);
      return true;
    }
    return false;
  });

  return featuresForPopup;
};

export default parseFeaturesInfos;
