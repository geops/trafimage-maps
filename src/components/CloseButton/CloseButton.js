import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
  root: {
    height: 50,
    width: 50,
    zIndex: 1002,
  },
}));

function CloseButton({ children, ...props }) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <IconButton
      size="medium"
      className={classes.root}
      title={t("Schliessen")}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children || <MdClose focusable={false} alt={t("Schliessen")} />}
    </IconButton>
  );
}

CloseButton.propTypes = {
  children: PropTypes.node,
};

CloseButton.defaultProps = { children: undefined };

export default CloseButton;
