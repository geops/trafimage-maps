import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import MapButton from '../../../components/MapButton';
import { setFeatureInfo } from '../../../model/app/actions';
import { IPV_TOPIC_KEY } from '../../../utils/constants';
import { ReactComponent as List } from '../../../img/list-icon-sbb.svg';

const IpvListButton = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const layers = useSelector((state) => state.map.layers);
  const map = useSelector((state) => state.app.map);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const ipvMainLayer = useMemo(
    () => layers.find((l) => l.key === IPV_TOPIC_KEY),
    [layers],
  );
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const loadFeatsListener = ipvMainLayer.on('load:features', (evt) => {
      setFeatures(evt.features);
    });
    return () => {
      unByKey(loadFeatsListener);
    };
  }, [ipvMainLayer, map]);

  return (
    <MapButton
      title={t('Alle Direktverbindungen anzeigen')}
      disabled={!features?.length}
      style={{ padding: 8 }}
      onClick={() => {
        if (!features?.length) return;
        dispatch(
          setFeatureInfo(
            !featureInfo?.length || featureInfo[0]?.features !== features
              ? [
                  {
                    features,
                    layer: ipvMainLayer,
                  },
                ]
              : [],
          ),
        );
      }}
    >
      <List />
    </MapButton>
  );
};

IpvListButton.propTypes = {};

export default IpvListButton;
