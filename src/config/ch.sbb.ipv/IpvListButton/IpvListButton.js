import React from 'react';
import ListIcon from '@material-ui/icons/List';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MapButton from '../../../components/MapButton';
import { setFeatureInfo } from '../../../model/app/actions';
import { IPV_TOPIC_KEY } from '../../../utils/constants';

const IpvListButton = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const layers = useSelector((state) => state.map.layers);
  const ipvMainLayer = layers.find((l) => l.key === IPV_TOPIC_KEY);
  return (
    <MapButton
      title={t('Alle Direktverbindungen anzeigen')}
      onClick={() =>
        dispatch(
          setFeatureInfo([
            {
              features: ipvMainLayer.getIpvFeatures(),
              layer: ipvMainLayer,
            },
          ]),
        )
      }
    >
      <ListIcon />
    </MapButton>
  );
};

IpvListButton.propTypes = {};

export default IpvListButton;
