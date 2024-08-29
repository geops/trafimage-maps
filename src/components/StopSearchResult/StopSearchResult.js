import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import isoToIntlVehicleCode from "../../utils/isoToIntlVehicleCode";

const propTypes = {
  properties: PropTypes.shape({
    name: PropTypes.string,
    municipality_name: PropTypes.string,
    country_code: PropTypes.string,
  }),
};

function StopSearchResult({ properties = {} }) {
  if (!properties) {
    return null;
  }
  const {
    name: title,
    municipality_name: municipality,
    country_code: countryCode,
  } = properties;
  let subtitle = municipality;

  if (!municipality && countryCode) {
    subtitle = isoToIntlVehicleCode(countryCode);
  }
  if (municipality && countryCode) {
    subtitle = `${municipality} (${isoToIntlVehicleCode(
      properties.country_code,
    )})`;
  }
  return (
    title && (
      <div
        className="wkp-search-suggestion-subtitled"
        data-testid="stopfinder-search-result"
      >
        <Typography>{title}</Typography>
        {subtitle ? (
          <Typography variant="subtitle1">{subtitle}</Typography>
        ) : null}
      </div>
    )
  );
}

StopSearchResult.propTypes = propTypes;

export default StopSearchResult;
