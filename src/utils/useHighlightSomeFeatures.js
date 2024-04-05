import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * This hook will only highlight specific set of features that are part
 * of the current feature infos. See iSB popup for exmaple of use.
 *
 * Works only with MapboxStyleLayer.
 */
const useHighlightSomeFeatures = (features, layer) => {
  const featureInfo = useSelector((state) => state.app.featureInfo);
  // Highlight only one feature at a time.
  useEffect(() => {
    if (!layer || !features?.length) {
      return () => {};
    }

    featureInfo?.forEach(({ layer: l }) => {
      if (l !== layer) {
        l?.highlight?.();
      }
    });
    layer?.highlight(features);
    return () => {
      layer?.highlight();
    };
  }, [layer, features, featureInfo]);
};

export default useHighlightSomeFeatures;
