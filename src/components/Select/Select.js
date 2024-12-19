import React from "react";
import { makeStyles } from "@mui/styles";
import { Select as MuiSelect } from "@mui/material";
import propTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles(() => {
  const paper = {
    boxSizing: "border-box",
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
      borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    },
    listAnchorTop: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    },
  };
});

/**
 *  This component fits the official design of SBB,
 *  see https://angular.app.sbb.ch/angular/components/select/examples
 */
function Select({ MenuProps, ...props }) {
  const muiMenuProps = MenuProps || {};
  const classes = useStyles();
  const isAnchorTop = muiMenuProps?.anchorOrigin?.vertical === "top";

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
      data-testid=" "
      {...props}
      // // The following props need to be set after {...newProps}, since they overwrite some of them
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        ...muiMenuProps,
        classes: {
          ...classesMenu,
          ...(muiMenuProps?.classes || {}),
        },
      }}
    />
  );
}

Select.propTypes = {
  MenuProps: propTypes.shape({
    classes: propTypes.object,
    anchorOrigin: propTypes.shape({
      vertical: propTypes.oneOf(["top", "bottom"]),
      horizontal: propTypes.oneOf(["left", "right"]),
    }),
  }),
};

export default Select;
