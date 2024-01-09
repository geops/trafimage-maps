import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setExportSelection } from "../model/app/actions";
import { getHighestPossibleRes } from "./exportUtils";
import useMaxCanvasSize from "./useMaxCanvasSize";

const useExportSelection = (options) => {
  const dispatch = useDispatch();
  const map = useSelector((state) => state.app.map);
  const maxCanvasSize = useMaxCanvasSize();
  const exportSelection = useSelector((state) => state.app.exportSelection);
  const [selection, setSelection] = useState(exportSelection);

  useEffect(() => {
    if (exportSelection) {
      setSelection(exportSelection);
    }
  }, [exportSelection]);

  useEffect(() => {
    if (
      (!selection && maxCanvasSize) ||
      (selection &&
        !options.find(
          (opt) =>
            opt.format === selection?.format &&
            opt.resolution === selection?.resolution,
        ))
    ) {
      const highestResSelection = getHighestPossibleRes(
        maxCanvasSize,
        map,
        options,
      );
      setSelection(highestResSelection);
      dispatch(setExportSelection(highestResSelection));
    }
  }, [dispatch, map, maxCanvasSize, options, selection]);

  return selection;
};

export default useExportSelection;
