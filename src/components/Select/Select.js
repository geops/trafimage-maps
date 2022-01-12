import React, { useRef } from 'react';
import { Select as MuiSelect, makeStyles } from '@material-ui/core';
import propTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => {
  return {
    outlineHidden: {
      '&:hover': {
        color: theme.palette.secondary.dark,
      },
      '&:hover .MuiOutlinedInput-notchedOutline,& .MuiOutlinedInput-notchedOutline':
        {
          borderWidth: 0,
        },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        outline: 'none',
        borderWidth: 1,
      },
    },
  };
});

const borderWidth = 1;

const Select = (props) => {
  const { hideOutline, className } = props;
  const classes = useStyles();
  const ref = useRef();
  const selectClasses = `${className || ''}${
    hideOutline ? ` ${classes.outlineHidden}` : ''
  }`;

  return (
    <MuiSelect
      variant="outlined"
      ref={ref}
      IconComponent={ExpandMoreIcon}
      MenuProps={{
        onEnter: (el) => {
          /**
           * The MUI width calculation fails because of the border.
           * The element is always 2 x borderWidth too wide.
           * With this hack I reduce the width to make it fit.
           * @ignore
           */
          const menuEl = el;
          menuEl.style.minWidth = `${
            ref.current.clientWidth - borderWidth * 2
          }px`;
        },
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
        },
        PaperProps: {
          style: {
            marginRight: 2,
            border: `${borderWidth}px solid #888`,
            borderTop: '1px solid rgba(0, 0, 0, 0.30)',
            borderRadius: '0 0 2px 2px',
            marginTop: -3,
          },
        },
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={selectClasses}
    />
  );
};

Select.propTypes = {
  hideOutline: propTypes.bool,
  className: propTypes.string,
};

Select.defaultProps = {
  hideOutline: false,
  className: undefined,
};

export default Select;
