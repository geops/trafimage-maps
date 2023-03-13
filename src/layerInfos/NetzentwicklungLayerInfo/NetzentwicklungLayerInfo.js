import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const regionColors = {
  Ost: '#2F9F48',
  Süd: '#DC320A',
  West: '#FFCC00',
  Mitte: '#A083C7',
};

const useStyles = makeStyles({
  regionLegendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  regionColor: {
    width: 30,
    height: 20,
    margin: 5,
    marginLeft: 0,
    border: '1px solid #767676',
  },
});

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
};

function NetzentwicklungLayerInfo({ t, properties }) {
  const netzentwicklungRoleType = properties.get('netzentwicklungRoleType');
  const cartaroUrl = useSelector((state) => state.app.cartaroUrl);
  const [regions, setRegions] = useState();
  const classes = useStyles();

  useEffect(() => {
    fetch(`${cartaroUrl}netzentwicklung/region/items/`)
      .then((res) => res.json())
      .then((res) => setRegions(res));
  }, [cartaroUrl]);

  return (
    <div>
      <p>{t(`${netzentwicklungRoleType}-layer-info`)}</p>
      {regions &&
        Array.isArray(regions) &&
        regions.map((region) => (
          <div className={classes.regionLegendItem} key={region.id}>
            <div
              className={classes.regionColor}
              style={{ backgroundColor: regionColors[region.name] }}
            />
            <div>{t(region.name)}</div>
          </div>
        ))}
    </div>
  );
}

NetzentwicklungLayerInfo.propTypes = propTypes;
export default NetzentwicklungLayerInfo;
