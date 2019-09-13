import React from 'react';
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
  return (
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
  );
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
