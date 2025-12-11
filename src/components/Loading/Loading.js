import React from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

function Loading(props) {
  const { label, icon = <CircularProgress size={18} /> } = props;

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", my: 2 }}>
      {icon}
      {label && <Typography>{label}</Typography>}
    </Box>
  );
}

Loading.propTypes = {
  label: PropTypes.node,
  icon: PropTypes.node,
};

export default Loading;
