import PropTypes from "prop-types";
import React from "react";
import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

function CloseButton({ children, ...props }) {
  const { t } = useTranslation();
  return (
    <IconButton
      size="medium"
      className="wkp-close-bt"
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
