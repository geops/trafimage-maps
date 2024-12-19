import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as Pencil } from "../../img/pencil.svg";

function DrawButton({ children, onClick, ...buttonProps }) {
  const mapsetUrl = useSelector((state) => state.app.mapsetUrl);
  const { t } = useTranslation();

  return (
    <IconButton
      title={t("Neue Zeichnung")}
      size="medium"
      /* We use a function instead of href to be able to get the proper window.location value. */
      onClick={() => {
        onClick?.();
        // window.open is esaier to test.
        window.open(
          `${mapsetUrl}?parent=${encodeURIComponent(window.location)}`,
          "_self",
        );
      }}
      {...buttonProps}
    >
      {children || <Pencil focusable={false} />}
    </IconButton>
  );
}

DrawButton.propTypes = {
  children: PropTypes.element,
  onClick: PropTypes.func,
};

export default React.memo(DrawButton);
