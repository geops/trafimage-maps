import React from 'react';
import { Select as MuiSelect, makeStyles } from '@material-ui/core';
import propTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => {
  const list = {
    // Should be apply by theme but it's not
    '& .Mui-selected': {
      color: theme.palette.secondary.main,
    },
  };
  const paper = {
    boxSizing: 'border-box',
    borderRadius: 0,
    marginTop: -2,
  };
  return {
    paperAnchorBottom: {
      borderTop: 0,
      marginTop: -2,
      ...paper,
    },
    paperAnchorTop: {
      borderBottom: 0,
      ...paper,
    },
    listAnchorBottom: {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      ...list,
    },
    listAnchorTop: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      ...list,
    },
  };
});

/**
 *  This component fits the official design of SBB,
 *  see https://angular.app.sbb.ch/angular/components/select/examples
 */
const Select = (props) => {
  const { MenuProps } = props;
  const classes = useStyles();
  const isAnchorTop = MenuProps?.anchorOrigin?.vertical === 'top';

  let classesMenu = {
    paper: classes.paperAnchorBottom,
    list: classes.listAnchorBottom,
  };

  if (isAnchorTop) {
    classesMenu = {
      paper: classes.paperAnchorTop,
      list: classes.listAnchorTop,
    };
  }

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
  MenuProps: propTypes.shape({
    classes: propTypes.object,
    anchorOrigin: propTypes.shape({
      vertical: propTypes.oneOf(['top', 'bottom']),
      horizontal: propTypes.oneOf(['left', 'right']),
    }),
  }),
};

Select.defaultProps = {
  MenuProps: {},
};

export default Select;
