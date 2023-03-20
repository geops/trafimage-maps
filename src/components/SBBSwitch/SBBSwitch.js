import React from 'react';
import { withStyles, Switch } from '@material-ui/core';

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 44,
    height: '100%',
    padding: 0,
    margin: '4px 10px 4px 0',
    overflow: 'visible',
  },
  switchBase: {
    padding: 3,
    color: 'white',
    '&$checked': {
      transform: 'translateX(16px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: '#eb0000',
      },
    },
  },
  thumb: {
    width: 22,
    height: 22,
    boxShadow:
      '0 1px 1px 0 rgb(0 0 0 / 7%), 0 0 1px 1px rgb(0 0 0 / 11%), 0 4px 2px 0 rgb(0 0 0 / 10%), 0 4px 9px 2px rgb(0 0 0 / 8%)',
  },
  track: {
    height: 26,
    borderRadius: 26,
    border: `1px solid #e5e5e5`,
    opacity: 1,
    backgroundColor: theme.palette.grey[500],
  },
  checked: {},
}))(Switch);

function SBBSwitch(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <StyledSwitch {...props} />;
}

export default SBBSwitch;
