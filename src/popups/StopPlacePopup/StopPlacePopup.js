import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { useSelector } from 'react-redux';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};
const divv = ([key, value]) => {
  if (value?.de) {
    return (
      <div key={key}>
        <div>
          {key}: {value?.de}
          <br />
        </div>{' '}
        <br />
      </div>
    );
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length) {
      return (
        <div key={key}>
          <fieldset>
            <legend>{key}</legend>
            <br />
            <div>{entries.map(divv)}</div>
          </fieldset>
          <br />
        </div>
      );
    }
  }

  return (
    <div key={key}>
      <div>
        {key}: {value}
      </div>{' '}
      <br />
    </div>
  );
};
const cache = {};

function StopPlacePopup({ feature }) {
  const cartaroUrl = useSelector((state) => state.app.cartaroUrl);
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const uic = useMemo(() => {
    return feature?.get('uic');
  }, [feature]);

  useEffect(() => {
    const abortController = new AbortController();
    setData();

    if (uic && cache[uic]) {
      setData(cache[uic]);
    } else if (uic) {
      const fetchData = () => {
        setLoading(true);
        fetch(`${cartaroUrl}journey_poi/stop_place?id=${uic}`)
          .then((response) => response.json())
          .then((newData) => {
            cache[uic] = newData;
            setData(newData);
          })
          .catch(() => {
            // eslint-disable-next-line no-console
            console.warn(`StopPlacePopup. No data for stations: ${uic}`);
          })
          .finally(() => {
            setLoading(false);
          });
      };
      fetchData();
    }
    return () => {
      abortController.abort();
    };
  }, [cartaroUrl, uic]);

  if (loading) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      {data?.prmInformation
        ? Object.entries(data?.prmInformation || {}).map(divv)
        : `No data for this station`}
    </div>
  );
}

StopPlacePopup.propTypes = propTypes;

const memoized = React.memo(StopPlacePopup);
memoized.renderTitle = (feat) => feat.get('name');

export default memoized;
