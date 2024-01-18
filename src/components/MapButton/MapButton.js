import React from "react";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";

const StyledIconButton = withStyles((theme) => ({
  root: {
    backgroundColor: "white",
    borderRadius: "50%",
    width: 40,
    height: 40,
    boxShadow: "0 0 7px rgba(0, 0, 0, 0.9)",
    transition: "box-shadow 0.5s ease",
    color: theme.colors.darkGray,
    "&:hover": {
      boxShadow: "0 0 12px 2px rgba(0, 0, 0, 0.9)",
      backgroundColor: "white",
      color: theme.colors.darkGray,
    },
    "&:disabled": {
      boxShadow: "0 0 7px 2px rgba(0, 0, 0, 0.4)",
      backgroundColor: "white",
      "& svg": {
        opacity: 0.4,
      },
    },
  },
}))(IconButton);

function MapButton({ children, onClick, ...props }) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledIconButton onClick={onClick} {...props}>
      {children}
    </StyledIconButton>
  );
}

MapButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

MapButton.defaultProps = {
  onClick: () => null,
};

export default MapButton;
