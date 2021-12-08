/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
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

import './Dialog.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: (props) => (props.isModal ? 1300 : '0 !important'),
    pointerEvents: (props) => (props.isModal ? 'auto' : 'none'),
  },
  scrollPaper: {
    display: (props) => (props.isModal ? 'flex' : 'block'), // Prevent Dialog from growing in all directions
  },
  dialogBody: {
    padding: 20,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.htmlFontSize,
    '& a': {
      color: theme.palette.primary.main,
    },
    '& a:hover': {
      color: theme.palette.secondary.main,
    },
  },
  bold: {
    fontWeight: 'bold',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
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
      <Paper square {...props} elevation={4} />
    </Draggable>
  );
}

const propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.element,
  body: PropTypes.element,
  // footer: PropTypes.element,
  isModal: PropTypes.bool,
};

const defaultProps = {
  title: null,
  body: null,
  // footer: null,
  isModal: false,
};

function Dialog(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { body, title, name, isModal } = props;
  const classes = useStyles({ isModal });
  const closeDialog = () => dispatch(setDialogVisible());

  const dialogRef = useRef(null);
  const escFunction = (e) => e.which === 27 && dispatch(setDialogVisible());

  useEffect(() => {
    // ComponentDidMount
    document.addEventListener('keydown', escFunction, false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const { activeElement } = document;
    const dialogFocusables = dialogRef?.current?.ref.current
      ? dialogRef.current.ref.current.querySelectorAll('[tabindex="0"]')
      : [];

    if (dialogFocusables.length) {
      // Focus the first focusable element in the popup.
      dialogFocusables[0].focus();
    }
    // ComponentWillUnmount
    return () => {
      document.removeEventListener('keydown', escFunction, false);
      // Re focus the element that opened the dialog.
      activeElement.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogRef]);

  return (
    <div className="wkp-dialog" aria-labelledby="draggable-dialog-title">
      <MuiDialog
        onClose={closeDialog}
        open
        PaperComponent={isModal ? PaperComponent : DraggablePaperComponent}
        hideBackdrop={!isModal}
        maxWidth="xs"
        classes={{ root: classes.root, scrollPaper: classes.scrollPaper }}
        // {...props}
        name={name}
      >
        <DialogTitle
          disableTypography
          id="draggable-dialog-title"
          className={classes.title}
        >
          <Typography className={classes.bold}>{title}</Typography>
          <IconButton
            title={t('Dialog schließen')}
            onClick={closeDialog}
            className={classes.closeBtn}
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <div ref={dialogRef} className={classes.dialogBody}>
          {body}
        </div>
      </MuiDialog>
    </div>
  );
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
