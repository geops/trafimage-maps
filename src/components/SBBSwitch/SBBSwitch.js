import React from 'react';
import { withStyles, Switch } from '@material-ui/core';

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 38,
    height: '100%',
    padding: 0,
    margin: '4px 10px 4px 0',
    overflow: 'visible',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
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
    width: 18,
    height: 18,
    boxShadow:
      '0 1px 1px 0 rgb(0 0 0 / 7%), 0 0 1px 1px rgb(0 0 0 / 11%), 0 4px 2px 0 rgb(0 0 0 / 10%), 0 4px 9px 2px rgb(0 0 0 / 8%)',
  },
  track: {
    height: 20,
    borderRadius: 25,
    border: `1px solid #e5e5e5`,
    opacity: 1,
    backgroundColor: 'white',
  },
  checked: {},
}))(Switch);

function SBBSwitch(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <StyledSwitch {...props} />;
}

export default SBBSwitch;
