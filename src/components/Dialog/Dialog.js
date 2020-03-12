import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import UIDialog from '@geops/react-ui/components/Dialog';
import { setDialogVisible } from '../../model/app/actions';

import './Dialog.scss';

const propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.element,
  body: PropTypes.element,
  footer: PropTypes.element,
  isModal: PropTypes.bool,
};

const defaultProps = {
  title: null,
  body: null,
  footer: null,
  isModal: false,
};

function Dialog(props) {
  const dialogPosition = useSelector(state => state.app.dialogPosition);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { body, isModal } = props;

  const dialogRef = useRef(null);
  const escFunction = e => e.which === 27 && dispatch(setDialogVisible());

  useEffect(() => {
    // ComponentDidMount
    document.addEventListener('keydown', escFunction, false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const { activeElement } = document;
    const dialogFocusables = dialogRef.current.ref.current
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
  }, []);

  return (
    <div className="wkp-dialog">
      <UIDialog
        isOpen
        ref={dialogRef}
        position={dialogPosition}
        closeButtonAriaLabel={t('Dialog schließen')}
        onClose={() => {
          dispatch(setDialogVisible());
        }}
        onClickOutside={() => {
          if (isModal) {
            dispatch(setDialogVisible());
          }
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {body}
      </UIDialog>
    </div>
  );
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
