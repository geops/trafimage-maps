/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useMemo, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import {
  Dialog as MuiDialog,
  DialogTitle,
  Paper,
  IconButton,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import Draggable from "react-draggable";
import { setDialogVisible, setDialogPosition } from "../../model/app/actions";

const useStyles = makeStyles((theme) => ({
  rootDesktop: {
    zIndex: "0!important",
    pointerEvents: "none",
  },

  paper: {
    minWidth: 320,
    zIndex: 0,
  },
  paperModal: {
    width: "90%",
    maxHeight: "calc(100% - 125px)",
  },
  paperMobile: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    width: "auto",
    zIndex: 1300,
  },

  scrollPaper: {
    display: "block", // Prevent Dialog from growing in all directions
  },
  scrollPaperModal: {
    display: "flex", // Prevent Dialog from growing in all directions
  },

  dialogBody: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.htmlFontSize,
    "& a": {
      color: theme.palette.primary.main,
    },
    "& a:hover": {
      color: theme.palette.secondary.main,
    },
    "&>div:first-child": {
      padding: 20,

      "& > *:first-child": {
        marginTop: 0,
      },

      "& > *:last-child": {
        marginBottom: 0,
      },
    },
    overflowY: "auto",
  },
  dialogBodyDesktop: {
    maxHeight: (props) => (props.isModal ? 620 : "none"),
  },
  dialogBodyMobile: {
    maxHeight: (props) => (props.isModal ? 360 : 280),
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 44,
    height: 50,
  },
}));

const PaperComponent = forwardRef((props, ref) => {
  return <Paper square ref={ref} {...props} elevation={4} />;
});

function DraggablePaperComponent(props) {
  const dispatch = useDispatch();
  const dialogPosition = useSelector((state) => state.app.dialogPosition);
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={dialogPosition}
      position={dialogPosition}
      onStop={(evt, pos) => {
        dispatch(
          setDialogPosition({
            x: pos.lastX,
            y: pos.lastY,
          }),
        );
      }}
    >
      <PaperComponent {...props} ref={nodeRef} />
    </Draggable>
  );
}

const propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.node,
  body: PropTypes.element,
  // footer: PropTypes.element,
  isModal: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
  classes: PropTypes.object,
};

const defaultProps = {
  title: null,
  body: null,
  // footer: null,
  isModal: false,
  className: null,
  onClose: null,
  classes: {},
};

function Dialog(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    body,
    title,
    name,
    isModal,
    className,
    onClose,
    classes: classesProp,
  } = props;
  const [dialogNode, setDialogNode] = useState(null);
  const classes = useStyles({ isModal });
  const closeDialog =
    onClose ||
    (() => {
      dispatch(setDialogVisible());
    });
  const escFunction = (e) =>
    e.which === 27 && (onClose || (() => dispatch(setDialogVisible())));
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isSmallScreen = useMemo(() => {
    return ["xs", "s"].includes(screenWidth);
  }, [screenWidth]);

  useEffect(() => {
    // ComponentDidMount
    document.addEventListener("keydown", escFunction, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const { activeElement } = document;

    if (dialogNode) {
      const dialogFocusables = dialogNode
        ? dialogNode.querySelectorAll('[tabindex="0"]')
        : [];

      if (dialogFocusables.length) {
        // Transform NodeList to array
        const visibleElt = [...dialogFocusables].find((elt) => elt.className);
        // Focus the first focusable element in the popup.
        visibleElt.focus();
      }
    }
    // ComponentWillUnmount
    return () => {
      document.removeEventListener("keydown", escFunction, false);
      // Re focus the element that opened the dialog.
      activeElement.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogNode]);

  // Props for non modal dialog
  let dialogProps = {
    disableEnforceFocus: true,
    hideBackdrop: true,
    maxWidth: false,
    PaperComponent: isSmallScreen
      ? PaperComponent
      : React.memo(DraggablePaperComponent),
    classes: {
      ...classesProp,
      root: `${!isSmallScreen ? classes.rootDesktop : ""}${classesProp.root ? ` ${classesProp.root}` : ""}`,
      scrollPaper: `${classes.scrollPaper}${classesProp.scrollPaper ? ` ${classesProp.scrollPaper}` : ""}`,
      paper: `${classes.paper} ${className || ""} ${
        isSmallScreen ? classes.paperMobile : ""
      }${classesProp.paper ? ` ${classesProp.paper}` : ""}`,
    },
  };

  // Props for modal dialog
  if (isModal) {
    dialogProps = {
      hideBackdrop: false,
      maxWidth: "md",
      PaperComponent,
      classes: {
        ...classesProp,
        scrollPaper: `${classes.scrollPaperModal}${classesProp.scrollPaper ? ` ${classesProp.scrollPaper}` : ""}`,
        paper: `${classes.paperModal} ${className || ""}${classesProp.paper ? ` ${classesProp.paper}` : ""}`,
      },
    };
  }

  return (
    <div>
      <MuiDialog
        ref={(elt) => setDialogNode(elt)}
        onClose={closeDialog}
        disablePortal
        open
        name={name}
        {...dialogProps}
      >
        <DialogTitle
          id="draggable-dialog-title"
          variant="h4"
          style={{ cursor: isModal ? "auto" : "move" }}
        >
          {title}
        </DialogTitle>
        <IconButton
          title={t("Dialog schließen")}
          onClick={closeDialog}
          className={classes.closeBtn}
        >
          <MdClose />
        </IconButton>
        <div
          className={`${classes.dialogBody} ${
            isSmallScreen ? classes.dialogBodyMobile : ""
          }`}
        >
          {body}
        </div>
      </MuiDialog>
    </div>
  );
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
