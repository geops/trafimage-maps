import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, IconButton } from '@material-ui/core';
import { ReactComponent as QuestionIcon } from '../../img/circleQuestionMark.svg';

const useStyles = makeStyles(() => {
  return {
    searchInfoBtn: {
      right: 0,
      top: 5,
    },
  };
});

function SearchInfoButton() {
  const classes = useStyles();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  if (['s', 'xs'].includes(screenWidth)) {
    return null;
  }

  return (
    <IconButton className={classes.searchInfoBtn}>
      <QuestionIcon />
    </IconButton>
  );
}

export default SearchInfoButton;
