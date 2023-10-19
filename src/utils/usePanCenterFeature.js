import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useIsMobile from './useIsMobile';
import panCenterFeature from './panCenterFeature';

const usePanDisplayFeature = () => {
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const coordinate = featureInfo[0]?.coordinate;
  const map = useSelector((state) => state.app.map);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const feature = featureInfo[0]?.features[0];
  const layer = featureInfo[0]?.layer;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (feature && layer && coordinate) {
      panCenterFeature(
        map,
        [layer],
        coordinate,
        menuOpen,
        isMobile,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        activeTopic?.overlaySide,
      );
    }
  }, [
    activeTopic?.overlaySide,
    coordinate,
    feature,
    featureInfo,
    isMobile,
    layer,
    map,
    menuOpen,
  ]);
};

export default usePanDisplayFeature;
