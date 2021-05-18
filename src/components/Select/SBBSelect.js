import React, { useRef } from 'react';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const borderWidth = 2;

const useStyles = makeStyles({
  root: {
    borderRadius: 2,
  },
  outlined: {
    paddingTop: 15,
    paddingBottom: 15,
  },
});

const SBBSelect = (props) => {
  const classes = useStyles();
  const ref = useRef();
  return (
    <Select
      className={classes.root}
      classes={classes}
      variant="outlined"
      ref={ref}
      IconComponent={ExpandMoreIcon}
      MenuProps={{
        onEnter: (el) => {
          /**
           * The MUI width calculation fails because of the border.
           * The element is always 2 x borderWidth too wide.
           * With this hack I reduce the width to make it fit.
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
            marginRigth: 2,
            border: `${borderWidth}px solid #888`,
            borderTop: '1px solid rgba(0, 0, 0, 0.30)',
            borderRadius: '0 0 2px 2px',
            marginTop: -3,
          },
        },
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default SBBSelect;
