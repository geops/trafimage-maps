import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unByKey } from "ol/Observable";

import { setFeatureInfo } from "../model/app/actions";

const useUpdateFeatureInfoOnLayerToggle = (layers) => {
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const dispatch = useDispatch();
  useEffect(() => {
    const listeners = layers.map((l) => {
      return l?.on("change:visible", (evt) => {
        const layer = evt.target;
        if (!layer.visible) {
          dispatch(
            setFeatureInfo(featureInfo.filter((info) => info.layer !== layer)),
          );
        }
      });
    });
    return () => {
      unByKey(listeners);
    };
  }, [layers, featureInfo, dispatch]);
};

export default useUpdateFeatureInfoOnLayerToggle;
