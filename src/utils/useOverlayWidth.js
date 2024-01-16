import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useOverlayWidth = () => {
  const overlayElement = useSelector((state) => state.app.overlayElement);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!overlayElement) {
      setWidth(0);
      return;
    }
    new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width),
    ).observe(overlayElement);
  }, [overlayElement]);
  return width;
};

export default useOverlayWidth;
