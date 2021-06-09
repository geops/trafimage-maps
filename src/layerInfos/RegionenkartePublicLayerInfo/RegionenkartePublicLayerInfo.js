import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import grun from './grun.png';
import gelb from './gelb.png';
import lila from './lila.png';
import rot from './rot.png';

const title = {
  de: 'Regionenkarte I-VU-UEW',
  fr: 'Cartes régionales I-VU-UEW',
  en: 'Regional map I-VU-UEW',
  it: 'Cartina della regione I-VU-UEW',
};

const description = {
  de: (
    <>
      Örtliche Ansprechpartner für Arbeitsstellensicherheit auf Baustellen
      Dritter im Gefahrenbereich der Bahninfrastruktur.
    </>
  ),
  fr: (
    <>
      Partenaire local pour la securité des chantiers sur des chantiers de tiers
      dans la zone de danger de l’infrastructure ferroviaire.
    </>
  ),
  en: (
    <>
      Local contacts for occuppational safety on third-party construction sites
      in the hazardous area of railway infrastructure.
    </>
  ),
  it: (
    <>
      Interlocutori in loco per la sicurezza sulle aree dei lavori presso
      cantieri di terzi ubicati nella zona di pericolo dell’infrastruttura
      ferroviaria.
    </>
  ),
};

const useStyles = makeStyles((theme) => ({
  legend: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    '& img': {
      marginRight: theme.spacing(1),
    },
  },
}));

const RegionenkartePublicLayerInfo = ({ language }) => {
  const classes = useStyles();
  return (
    <div>
      <div>{title[language]}</div>
      <div className={classes.legend}>
        <div>
          <img src={grun} alt="grun" />
          Region Ost
        </div>
        <div>
          <img src={rot} alt="rot" />
          Region Süd
        </div>
        <div>
          <img src={lila} alt="lila" />
          Region Mitte
        </div>
        <div>
          <img src={gelb} alt="gelb" />
          Region West
        </div>
      </div>
      {description[language]}
    </div>
  );
};

RegionenkartePublicLayerInfo.propTypes = {
  language: PropTypes.string.isRequired,
};

export default React.memo(RegionenkartePublicLayerInfo);
