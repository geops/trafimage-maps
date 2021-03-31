import React, { memo } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  properties: PropTypes.object.isRequired,
};

const BetriebsRegionenPopup = ({ properties }) => {
  const { region } = properties;
  return (
    <div>
      <span>{region}</span>
    </div>
  );
};

BetriebsRegionenPopup.propTypes = propTypes;
export default memo(BetriebsRegionenPopup);
