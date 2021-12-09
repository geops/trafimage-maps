import OLMap from 'ol/Map';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Layer } from 'mobility-toolbox-js/ol';

const KEYCODE_TAB = 9;
const KEYCODE_ENTER = 13;

/**
 * This component provides accessibility for map features.
 *
 * Accessibility needs to be enabled for top-level layers
 * by setting the hasAccessibility property. For now only
 * single (radioGroup) TrackerLayers are supported.
 * @private
 */
const MapAccessibility = ({ layers, map }) => {
  useEffect(() => {
    const mapTarget = map.getTarget();
    let tabFeature;
    let tabLayer;
    let tabFeatureIndex = -1;

    const mapAccessibility = (evt) => {
      // cycle through map features
      if (evt.which === KEYCODE_TAB && mapTarget === document.activeElement) {
        [tabLayer] = layers
          .filter((l) => l.visible && l.properties.hasAccessibility)
          .map((l) => l.getVisibleChildren())
          .flat();
        if (tabLayer && tabLayer.isTrackerLayer) {
          const trajectories = tabLayer.renderedTrajectories;
          trajectories.sort((a, b) =>
            a.coordinate && a.coordinate[0] < b.coordinate[0] ? -1 : 1,
          );
          tabFeatureIndex += evt.shiftKey ? -1 : 1;
          tabFeature = trajectories[tabFeatureIndex];

          if (tabFeature) {
            tabLayer.hoverVehicleId = tabFeature.id;
            evt.preventDefault();
          } else {
            tabLayer.hoverVehicleId = null;
            tabFeature = null;
            tabFeatureIndex = -1;
          }
        }
      }

      // click on highlighted feature
      if (
        evt.which === KEYCODE_ENTER &&
        tabFeature &&
        tabLayer &&
        tabLayer.isTrackerLayer
      ) {
        const { coordinate } = tabFeature;
        map.dispatchEvent({ type: 'singleclick', map, coordinate });
        evt.preventDefault();
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
