import React, { useRef, useMemo } from 'react';
import { Select as MuiSelect, makeStyles } from '@material-ui/core';
import deepmerge from 'deepmerge';
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
  const { hideOutline, className, MenuProps } = props;
  const classes = useStyles();
  const ref = useRef();
  const selectClasses = `${className || ''}${
    hideOutline ? ` ${classes.outlineHidden}` : ''
  }`;

  const menuProps = useMemo(() => {
    /**
     * We deep merge the default MenuProps that are always applied with the
     * MenuProps injected in the local Select component
     */
    return deepmerge(
      {
        TransitionProps: {
          onEnter: (el) => {
            /**
             * Dynamic width calculation por dropdown.
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
        },
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        PaperProps: {
          style: {
            marginRight: 2,
            border: `${borderWidth}px solid #888`,
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 0,
            marginTop: -3,
          },
        },
      },
      MenuProps,
    );
  }, [ref, MenuProps]);

  const newProps = { ...props };
  delete newProps.hideOutline;

  return (
    <MuiSelect
      variant="outlined"
      ref={ref}
      IconComponent={ExpandMoreIcon}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...newProps}
      // The following props need to be set after {...newProps}, since they overwrite some of them
      MenuProps={menuProps}
      className={selectClasses}
    />
  );
};

Select.propTypes = {
  hideOutline: propTypes.bool,
  className: propTypes.string,
  MenuProps: propTypes.object,
};

Select.defaultProps = {
  hideOutline: false,
  className: undefined,
  MenuProps: {},
};

export default Select;
