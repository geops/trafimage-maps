import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => {
  return {
    partner: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "8px 0",
    },
    partnerColor: {
      flexShrink: 0,
      width: (props) => props.iconSize || 15,
      height: (props) => props.iconSize || 15,
      border: `1px solid ${theme.colors.lighterGray}`,
    },
  };
});

function TarifverbundPartner({ color, label, iconSize, style, children }) {
  const classes = useStyles({ iconSize });

  return (
    <div
      className={classes.partner}
      data-testid={`tarifverbund-partner-${label}`}
    >
      <div
        className={classes.partnerColor}
        style={
          style || {
            backgroundColor: color || "black",
          }
        }
        data-testid={`tarifverbund-partner-${label}-color`}
      />
      {children || label}
    </div>
  );
}

TarifverbundPartner.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.shape(),
  iconSize: PropTypes.number,
};

TarifverbundPartner.defaultProps = {
  color: null,
  style: null,
  children: null,
  iconSize: 15,
};

export default TarifverbundPartner;
