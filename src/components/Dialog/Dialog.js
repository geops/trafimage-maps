import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import RSDialog from 'react-spatial/components/Dialog';
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
  const dispatch = useDispatch();
  const { body, isModal } = props;

  const escFunction = () => {
    dispatch(setDialogVisible());
  };

  const registerEsc = isRegister => {
    if (isRegister) {
      document.addEventListener('keydown', escFunction, false);
    } else {
      document.removeEventListener('keydown', escFunction, false);
    }
  };

  useEffect(() => {
    // ComponentDidMount
    registerEsc(true);
    // ComponentWillUnmount
    return () => {
      registerEsc(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wkp-dialog">
      <RSDialog
        isOpen
        position={dialogPosition}
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
      </RSDialog>
    </div>
  );
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
