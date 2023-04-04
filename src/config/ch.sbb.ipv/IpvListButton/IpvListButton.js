import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import { extend, createEmpty } from 'ol/extent';
import MapButton from '../../../components/MapButton';
import { setFeatureInfo } from '../../../model/app/actions';
import { IPV_TOPIC_KEY } from '../../../utils/constants';
import { ReactComponent as List } from '../../../img/list-icon-sbb.svg';

const getExtentFromFeatures = (features) => {
  let extent = createEmpty();
  features.forEach((feat) => {
    extent = extend(extent, feat.getGeometry().getExtent());
  });
  return extent;
};

const IpvListButton = ({ ...props }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const layers = useSelector((state) => state.map.layers);
  const map = useSelector((state) => state.app.map);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const ipvMainLayer = useMemo(
    () => layers.find((l) => l.key === `${IPV_TOPIC_KEY}.main`),
    [layers],
  );
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const loadFeatsListener = ipvMainLayer?.on('load:features', (evt) => {
      setFeatures(evt.features);
    });
    return () => unByKey(loadFeatsListener);
  }, [ipvMainLayer, map, featureInfo, dispatch, features]);

  return (
    <MapButton
      title={t('Alle Direktverbindungen anzeigen')}
      disabled={!features?.length}
      data-testid="ipv-list-button"
      onClick={() => {
        if (!features?.length) return;
        const view = map.getView();
        const extent = getExtentFromFeatures(features);
        view.cancelAnimations();
        view.fit(extent, {
          duration: 500,
          padding: [100, 100, 100, 100],
          maxZoom: 6,
          callback: () => {
            const { mbMap } = ipvMainLayer.mapboxLayer;
            if (mbMap) {
              mbMap.once('idle', () => {
                dispatch(
                  setFeatureInfo([
                    {
                      features: ipvMainLayer.syncFeatures(),
                      layer: ipvMainLayer,
                    },
                  ]),
                );
              });
            }
          },
        });
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <List />
    </MapButton>
  );
};

IpvListButton.propTypes = {};

export default IpvListButton;