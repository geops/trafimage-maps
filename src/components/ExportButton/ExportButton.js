import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import { jsPDF as JsPDF } from 'jspdf';
import Canvg from 'canvg';
import determineMaxCanvasSize from '../../utils/canvasSize';
import { ReactComponent as Loader } from './loader.svg';
import legend from './tarifverbund_legend.svg';

import './ExportButton.scss';

import { getMapHd, clean, generateExtraData } from './ExportUtils';

const LS_SIZE_KEY = 'tm.max.canvas.size';

const sizesByFormat = {
  // https://www.din-formate.de/reihe-a-din-groessen-mm-pixel-dpi.html
  a0: [3370, 2384],
  a1: [2384, 1684],
};

function ExportButton({
  exportFormat,
  exportScale,
  exportCoordinates,
  exportZoom,
  exportExtent,
  children,
}) {
  const map = useSelector((state) => state.app.map);
  const layerService = useSelector((state) => state.app.layerService);
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [maxCanvasSize, setMaxCanvasSize] = useState(
    localStorage.getItem(LS_SIZE_KEY),
  );

  useEffect(() => {
    let timeout = null;
    if (maxCanvasSize) {
      return () => {};
    }
    timeout = setTimeout(() => {
      const size = determineMaxCanvasSize();
      if (size) {
        setMaxCanvasSize(size);
        localStorage.setItem(LS_SIZE_KEY, size);
      }
    }, 10);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const exportSize = useMemo(() => {
    return sizesByFormat[exportFormat];
  }, [exportFormat]);

  const isExportSizeTooBig = useMemo(() => {
    if (!map) {
      return true;
    }
    const mapSize = map.getSize();
    return (
      (maxCanvasSize &&
        ((exportSize &&
          (maxCanvasSize < exportSize[0] * exportScale ||
            maxCanvasSize < exportSize[1] * exportScale)) ||
          (!exportSize &&
            mapSize &&
            (maxCanvasSize < mapSize[0] * exportScale ||
              maxCanvasSize < mapSize[1] * exportScale)))) ||
      false
    );
  }, [exportScale, exportSize, map, maxCanvasSize]);

  console.log('maxCanvasSize=', maxCanvasSize);
  console.log('exportSize=', exportSize);
  return (
    <>
      <CanvasSaveButton
        className="no-css"
        style={{
          width: 'auto',
          pointerEvents: isExportSizeTooBig ? 'none' : 'default',
          opacity: isExportSizeTooBig ? 0.3 : 1,
        }}
        title={t('Als PNG speichern')}
        disabled={isExportSizeTooBig || isLoading}
        extraData={generateExtraData(layerService, true)}
        autoDownload={false}
        format="image/jpeg"
        onSaveStart={() => {
          setLoading(true);
          return getMapHd(
            map,
            layerService,
            exportScale,
            exportCoordinates,
            exportSize,
            exportZoom,
            exportExtent,
          );
        }}
        onSaveEnd={async (mapToExport, canvas) => {
          console.log(legend);
          clean(mapToExport, map, layerService);

          // add the image to a newly created PDF
          const doc = new JsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: exportFormat,
          });

          const ctx = canvas.getContext('2d');
          ctx.scale(1 / exportScale, 1 / exportScale);
          doc.addImage(canvas, 'JPEG', 0, 0, exportSize[0], exportSize[1]);

          const svgCanvas = document.createElement('canvas');
          const canvg = await Canvg.from(svgCanvas, legend);
          canvg.start();
          const imgData = svgCanvas.toDataURL('image/png');
          doc.addImage(imgData, 'JPEG', 0, 0, exportSize[0], exportSize[1]);

          // download the result
          const filename = `trafimage-${new Date()
            .toISOString()
            .substr(0, 10)}.pdf`;
          doc.save(filename);
          setLoading(false);
        }}
      >
        <>{isLoading ? <Loader /> : children}</>
      </CanvasSaveButton>
    </>
  );
}

ExportButton.propTypes = {
  exportFormat: PropTypes.string,
  exportExtent: PropTypes.arrayOf(PropTypes.number),
  exportScale: PropTypes.number,
  exportZoom: PropTypes.number,
  exportCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  children: PropTypes.node,
};

ExportButton.defaultProps = {
  exportFormat: 'a0',
  exportScale: 1, // High res,
  exportCoordinates: null,
  // [
  //   [656000, 5741000],
  //   [1200000, 6076000],
  // ],
  exportZoom: null, // 10,
  exportExtent: [656000, 5741000, 1200000, 6076000],
  children: [],
};

export default React.memo(ExportButton);
