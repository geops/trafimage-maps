import { containsCoordinate } from 'ol/extent';
import { useEffect } from 'react';

const KEYCODE_TAB = 9;
const KEYCODE_ENTER = 13;

/**
 * This component provides accessibility for map features.
 *
 * Accessibility needs to be enabled for top-level layers
 * by setting the hasAccessibility property. For now only
 * single (radioGroup) TrackerLayers are supported.
 */
const MapAccessibility = ({ layers, map }) => {
  useEffect(() => {
    let tabFeature;
    let tabLayer;
    let tabFeatureIndex = 0;

    const mapAccessibility = (e) => {
      // cycle through map features
      if (e.which === KEYCODE_TAB) {
        [tabLayer] = layers
          .filter((l) => l.getVisible() && l.properties.hasAccessibility)
          .map((l) => l.getVisibleChildren())
          .flat();
        if (document.body === document.activeElement && tabLayer) {
          if (tabLayer.isTrackerLayer) {
            const extent = map.getView().calculateExtent();
            tabFeature = tabLayer.tracker
              .getTrajectories()
              .filter((t) => containsCoordinate(extent, t.coordinate))[
              tabFeatureIndex
            ];
            if (tabFeature) {
              tabLayer.tracker.setHoverVehicleId(tabFeature.id);
              tabFeatureIndex += 1;
              e.preventDefault();
            } else {
              tabLayer.tracker.setHoverVehicleId(null);
              tabFeature = null;
              tabFeatureIndex = 0;
            }
          }
        }
      }

      // click on highlighted feature
      if (e.which === KEYCODE_ENTER && tabFeature && tabLayer) {
        if (tabLayer.isTrackerLayer) {
          const { coordinate } = tabFeature;
          map.dispatchEvent({ type: 'singleclick', map, coordinate });
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', mapAccessibility);

    return function cleanup() {
      document.removeEventListener('keydown', mapAccessibility);
    };
  });

  return null;
};

export default MapAccessibility;
