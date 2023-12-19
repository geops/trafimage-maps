import Feature from "ol/Feature";
import { gttos, premium, highlights } from "../config/ch.sbb.sts";
import { dvDay, dvNight } from "../config/ch.sbb.direktverbindungen";
import { getId } from "./removeDuplicateFeatures";
import parseDvFeatures from "./dvParseFeatures";

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

  // First we put highlights on first position in the popup.
  // We display only one highlight.
  if (infoFeatures[highlights.key]) {
    const [firstFeature] = infoFeatures[highlights.key].reverse();
    firstFeature.set("layer", highlights.key);
    featuresForPopup.push(firstFeature);
  }

  // Then we put all direktverbindung features
  if (infoFeatures[dvDay.name] || infoFeatures[dvNight.name]) {
    parseDvFeatures([
      ...(infoFeatures[dvDay.name] || []),
      ...(infoFeatures[dvNight.name] || []),
    ]).forEach((feature) => {
      featuresForPopup.push(feature);
    });
  }

  // Then we display the gttos and premium features if a validity text has not been
  // found with the poi highlights.
  if (infoFeatures[gttos.key] || infoFeatures[premium.key]) {
    const [feature] = [
      ...(infoFeatures[gttos.key] || []),
      ...(infoFeatures[premium.key] || []),
    ];
    const layerName = feature.get("layer").key;
    // Read routes for gttos or panorama layers
    const propertyName =
      layerName === gttos.key ? "route_names_gttos" : "route_names_premium";
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
