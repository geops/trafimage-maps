import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import React from "react";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

function CloseButton({ children, ...props }) {
  const { t } = useTranslation();
  return (
    <IconButton
      size="medium"
      sx={{
        height: 50,
        width: 50,
        zIndex: 1002,
      }}
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
