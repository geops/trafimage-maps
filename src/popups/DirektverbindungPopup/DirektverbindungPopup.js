/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Feature from 'ol/Feature';

const useStyles = makeStyles({
  container: {
    padding: 8,
  },
  row: {
    minWidth: 250,
    alignItems: 'center',
    display: 'flex',

    '& img': {
      height: 24,
      width: 24,
      marginRight: 5,
    },
  },
  titleWrapper: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 10,
  },
  fromTo: {
    fontWeight: 'bold',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
  },
  vias: {
    maxHeight: 150,
    overflowY: 'auto',
  },
  card: {
    flex: 1,
    border: '1px solid #ddd',
    padding: 8,
    margin: 8,
    borderRadius: 2,
  },
});

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const DVPopupTitle = ({ feature }) => {
  const classes = useStyles();
  return (
    <div className={classes.titleWrapper}>
      <img
        src={
          feature.get('nachtverbindung')
            ? 'https://icons.app.sbb.ch/kom/locomotive-profile-moon-small.svg'
            : 'https://icons.app.sbb.ch/kom/train-profile-small.svg'
        }
        alt="icon"
        className={classes.titleIcon}
      />
      {feature.get('name')}
    </div>
  );
};

const DirektverbindungPopup = ({ feature }) => {
  const classes = useStyles();
  // console.log(feature.getProperties());
  const {
    start_station_name: start,
    end_station_name: end,
    vias,
  } = feature.getProperties();

  const switchVias = JSON.parse(vias).filter(
    (via) => via.via_type === 'switch' || via.via_type === 'switch_visible',
  );
  // console.log(switchVias);
  return (
    <div className={classes.container}>
      <div className={classes.fromTo}>
        {start}-{end}
      </div>
      {switchVias.length ? (
        <div>{`via: ${switchVias.map((via, idx, array) => {
          return `${via.station_name}${idx + 1 !== array.length ? ',' : null}`;
        })}`}</div>
      ) : null}
    </div>
  );
};

DirektverbindungPopup.renderTitle = (feat) => <DVPopupTitle feature={feat} />;
DirektverbindungPopup.propTypes = propTypes;
export default DirektverbindungPopup;
