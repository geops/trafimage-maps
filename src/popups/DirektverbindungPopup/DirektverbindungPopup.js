import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Feature from 'ol/Feature';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';

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
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
  },
  vias: {
    maxHeight: 200,
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
  layer: PropTypes.instanceOf(MapboxStyleLayer).isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

// const renderTitle = (feat, t) => {
//   return ''itle';
// };

const DirektverbindungPopup = ({ feature, layer, t }) => {
  const classes = useStyles();
  console.log(feature.getProperties());
  const {
    start_station_name: start,
    end_station_name: end,
    vias,
  } = feature.getProperties();
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        {start} --> {end}
      </div>
      <br />
      <div>Via:</div>
      <br />
      <div className={classes.vias}>
        {JSON.parse(vias).map(({ station_name: via }) => {
          return <div>{via} </div>;
        })}
      </div>
    </div>
  );
};

// DirektverbindungPopup.renderTitle = (feat, t) => renderTitle(feat, t);
DirektverbindungPopup.propTypes = propTypes;
export default DirektverbindungPopup;
