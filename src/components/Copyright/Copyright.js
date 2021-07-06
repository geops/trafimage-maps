import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RsCopyright from 'react-spatial/components/Copyright';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    right: 5,
    paddingLeft: 5,
    fontSize: 12,
    bottom: (props) => (props.footer ? 42 : 2),
    '& a:not(.MuiIconButton-root)': {
      whiteSpace: 'nowrap',
      textDecoration: 'none !important',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 11,
      right: 'unset',
    },
  },
}));

function Copyright() {
  const { t } = useTranslation();
  const topic = useSelector((state) => state.app.activeTopic);
  const map = useSelector((state) => state.app.map);
  const classes = useStyles({ footer: topic.elements.footer });

  return (
    <div className={`wkp-copyright ${classes.wrapper}`}>
      <RsCopyright
        map={map}
        format={(f) => `${t('Geodaten')} ${f.join(', ')}`}
      />
    </div>
  );
}

export default Copyright;
