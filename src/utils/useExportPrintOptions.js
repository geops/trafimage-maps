import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setExportPrintOptions } from "../model/app/actions";
import { getHighestPossibleRes } from "./exportUtils";
import useMaxCanvasSize from "./useMaxCanvasSize";

const useExportPrintOptions = (options) => {
  const dispatch = useDispatch();
  const map = useSelector((state) => state.app.map);
  const maxCanvasSize = useMaxCanvasSize();
  const exportPrintOptions = useSelector(
    (state) => state.app.exportPrintOptions,
  );
  const [printOptions, setPrintOptions] = useState(exportPrintOptions);

  useEffect(() => {
    if (exportPrintOptions) {
      setPrintOptions(exportPrintOptions);
    }
  }, [exportPrintOptions]);

  useEffect(() => {
    if (
      (!printOptions && maxCanvasSize) ||
      (printOptions &&
        !options.find(
          (opt) =>
            opt.paperSize === printOptions?.paperSize &&
            opt.quality === printOptions?.quality,
        ))
    ) {
      const highestResSelection = getHighestPossibleRes(
        maxCanvasSize,
        map,
        options,
      );
      setPrintOptions(highestResSelection);
      dispatch(setExportPrintOptions(highestResSelection));
    }
  }, [dispatch, map, maxCanvasSize, options, printOptions]);

  return printOptions;
};

export default useExportPrintOptions;
