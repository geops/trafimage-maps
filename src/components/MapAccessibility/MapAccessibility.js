import OLMap from 'ol/Map';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Layer } from 'mobility-toolbox-js/src/ol/';

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
    const mapTarget = map.getTarget();
    let tabFeature;
    let tabLayer;
    let tabFeatureIndex = 0;

    const mapAccessibility = (e) => {
      // cycle through map features
      if (e.which === KEYCODE_TAB) {
        [tabLayer] = layers
          .filter((l) => l.visible && l.properties.hasAccessibility)
          .map((l) => l.getVisibleChildren())
          .flat();
        if (mapTarget === document.activeElement && tabLayer) {
          if (tabLayer.isTrackerLayer) {
            const trajectories = tabLayer.tracker.getRenderedTrajectories();
            trajectories.sort((a, b) =>
              a.coordinate && a.coordinate[0] < b.coordinate[0] ? -1 : 1,
            );
            tabFeature = trajectories[tabFeatureIndex];

            if (tabFeature) {
              tabLayer.tracker.setHoverVehicleId(tabFeature.id);
              tabFeatureIndex += e.shiftKey ? -1 : 1;
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

MapAccessibility.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
};

export default MapAccessibility;
