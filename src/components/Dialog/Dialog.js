/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Dialog as MuiDialog, DialogTitle, Paper } from "@mui/material";
import Draggable from "react-draggable";
import useHasScreenSize from "../../utils/useHasScreenSize";
import { setDialogVisible, setDialogPosition } from "../../model/app/actions";
import CloseButton from "../CloseButton";

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
    width: 50,
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
  classes: PropTypes.objectOf(PropTypes.string),
};

function Dialog({
  body,
  title,
  name,
  isModal = false,
  className = "",
  onClose,
  classes,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classesProp = classes || {};

  const [dialogNode, setDialogNode] = useState(null);
  const classesDialog = useStyles({ isModal });
  const closeDialog =
    onClose ||
    (() => {
      dispatch(setDialogVisible());
    });
  const escFunction = (e) =>
    e.which === 27 && (onClose || (() => dispatch(setDialogVisible())));
  const isSmallScreen = useHasScreenSize(["xs", "s"]);

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
      root: `${!isSmallScreen ? classesDialog.rootDesktop : ""}${classesProp.root ? ` ${classesProp.root}` : ""}`,
      scrollPaper: `${classesDialog.scrollPaper}${classesProp.scrollPaper ? ` ${classesProp.scrollPaper}` : ""}`,
      paper: `${classesDialog.paper} ${className} ${
        isSmallScreen ? classesDialog.paperMobile : ""
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
        scrollPaper: `${classesDialog.scrollPaperModal}${classesProp.scrollPaper ? ` ${classesProp.scrollPaper}` : ""}`,
        paper: `${classesDialog.paperModal} ${className}${classesProp.paper ? ` ${classesProp.paper}` : ""}`,
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
        <CloseButton
          size="small"
          title={t("Dialog schließen")}
          onClick={closeDialog}
          className={classesDialog.closeBtn}
        />
        <div
          className={`${classesDialog.dialogBody} ${
            isSmallScreen ? classesDialog.dialogBodyMobile : ""
          }`}
        >
          {body}
        </div>
      </MuiDialog>
    </div>
  );
}

Dialog.propTypes = propTypes;

export default Dialog;
