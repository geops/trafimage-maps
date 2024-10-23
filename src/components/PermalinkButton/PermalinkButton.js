import React, { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaLink } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Popover, IconButton, ToggleButton } from "@mui/material";

const useStyles = makeStyles(() => ({
  content: {
    maxWidth: 300,
    paddingRight: 42,
  },
  button: {
    "& svg": {
      fontSize: "17.63px !important",
    },
  },
}));

function PermalinkButton({
  buttonProps = {},
  children = null,
  popoverProps = {},
}) {
  const classes = useStyles();

  const { t } = useTranslation();
  const ref = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
      if (buttonProps?.onClick) {
        buttonProps.onClick();
      }
    },
    [buttonProps],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const transformOrigin = {
    vertical: "center",
    horizontal: "left",
    ...(popoverProps.transformOrigin || {}),
  };

  const arrowClassName = `wkp-arrow-${transformOrigin.vertical}-${transformOrigin.horizontal}`;

  return (
    <div className="wkp-permalink-bt" ref={ref}>
      {/* ToggleButton is used to set a color when the svg is selected */}
      <ToggleButton
        value=""
        selected={!!anchorEl}
        className={classes.button}
        {...buttonProps}
        onClick={handleClick}
        title={t("Permalink generieren")}
      >
        <FaLink focusable={false} />
      </ToggleButton>
      {!!anchorEl && (
        <Popover
          container={ref.current}
          open
          anchorEl={anchorEl}
          onClose={handleClose}
          elevation={0}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={transformOrigin}
        >
          <div className={arrowClassName} />
          <IconButton className="wkp-close" onClick={handleClose}>
            <MdClose focusable={false} />
          </IconButton>
          <div className={classes.content}>
            {/* We use a function to be able to get the proper window.location value. */}
            {children && children(window.location.href)}
          </div>
        </Popover>
      )}
    </div>
  );
}

PermalinkButton.propTypes = {
  buttonProps: PropTypes.object,
  popoverProps: PropTypes.object,
  children: PropTypes.func,
};

export default React.memo(PermalinkButton);
