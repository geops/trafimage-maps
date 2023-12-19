import { useMemo } from "react";
import getPopupComponent from "./getPopupComponent";

const useIndexedFeatureInfo = (featureInfo) => {
  const infoIndexed = useMemo(() => {
    const features = [];

    // List of corresponding layer for each features in the array.
    const layers = [];

    // List of corresponding coordinates clicked for each features in the array.
    const coordinates = [];

    // When a popup use hidePagination, we store the index for each popup.
    const indexByPopup = {};

    featureInfo.forEach((featInfo) => {
      const PopupComponent = getPopupComponent(featInfo);

      if (PopupComponent && PopupComponent.hidePagination) {
        const name = PopupComponent.displayName;
        // All features using this PopupComponent will be render on the same page
        if (indexByPopup[name] !== undefined) {
          features[indexByPopup[name]].push(...featInfo.features);
          featInfo.features.forEach(() => {
            if (!layers[indexByPopup[name]]) {
              layers[indexByPopup[name]] = [];
              coordinates[indexByPopup[name]] = [];
            }
            if (!coordinates[indexByPopup[name]]) {
              coordinates[indexByPopup[name]] = [];
            }
            layers[indexByPopup[name]].push(featInfo.layer);
            coordinates[indexByPopup[name]].push(featInfo.coordinate);
          });
        } else {
          // At this point features must be displayed in the same popup, that's why we push an array.
          features.push([...featInfo.features]);
          const arr = [];
          const arrCoord = [];
          featInfo.features.forEach(() => {
            arr.push(featInfo.layer);
            arrCoord.push(featInfo.coordinate);
          });
          layers.push(arr);
          coordinates.push(arrCoord);
          indexByPopup[name] = features.length - 1;
        }
      } else if (PopupComponent) {
        features.push(...featInfo.features);
        featInfo.features.forEach(() => {
          layers.push(featInfo.layer);
          coordinates.push(featInfo.coordinate);
        });
      }
    });
    return { features, layers, coordinates };
  }, [featureInfo]);
  return infoIndexed;
};

export default useIndexedFeatureInfo;
