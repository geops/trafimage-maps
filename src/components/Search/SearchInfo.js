/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import {
  makeStyles,
  IconButton,
  Popper,
  Paper,
  Fade,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  Typography,
} from '@material-ui/core';
import { ReactComponent as QuestionIcon } from '../../img/circleQuestionMark.svg';
import { setSearchInfoOpen } from '../../model/app/actions';

const useStyles = makeStyles((theme) => {
  return {
    searchInfoOuterWrapper: {
      position: 'absolute',
      right: 2,
      top: 0,
      height: 48,
      width: 48,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    searchInfoInnerWrapper: {
      position: 'relative',
    },
    searchInfoBtn: {
      padding: 10,
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
    popupHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 10,
    },
    closeBtn: {
      zIndex: 1500,
      padding: '4px 8px',
    },
    searchInfoBox: {
      zIndex: 1500,
      left: '10px !important',
      width: '32vw',
      maxWidth: (props) => (props.screenWidth !== 'xl' ? 258 : 420),
    },
    searchInfoContent: {
      padding: '5px 0',
      position: 'relative',
      maxHeight: '90vh',
      '&::before': {
        content: '""',
        height: 0,
        width: 0,
        top: 13,
        left: -18,
        position: 'absolute',
        border: '10px solid transparent',
        borderRight: '8px solid white',
        filter: 'drop-shadow(-8px 2px 5px rgba(130,130,130,1))',
      },
    },
    searchInfoList: {
      maxHeight: '50vh',
      padding: '0 10px',
      overflow: 'auto',
    },
  };
});

const propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
};

const defaultProps = {
  anchorEl: null,
};

function SearchInfo({ anchorEl }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const classes = useStyles({ screenWidth });
  const searchOpen = useSelector((state) => state.app.searchOpen);
  const searchInfoOpen = useSelector((state) => state.app.searchInfoOpen);

  const togglePopup = useCallback(() => {
    dispatch(setSearchInfoOpen(!searchInfoOpen));
  }, [dispatch, searchInfoOpen]);

  useEffect(() => {
    // Ensure the popup is always closed on mount
    if (screenWidth !== 'xl' && !searchOpen) {
      dispatch(setSearchInfoOpen(false));
    }
  }, [searchOpen, screenWidth, dispatch]);

  if (['s', 'xs'].includes(screenWidth)) {
    return null;
  }

  return (
    <div className={classes.searchInfoOuterWrapper}>
      <div className={classes.searchInfoInnerWrapper}>
        <IconButton className={classes.searchInfoBtn} onClick={togglePopup}>
          <QuestionIcon />
        </IconButton>
        {anchorEl && (
          <Popper
            open={searchInfoOpen}
            anchorEl={anchorEl}
            transition
            placement="right-start"
            className={classes.searchInfoBox}
          >
            {({ TransitionProps }) => (
              <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={() => dispatch(setSearchInfoOpen(false))}
              >
                <Fade
                  {...TransitionProps}
                  timeout={searchOpen || screenWidth === 'xl' ? 350 : 0}
                >
                  <Paper
                    square
                    elevation={4}
                    className={classes.searchInfoContent}
                  >
                    <div className={classes.popupHeader}>
                      <Typography>
                        <b>{t('Suche')}</b>
                      </Typography>
                      <IconButton
                        title={t('Schliessen')}
                        onClick={togglePopup}
                        className={classes.closeBtn}
                      >
                        <MdClose />
                      </IconButton>
                    </div>
                    <List
                      dense
                      disablePadding
                      className={classes.searchInfoList}
                    >
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Stationen')}</b>:{' '}
                              {t('Eingabe offizieller Stationsname')}
                            </span>
                          }
                          secondary={t(
                            'z.B. "Bern Europlatz" für Bahnstation oder "Bern Europaplatz, Bahnhof" für Bus-/Tramstation',
                          )}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Gemeinden')}</b>:{' '}
                              {t('Eingabe Gemeindenamen')}
                            </span>
                          }
                          secondary={t('z.B. "Eriz", "Mesocco"')}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Orte')}</b>:{' '}
                              {t(
                                'Suche nach Ortsnamen, Pässen, Bergen, Gewässern usw. aus den Landeskarten',
                              )}
                            </span>
                          }
                          secondary={t(
                            'z.B. "Le Chasseron", "Passo del San Bernardino", "Louwibach"',
                          )}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Adressen')}</b>:{' '}
                              {t('Eingabe einer Adresse')}
                            </span>
                          }
                          secondary={t('z.B. "Trüsselstrasse 2 3014 Bern"')}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Betriebspunkte')}</b>:{' '}
                              {t(
                                'Suche nach Betriebspunkten auf dem Streckennetz oder nach Betriebspunkt-Abkürzungen',
                              )}
                            </span>
                          }
                          secondary={t('z.B. "Aespli" oder "AESP"')}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Linien')}</b>:{' '}
                              {t('Eingabe einer Liniennummer')}
                            </span>
                          }
                          secondary={t('z.B. "210"')}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Kilometerpunkt auf Linie')}</b>:{' '}
                              {t(
                                'Suche nach einem Streckenkilometer auf einer Linie durch Eingabe der Liniennummer und des Streckenkilometers',
                              )}
                            </span>
                          }
                          secondary={t('z.B. "210 +35.74"')}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <span>
                              <b>{t('Liniensegment')}</b>:{' '}
                              {t(
                                'Suche nach einem Streckensegement durch Eingabe der Liniennummer und Kilometer von - Kilometer bis',
                              )}
                            </span>
                          }
                          secondary={t('z.B. "210 29.5-35.7"')}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        )}
      </div>
    </div>
  );
}

SearchInfo.propTypes = propTypes;
SearchInfo.defaultProps = defaultProps;

export default SearchInfo;
