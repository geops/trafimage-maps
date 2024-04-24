import { useMemo } from "react";
import { useSelector } from "react-redux";

const useHasScreenSize = (screenSizes = ["xs"]) => {
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return screenSizes.includes(screenWidth);
  }, [screenWidth, screenSizes]);
  return isMobile;
};

export default useHasScreenSize;
