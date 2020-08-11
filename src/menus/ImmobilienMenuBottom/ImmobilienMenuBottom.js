import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

const ImmobilienMenuBottom = ({ topic }) => {
  const [active, setActive] = useState(false);
  const onClick = () => {
    topic.layers
      .filter((l) => !l.isBaseLayer && l instanceof MapboxStyleLayer)
      .forEach((layer) => {
        if (layer) {
          const { mbMap } = layer.mapboxLayer;
          const style = mbMap.getStyle();
          if (!mbMap || !style) {
            return;
          }
          setActive(!active);

          for (let i = 0; i < style.layers.length; i += 1) {
            const styleLayer = style.layers[i];

            mbMap.setFilter(
              styleLayer.id,
              active ? ['all', ['==', 'stuetzpunktbahnhof', true]] : undefined,
            );
          }
        }
      });
  };

  return (
    <div
      className="wkp-topic-filter"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
    >
      Change Filter
    </div>
  );
};

ImmobilienMenuBottom.propTypes = propTypes;

export default ImmobilienMenuBottom;
