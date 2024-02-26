import { useEffect, useState } from "react";
import canvasSize from "canvas-size";
import { cancelable } from "cancelable-promise";
import { useSelector, useDispatch } from "react-redux";
import { LS_SIZE_KEY } from "./constants";
import { setMaxCanvasSize } from "../model/app/actions";

const useMaxCanvasSize = () => {
  const maxCanvasSize = useSelector((state) => state.app.maxCanvasSize);
  const [mCanvasSize, setMCanvasSize] = useState(maxCanvasSize);
  const dispatch = useDispatch();
  useEffect(() => {
    let maxCanvasPromise = null;
    if (!maxCanvasSize) {
      maxCanvasPromise =
        !maxCanvasSize &&
        cancelable(
          canvasSize
            .maxArea({ usePromise: true })
            .then((result) => {
              const size = Math.max(result.width, result.height);
              setMCanvasSize(size);
              dispatch(setMaxCanvasSize(size));
              localStorage.setItem(LS_SIZE_KEY, size);
            })
            // eslint-disable-next-line no-console
            .catch((result) => console.log("Error", result)),
        );
    }
    return () => maxCanvasPromise?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return mCanvasSize;
};

export default useMaxCanvasSize;
