import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { jsPDF as JsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import Canvg from 'canvg';
import { ReactComponent as Loader } from './loader.svg';

import { getMapHd, clean, generateExtraData } from './ExportUtils';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    margin: '10px 20px',
    minWidth: 100,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 10px',
    height: 35,
    width: 110,
    backgroundColor: '#dcdcdc',
    '&:hover': {
      backgroundColor: '#cdcdcd',
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function ExportButton({
  exportFormat,
  exportScale,
  exportSize,
  exportCoordinates,
  exportZoom,
  exportExtent,
  children,
}) {
  const classes = useStyles();
  const map = useSelector((state) => state.app.map);
  const topic = useSelector((state) => state.app.activeTopic);
  const layerService = useSelector((state) => state.app.layerService);
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  return (
    <div className={classes.buttonWrapper}>
      <CanvasSaveButton
        className={classes.button}
        title={t('Als PNG speichern')}
        style={{
          pointerEvents: isLoading ? 'none' : 'auto',
          opacity: isLoading ? 0.3 : 1,
        }}
        extraData={generateExtraData(layerService)}
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
          clean(mapToExport, map, layerService);

          // add the image to a newly created PDF
          const doc = new JsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: exportFormat,
          });

          // Add map image
          const ctx = canvas.getContext('2d');
          ctx.scale(1 / exportScale, 1 / exportScale);

          // Apply SVG overlay if provided
          if (topic.exportConfig && topic.exportConfig.overlayImageUrl) {
            /**
             * CAUTION: The values dynamically replaced in the SVG are unique strings using ***[value]***
             * If changes in the legend SVG are necessary, make sure the values to insert are maintained
             * It is also recommended to use inkscape (Adobe illustrator SVG won't work out-of-the-box
             * without major alterations)
             */
            // Fetch local svg
            const svgString = await fetch(
              topic.exportConfig.overlayImageUrl,
            ).then((response) => response.text());

            let updatedSvg = svgString.slice(); // Clone the string

            // Replace dates and publisher data
            if (topic.exportConfig.dateDe) {
              updatedSvg = svgString.replace(
                '***date_DE***',
                topic.exportConfig.dateDe,
              );
            }

            if (topic.exportConfig.dateFr) {
              updatedSvg = updatedSvg.replace(
                '***date_FR***',
                topic.exportConfig.dateFr,
              );
            }

            if (topic.exportConfig.publisher) {
              updatedSvg = updatedSvg.replace(
                '***publisher***',
                topic.exportConfig.publisher,
              );
            }

            if (topic.exportConfig.publishedAt) {
              updatedSvg = updatedSvg.replace(
                '***published_at***',
                topic.exportConfig.publishedAt,
              );
            }

            // Add legend SVG
            const canvass = document.createElement('canvas');
            const ctxx = canvass.getContext('2d');
            const instance = await Canvg.fromString(ctxx, updatedSvg);
            await instance.render();

            // Add SVG to map canvas
            ctx.drawImage(canvass, 0, 0);
          }

          // Add canvas to PDF
          doc.addImage(canvas, 'JPEG', 0, 0, exportSize[0], exportSize[1]);

          // download the result
          const filename = `trafimage-${new Date()
            .toISOString()
            .substr(0, 10)}.pdf`;
          doc.save(filename);

          setLoading(false);
        }}
      >
        <>
          {isLoading ? (
            <span className={classes.loading}>
              <Loader />
              {t('Export läuft...')}
            </span>
          ) : (
            children
          )}
        </>
      </CanvasSaveButton>
    </div>
  );
}

ExportButton.propTypes = {
  exportFormat: PropTypes.string,
  exportExtent: PropTypes.arrayOf(PropTypes.number),
  exportScale: PropTypes.number,
  exportZoom: PropTypes.number,
  exportCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  children: PropTypes.node,
  exportSize: PropTypes.arrayOf(PropTypes.number),
};

ExportButton.defaultProps = {
  exportFormat: 'a0',
  exportScale: 1, // High res,
  exportCoordinates: null,
  exportZoom: null, // 10,
  exportExtent: [620000, 5741000, 1200000, 6058000],
  children: [],
  exportSize: [3370, 2384], // a0
};

export default React.memo(ExportButton);
