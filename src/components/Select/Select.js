import React from 'react';
import { Select as MuiSelect, makeStyles } from '@material-ui/core';
import propTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const borderWidth = 2;

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      boxSizing: 'border-box',
      border: `${borderWidth}px solid ${theme.palette.text.secondary}`,
      borderTop: 0,
      borderRadius: 0,
      marginTop: -2,
    },
    list: {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      color: theme.palette.text.secondary,

      '& .MuiMenuItem-root:not(.Mui-selected)': {
        color: 'inherit',
      },
    },
  };
});

/**
 *  This component fits the official design of SBB,
 *  see https://angular.app.sbb.ch/angular/components/select/examples
 */
const Select = (props) => {
  const { MenuProps } = props;
  const classesMenu = useStyles();

  return (
    <MuiSelect
      variant="outlined"
      IconComponent={ExpandMoreIcon}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      // The following props need to be set after {...newProps}, since they overwrite some of them
      MenuProps={{
        getContentAnchorEl: () => null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        ...MenuProps,
        classes: {
          ...classesMenu,
          ...(MenuProps?.classes || {}),
        },
      }}
    />
  );
};

Select.propTypes = {
  MenuProps: propTypes.object,
};

Select.defaultProps = {
  MenuProps: {},
};

export default Select;
