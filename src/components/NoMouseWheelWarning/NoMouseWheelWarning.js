import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';

/**
 * This component only deactivate the mouse wheel zoom interaction in embedded mode.
 *
 * In the future it could display a message like the NoDragPanWarning component.
 * @returns
 */
function NoMouseWheelWarning() {
  const map = useSelector((state) => state.app.map);
  const embedded = useSelector((state) => state.app.embedded);

  useEffect(() => {
    if (embedded && map) {
      // Dactivate mouse wheel zoom
      const mouseWheelZoom = map
        .getInteractions()
        .getArray()
        .find((interaction) => interaction instanceof MouseWheelZoom);
      mouseWheelZoom.setActive(false);
    }

    return () => {};
  }, [embedded, map]);

  if (!embedded || !map) {
    return null;
  }

  // For now we don't display any warning
  return null;
}

export default React.memo(NoMouseWheelWarning);
