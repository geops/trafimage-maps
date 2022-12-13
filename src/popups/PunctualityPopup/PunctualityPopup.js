import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import TralisLayer from '../../layers/TralisLayer';

function PunctualityPopup({ feature, layer }) {
  const dispatch = useDispatch();
  const map = useSelector((state) => state.app.map);
  const [lineInfos, setLineInfos] = useState(null);

  useEffect(() => {
    let trainId;
    const onStopSequence = ({ content: stopSequence }) => {
      if (stopSequence && stopSequence[0]) {
        // eslint-disable-next-line no-param-reassign
        stopSequence[0].backgroundColor = stopSequence[0].stroke;
        // eslint-disable-next-line no-param-reassign
        stopSequence[0].color = stopSequence[0].text_color;
      }
      setLineInfos(stopSequence[0]);
    };

    if (layer && feature) {
      trainId = feature.get('train_id');

      if (trainId && layer instanceof TralisLayer) {
        // eslint-disable-next-line no-param-reassign
        layer.selectedVehicleId = trainId;
        layer.api.subscribeStopSequence(trainId, onStopSequence);
      }
    }
    return () => {
      if (layer && trainId) {
        // Unsubscribe without cb function, because it does not work properly.
        layer.api.unsubscribeStopSequence(trainId);

        // Clear the highlighted trajectory
        layer.vectorLayer.getSource().clear();
        // eslint-disable-next-line no-param-reassign
        layer.selectedVehicleId = null;
      }
      setLineInfos();
    };
  }, [dispatch, layer, feature]);

  if (!lineInfos) {
    return null;
  }

  return (
    <RouteSchedule
      trackerLayer={layer}
      lineInfos={lineInfos}
      onStationClick={(station) => {
        if (station.coordinate) {
          map.getView().animate({
            zoom: map.getView().getZoom(),
            center: station.coordinate,
          });
        }
      }}
    />
  );
}

PunctualityPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(TralisLayer).isRequired,
};

const composed = React.memo(PunctualityPopup);
composed.hideHeader = () => true;
export default composed;
