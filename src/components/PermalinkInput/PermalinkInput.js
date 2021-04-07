import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import UIPermalinkInput from '@geops/react-ui/components/PermalinkInput';

const useStyles = makeStyles(() => ({
  input: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: 'calc(100% - 4px)',
    height: 30,
    border: '1px solid lightgray',
    backgroundColor: 'white',

    '& input,    & button,    & svg': {
      border: 'none',
    },

    '& input': {
      flexGrow: 2,
      textOverflow: 'ellipsis',
      minWidth: 0,
      paddingLeft: 5,

      '&::-ms-clear': {
        display: 'none',
      },
    },

    "& div[role='button']": {
      width: 30,
      height: '100%',
      flexShrink: 0,
      borderLeft: '1px solid lightgray',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
}));

function PermalinkInput(props) {
  const classes = useStyles();

  return (
    <UIPermalinkInput
      className={classes.input}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

export default memo(PermalinkInput);
