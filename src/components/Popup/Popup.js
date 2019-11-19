import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Point from 'ol/geom/Point';
import RSPopup from 'react-spatial/components/Popup';
import FeatureInformation from '../FeatureInformation';
import { setClickedFeatureInfo } from '../../model/app/actions';
import './Popup.scss';

const Popup = () => {
  const map = useSelector(state => state.app.map);
  const { activeTopic, clickedFeatureInfo } = useSelector(state => state.app);
  const dispatch = useDispatch();

  if (!clickedFeatureInfo || !clickedFeatureInfo.length) {
    return null;
  }

  const filtered = clickedFeatureInfo.filter(({ layer }) =>
    layer.get('popupComponent'),
  );

  if (!filtered.length) {
    return null;
  }

  const { coordinate, features } = clickedFeatureInfo[0];
  const geom = features[0].getGeometry();
  const coord =
    features.length === 1 && geom instanceof Point
      ? geom.getCoordinates()
      : coordinate;
  const mapRect = map.getTarget().getBoundingClientRect();

  return (
    <RSPopup
      onCloseClick={() => {
        dispatch(setClickedFeatureInfo());
      }}
      showHeader={false}
      padding="0px"
      panIntoView
      panRect={{
        top: mapRect.top + (activeTopic.elements.header ? 110 : 10),
        bottom: mapRect.bottom,
        left: mapRect.left + 10,
        right: mapRect.right - (activeTopic.elements.mapControls ? 70 : 10),
      }}
      popupCoordinate={coord}
      map={map}
    >
      <FeatureInformation clickedFeatureInfo={filtered} />
    </RSPopup>
  );
};

export default React.memo(Popup);
