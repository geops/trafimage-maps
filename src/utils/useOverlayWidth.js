import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useOverlayWidth = () => {
  const overlayElement = useSelector((state) => state.app.overlayElement);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    if (!overlayElement) {
      setWidth(0);
      return () => resizeObserver.disconnect();
    }
    resizeObserver.observe(overlayElement);
    return () => resizeObserver.disconnect();
  }, [overlayElement]);
  return width;
};

export default useOverlayWidth;
