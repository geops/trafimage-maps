import React from "react";
import { PropTypes } from "prop-types";
import { BeleuchtungLegendeRow } from "../BeleuchtungTopicInfo/BeleuchtungLegende";

function BeleuchtungLayerInfo({ properties }) {
  const lightClass = properties.name.split("beleuchtungsstaerken")[1];
  return <BeleuchtungLegendeRow lightClass={lightClass} />;
}

BeleuchtungLayerInfo.propTypes = {
  properties: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default BeleuchtungLayerInfo;
