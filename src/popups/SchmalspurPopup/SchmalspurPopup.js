import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Typography } from '@material-ui/core';
import RailplusLayer from '../../layers/RailplusLayer';

function SchmalspurPopup({ feature, layer }) {
  const tuDetails = layer.railplusProviders[feature.get('isb_tu_nummer')];

  return (
    <div>
      <Typography variant="body2">{tuDetails.long_name}</Typography>
    </div>
  );
}

SchmalspurPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(RailplusLayer).isRequired,
};

export default React.memo(SchmalspurPopup);
