import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaTrash, FaInfoCircle } from 'react-icons/fa';
import { Grid, Typography, IconButton, makeStyles } from '@material-ui/core';
import { setDialogVisible } from '../../model/app/actions';
import DrawButton from '../DrawButton';
import { NAME } from '../DrawRemoveDialog';
import DrawPermalinkButton from '../DrawPermalinkButton';

const useStyles = makeStyles(() => ({
  root: {
    padding: '15px 15px',
  },
  buttons: {
    display: 'flex',
    marginBottom: 15,

    '& > a:first-child': {
      paddingLeft: 0,
    },
    '& .MuiIconButton-root ': {
      height: 20,
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  caption: {
    display: 'flex',
    alignItems: 'start',
  },
  infoIcon: {
    marginRight: 10,
    flexShrink: 0,
    paddingTop: 3,
  },
}));

function Draw() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const drawIds = useSelector((state) => state.app.drawIds);
  const onRemoveClick = useCallback(() => {
    dispatch(setDialogVisible(NAME));
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} className={classes.buttons}>
          <DrawButton disabled={!!drawIds} />
          <DrawButton disabled={!drawIds} />
          <IconButton
            title={t('Open confirmation dialog to delete draw')}
            onClick={onRemoveClick}
            disabled={!drawIds}
          >
            <FaTrash />
          </IconButton>
          <DrawPermalinkButton
            buttonProps={{
              title: t('Draw permalink generieren'),
              disabled: !drawIds,
            }}
          />
        </Grid>
        <Grid item xs={12} alignItems="center">
          <Typography variant="subtitle1" className={classes.caption}>
            <FaInfoCircle
              focusable={false}
              fontSize="small"
              className={classes.infoIcon}
            />
            <span>
              {t(
                'Ihre Zeichnung wird ein Jahr lang gespeichert. Bitte speichernSie vor dem verlassen der Seite den Link zum Bearbeiten der Zeichnung.',
              )}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
export default React.memo(Draw);
