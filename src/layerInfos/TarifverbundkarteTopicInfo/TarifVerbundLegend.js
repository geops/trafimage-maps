import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import TarifverbundPartner from '../../components/TarifverbundPartner';

const useStyles = makeStyles(() => {
  return {
    legend: {
      display: 'grid',
      gridTemplateColumns: (props) =>
        props.isMobile ? '1fr 1fr' : '200px 200px',
      gap: 5,
    },
  };
});

const useFetchVerbunde = (vectorTilesUrl) => {
  const [verbunde, setVerbunde] = useState([]);
  useEffect(() => {
    fetch(`${vectorTilesUrl}/styles/ch.sbb.tarifverbund/style.json`)
      .then((response) => response.json())
      .then((data) => setVerbunde(data.metadata.partners))
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [verbunde];
};

function TarifVerbundLegend() {
  const vectorTilesUrl = useSelector((state) => state.app.vectorTilesUrl);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile });

  const [verbunde] = useFetchVerbunde(vectorTilesUrl);
  return (
    <div>
      {verbunde.length ? (
        <div className={classes.legend}>
          {verbunde.map((v) => (
            <TarifverbundPartner
              color={`#${v.verbund_colour_hex}`}
              label={v.name}
            />
          ))}
          <TarifverbundPartner
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 2px, #bd9189 2px, #bd9189 4px)',
            }}
            label="Z-Pass"
          />
        </div>
      ) : null}
    </div>
  );
}

export default TarifVerbundLegend;
