/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  Dialog as MuiDialog,
  DialogTitle,
  Paper,
  Typography,
  IconButton,
} from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import Draggable from 'react-draggable';
import { setDialogVisible, setDialogPosition } from '../../model/app/actions';

const useStyles = makeStyles((theme) => ({
  rootDesktop: {
    zIndex: '0!important',
    pointerEvents: 'none',
  },

  paper: {
    minWidth: 320,
    zIndex: 0,
  },
  paperModal: {
    width: '90%',
    maxHeight: 'calc(100% - 125px)',
  },
  paperMobile: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    width: 'auto',
    zIndex: 1300,
  },

  scrollPaper: {
    display: 'block', // Prevent Dialog from growing in all directions
  },
  scrollPaperModal: {
    display: 'flex', // Prevent Dialog from growing in all directions
  },

  dialogBody: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.htmlFontSize,
    '& a': {
      color: theme.palette.primary.main,
    },
    '& a:hover': {
      color: theme.palette.secondary.main,
    },
    '&>div:first-child': {
      padding: 20,

      '& > *:first-child': {
        marginTop: 0,
      },

      '& > *:last-child': {
        marginBottom: 0,
      },
    },
    overflowY: 'auto',
  },
  dialogBodyDesktop: {
    maxHeight: (props) => (props.isModal ? 620 : 'none'),
  },
  dialogBodyMobile: {
    maxHeight: (props) => (props.isModal ? 360 : 280),
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 44,
  },
  title: {
    cursor: (props) => (props.isModal ? 'auto' : 'move'),
  },
}));

function PaperComponent(props) {
  return <Paper square {...props} elevation={4} />;
}

function DraggablePaperComponent(props) {
  const dispatch = useDispatch();
  const dialogPosition = useSelector((state) => state.app.dialogPosition);
  return (
    <Draggable
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
      <PaperComponent {...props} />
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
};

const defaultProps = {
  title: null,
  body: null,
  // footer: null,
  isModal: false,
  className: null,
};

function Dialog(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { body, title, name, isModal, className } = props;
  const [dialogNode, setDialogNode] = useState(null);
  const classes = useStyles({ isModal });
  const closeDialog = () => dispatch(setDialogVisible());
  const escFunction = (e) => e.which === 27 && dispatch(setDialogVisible());
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isSmallScreen = useMemo(() => {
    return ['xs', 's'].includes(screenWidth);
  }, [screenWidth]);

  useEffect(() => {
    // ComponentDidMount
    document.addEventListener('keydown', escFunction, false);
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
      document.removeEventListener('keydown', escFunction, false);
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
    PaperComponent: isSmallScreen ? PaperComponent : DraggablePaperComponent,
    classes: {
      root: !isSmallScreen ? classes.rootDesktop : '',
      scrollPaper: classes.scrollPaper,
      paper: `${classes.paper} ${className || ''} ${
        isSmallScreen ? classes.paperMobile : ''
      }`,
    },
  };

  // Props for modal dialog
  if (isModal) {
    dialogProps = {
      hideBackdrop: false,
      maxWidth: 'md',
      PaperComponent,
      classes: {
        scrollPaper: classes.scrollPaperModal,
        paper: `${classes.paperModal} ${className || ''}`,
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
          disableTypography
          className={classes.title}
        >
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
          <IconButton
            title={t('Dialog schließen')}
            onClick={closeDialog}
            className={classes.closeBtn}
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <div
          className={`${classes.dialogBody} ${
            isSmallScreen ? classes.dialogBodyMobile : ''
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
