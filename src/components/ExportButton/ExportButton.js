import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { jsPDF as JsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { parse as parseSvg, stringify as stringifySvgObject } from 'svgson';
import { makeStyles } from '@material-ui/core';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import Canvg from 'canvg';
import { ReactComponent as Loader } from './loader.svg';
import legend from './tarifverbund_legend.svg';

import { getMapHd, clean, generateExtraData } from './ExportUtils';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    border: '1px solid rgba(0, 0, 0, 0.30)',
    margin: '10px 20px',
    minWidth: 85,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    height: 35,
    width: 85,
    '&:hover': {
      color: '#eb0000',
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
          pointerEvents: isLoading ? 'none' : 'default',
          opacity: isLoading ? 0.3 : 1,
          width: 'auto',
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
          doc.addImage(canvas, 'JPEG', 0, 0, exportSize[0], exportSize[1]);

          /**
           * CAUTION: SVG parsing and dynamic value insertion will break if the legend SVG tree and tag IDs
           * are not maintained. If changes in the legend SVG are necessary, make sure the tree and IDs are maintained
           * It is also recommended to use inkscape (Adobe illustrator SVG won't work out-of-the-box
           * without major alterations)
           */
          // Fetch local svg
          const svgString = await fetch(legend).then((response) =>
            response.text(),
          );

          // svgson parse string to json to access values
          const svgJson = await parseSvg(svgString).then((json) => json);
          const legendElements = svgJson.children.find(
            (tag) => tag.attributes.id === 'legend_elements',
          ).children;

          // Set date DE
          legendElements.find(
            (element) => element.attributes.id === 'date_DE',
          ).children[0].children[0].value = topic.exportConfig.dateDe;

          // Set date FR
          legendElements.find(
            (element) => element.attributes.id === 'date_FR',
          ).children[0].children[0].value = topic.exportConfig.dateFr;

          // Set published at
          legendElements.find(
            (element) => element.attributes.id === 'published_at',
          ).children[0].children[0].children[0].value =
            topic.exportConfig.publishedAt;

          // Set publisher
          legendElements.find(
            (element) => element.attributes.id === 'publisher',
          ).children[0].children[0].children[0].value =
            topic.exportConfig.publisher;

          // svgson stringify the new object
          const updatedSvg = stringifySvgObject(svgJson);

          // Add legend SVG
          const canvass = document.createElement('canvas');
          const ctxx = canvass.getContext('2d');
          const instance = await Canvg.fromString(ctxx, updatedSvg);
          await instance.render();
          doc.addImage(
            canvass.toDataURL('image/png'),
            'PNG',
            0,
            0,
            exportSize[0],
            exportSize[1],
          );

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
  exportSize: [3370, 2384],
};

export default React.memo(ExportButton);
