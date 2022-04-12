/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
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
} from '@material-ui/core';
import { ReactComponent as QuestionIcon } from '../../img/circleQuestionMark.svg';

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
    closeBtn: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1500,
      padding: 8,
    },
    searchInfoBox: {
      zIndex: 1500,
      left: '10px !important',
      width: '32vw',
      maxWidth: (props) => (props.screenWidth === 'xl' ? 'none' : 262),
    },
    searchInfoContent: {
      padding: '5px 10px',
      position: 'relative',
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
  };
});

const propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
};

const defaultProps = {
  anchorEl: null,
};

function SearchInfo({ anchorEl }) {
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const classes = useStyles({ screenWidth });
  const searchOpen = useSelector((state) => state.app.searchOpen);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Ensure the popup is always closed on mount
    if (screenWidth !== 'xl' && !searchOpen) {
      setOpen(false);
    }
  }, [searchOpen, screenWidth]);

  if (['s', 'xs'].includes(screenWidth)) {
    return null;
  }

  return (
    <div className={classes.searchInfoOuterWrapper}>
      <div className={classes.searchInfoInnerWrapper}>
        <IconButton
          className={classes.searchInfoBtn}
          onClick={() => setOpen(!open)}
        >
          <QuestionIcon />
        </IconButton>
        {anchorEl && (
          <Popper
            // disablePortal
            open={open}
            anchorEl={anchorEl}
            transition
            placement="right-start"
            className={classes.searchInfoBox}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper
                  square
                  elevation={4}
                  className={classes.searchInfoContent}
                >
                  <IconButton
                    title={t('Schliessen')}
                    onClick={() => setOpen(false)}
                    className={classes.closeBtn}
                  >
                    <MdClose />
                  </IconButton>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemText
                        primary={
                          <span>
                            <b>{t('Stationen')}</b>:{' '}
                            {t('Eingabe offizieller Stationsname')}
                          </span>
                        }
                        secondary={t(
                          'z.B. "Bern Europlatz" für Bahnstation oder "Bern Europaplatz, Bahnhof" für Bus-/Tramstation)',
                        )}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemText
                        primary={
                          <span>
                            <b>{t('Gemeinden')}</b>:{' '}
                            {t('Eingabe offizieller Stationsname')}
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
                              'Suche nach Ortsnamen, Pässen, Berge, Gewässer usw.  aus den Landeskarten',
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
                            <b>{t('Adressen')}</b>: {t('Eingabe einer Adresse')}
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
