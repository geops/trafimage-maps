import Feature from 'ol/Feature';
import {
  gttos,
  premium,
  direktverbindungenDay,
  direktverbindungenNight,
  highlights,
} from '../config/ch.sbb.sts';
import { getId } from './removeDuplicateFeatures';

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
      feature.set('layer', layer);
      infoFeatures[layer.key] = infoFeatures[layer.key] || [];
      infoFeatures[layer.key].push(feature);
    });
  });

  // First we put highlights on first position in the popup.
  // We display only one highlight.
  if (infoFeatures[highlights.key]) {
    const [firstFeature] = infoFeatures[highlights.key].reverse();
    firstFeature.set('layer', highlights.key);
    featuresForPopup.push(firstFeature);
  }

  // Then we put all direktverbindung features
  if (
    infoFeatures[direktverbindungenDay.name] ||
    infoFeatures[direktverbindungenNight.name]
  ) {
    [
      ...(infoFeatures[direktverbindungenDay.name] || []),
      ...(infoFeatures[direktverbindungenNight.name] || []),
    ].forEach((feature) => {
      const {
        start_station_name: start,
        end_station_name: end,
        vias,
      } = feature.getProperties();

      const switchVias = (Array.isArray(vias) ? vias : JSON.parse(vias)).filter(
        (via) => via.via_type === 'switch' || via.via_type === 'visible',
      );
      feature.set('vias', [
        { station_name: start },
        ...switchVias,
        { station_name: end },
      ]);
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
    const layerName = feature.get('layer').key;
    // Read routes for gttos or panorama layers
    const propertyName =
      layerName === gttos.key ? 'route_names_gttos' : 'route_names_premium';
    feature.set('routeProperty', propertyName);
    const routeNames = (feature.get(propertyName) || '').split(',');
    const toursByRoute = {};

    // For each route name we create a new feature.
    // eslint-disable-next-line
    routeNames.forEach((routeName) => {
      if (/Optional Shortcut/.test(routeName)) {
        featuresForPopup.push(
          new Feature({
            title: 'Optional Shortcut',
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
    if (/Optional Shortcut/.test(feature.get('title'))) {
      featuresForPopup.push(
        new Feature({
          title: 'Optional Shortcut',
        }),
      );
    }

    // // eslint-disable-next-line no-restricted-globals
    // if (!isNaN(feature.get('valid_sts'))) {
    //   areaOfValidity = `${feature.get('valid_sts')}`;
    // }
  }

  // Remove duplicate routes (at intersections)
  const routeNames = [];
  featuresForPopup = featuresForPopup.filter((f) => {
    const title = f.get('title');
    if (!title || routeNames.indexOf(title) === -1) {
      routeNames.push(title);
      return true;
    }
    return false;
  });

  // At the end we add the STS validity text
  // if a poi highlight (icon) is clicked, value comes from area_of_validity property of the poi
  // eslint-disable-next-line max-len
  // else if a gttos or premium tours (colored lines) is clicked, value comes from valid_sts property of the mapbox feature
  // eslint-disable-next-line max-len
  // else if a other route (sts.line) (red line) is clicked, value comes from valid_sts property of the mapbox feature (nova daten)
  // eslint-disable-next-line max-len
  // else if a other route (sts_others) (all grey lines) is clicked, value comes from valid_sts property of the mapbox feature
  //   if (areaOfValidity !== undefined) {
  //     const feat = new Feature({
  //       validity: validText[areaOfValidity] || areaOfValidity,
  //     });
  //     featuresForPopup.push(feat);
  //   }

  return featuresForPopup;
};

export default parseFeaturesInfos;
