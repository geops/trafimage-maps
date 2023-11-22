import maplibregl from 'maplibre-gl';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LineString } from 'ol/geom';
import { getCenter } from 'ol/extent';
import { jsPDF as JsPDF } from 'jspdf';
import { Canvg } from 'canvg';
import NorthArrowCircle from './northArrowCircle.png'; // svg export doesn't work for ie11
import getLayersAsFlatArray from '../../utils/getLayersAsFlatArray';
import { FORCE_EXPORT_PROPERTY } from '../../utils/constants';
import LayerService from '../../utils/LayerService';

const actualPixelRatio = window.devicePixelRatio;

const getStyleWithForceVisibility = (
  mbStyle,
  topicStyleLayersToShow = [],
  topicStyleLayersToHide = [],
) => {
  const newMbStyle = { ...mbStyle };
  topicStyleLayersToShow.forEach((styleLayer) => {
    if (styleLayer.styleLayersFilter) {
      newMbStyle.layers.forEach((mbLayer) => {
        if (styleLayer.styleLayersFilter(mbLayer)) {
          // eslint-disable-next-line no-param-reassign
          mbLayer.layout.visibility = 'visible';
        }
      });
    }
  });
  topicStyleLayersToHide.forEach((styleLayer) => {
    if (styleLayer.styleLayersFilter) {
      newMbStyle.layers.forEach((mbLayer) => {
        if (styleLayer.styleLayersFilter(mbLayer)) {
          // eslint-disable-next-line no-param-reassign
          mbLayer.layout.visibility = 'none';
        }
      });
    }
  });
  return newMbStyle;
};

export const buildMapboxMapHd = (map, elt, center, style, scale, zoom) => {
  Object.defineProperty(window, 'devicePixelRatio', {
    get() {
      return scale;
    },
  });
  const mbMap = new maplibregl.Map({
    style,
    attributionControl: false,
    boxZoom: false,
    center: toLonLat(center),
    container: elt,
    interactive: false,
    preserveDrawingBuffer: true, // very important otherwise you can't export the canvas to png
  });
  mbMap.jumpTo({
    center: toLonLat(center),
    zoom: (zoom || map.getView().getZoom()) - 1,
    animate: false,
  });
  const p = new Promise((resolve) => {
    mbMap.on('idle', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        get() {
          return actualPixelRatio;
        },
      });
      resolve(mbMap);
    });
  });
  return p;
};

const buildOlMapHd = (map, elt, center, scale = 1, resolution) => {
  const mapToExport = new OLMap({
    target: elt,
    controls: [],
    pixelRatio: scale,
    view: new View({
      center,
      resolution: resolution || map.getView().getResolution(),
    }),
  });

  const addLayer = (layer) => {
    // Filter out invisible and vector layers
    if (!layer.getVisible() || layer?.getSource() instanceof VectorSource) {
      return;
    }
    // ol.layer.Group
    if (layer.getLayers) {
      layer.getLayers().forEach(addLayer);
    } else if (layer.getSource() instanceof VectorSource) {
      const newLayer = new VectorLayer({
        source: new VectorSource({
          features: [],
        }),
      });
      layer.getSource().forEachFeature((feat) => {
        newLayer.getSource().addFeature(feat.clone());
      });
      mapToExport.addLayer(newLayer);
    }
  };

  map.getLayers().forEach(addLayer);
  return mapToExport;
};

export const getMapHd = (
  map,
  layerService,
  scale,
  coordinates,
  size,
  zoom,
  extent,
) => {
  const targetSize = size || map.getSize();
  // We create a temporary map.
  const div = document.createElement('div');
  div.style.width = `${targetSize[0]}px`;
  div.style.height = `${targetSize[1]}px`;
  div.style.margin = `0 0 0 -50000px`; // we move the map to the left to be ensure it is hidden during export
  document.body.style.overflow = 'hidden';
  document.body.append(div);

  let center = map.getView().getCenter();
  let targetZoom = zoom;
  let targetResolution = null;

  if (coordinates) {
    const lineExtent = new LineString(coordinates).getExtent();
    center = getCenter(lineExtent);
  }

  // Extent get priority on zoom and coordinates.
  if (extent) {
    center = getCenter(extent);
    targetResolution = map.getView().getResolutionForExtent(extent, targetSize);
    targetZoom = map.getView().getZoomForResolution(targetResolution);
  }

  const mbMap =
    layerService.getBaseLayers()[0]?.mbMap ||
    layerService.getBaseLayers()[0]?.mapboxLayer.mbMap;

  if (!mbMap) {
    // eslint-disable-next-line no-console
    console.error('Mapbox map not found!');
    return Promise.resolve();
  }

  // We hide/show some layers when export.
  const styleLayersToForceShow = layerService.layers.filter(
    (l) => l.get(FORCE_EXPORT_PROPERTY) === true,
  );
  const styleLayersToForceHide = layerService.layers.filter(
    (l) => l.get(FORCE_EXPORT_PROPERTY) === false,
  );

  const mbStyle = getStyleWithForceVisibility(
    mbMap.getStyle(),
    styleLayersToForceShow,
    styleLayersToForceHide,
  );

  return buildMapboxMapHd(map, div, center, mbStyle, scale, targetZoom).then(
    () => {
      return buildOlMapHd(map, div, center, scale, targetResolution);
    },
  );
};

export const clean = (mapToExport) => {
  mapToExport.getLayers().clear();
  document.body.removeChild(mapToExport.getTarget());
  document.body.style.overflow = '';
  mapToExport.setTarget(null);
};

export const generateExtraData = (layers, exportNorthArrow) => {
  const extraData = {};

  extraData.copyright = {
    text: () => {
      const copyrights = getLayersAsFlatArray(layers)
        .filter((layer) => layer.visible && layer.copyrights)
        .map((layer) => {
          // Parse the copyright html drawn from the layer
          const parsed = new DOMParser().parseFromString(
            layer.copyrights,
            'text/html',
          );
          const copyrightArray = [];
          const coll = parsed.getElementsByTagName('a');
          for (let i = 0; i < coll.length; i += 1) {
            const copyright = coll[i];
            copyrightArray.push(copyright.text);
          }
          return copyrightArray;
        })
        .flat();
      const unique = Array.from(new Set(copyrights));
      return unique.join(' | ');
    },
  };

  if (exportNorthArrow) {
    extraData.northArrow = {
      src: NorthArrowCircle,
    };
  }
  return extraData;
};

export const exportPdf = async (
  mapToExport,
  map,
  layers,
  exportFormat,
  canvas,
  exportScale,
  exportSize,
  templateValues,
  overlayImageUrl,
  exportFileName,
) => {
  clean(mapToExport, map, new LayerService(layers));

  // Add the image to a newly created PDF
  const doc = new JsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: exportFormat,
  });

  // Add map image
  const ctx = canvas.getContext('2d');

  // Apply SVG overlay if provided
  if (overlayImageUrl) {
    // Fetch local svg
    const svgString = await fetch(overlayImageUrl).then((response) =>
      response.text(),
    );

    /**
     * Replace dates and publisher data in the legend SVG
     * CAUTION: The values dynamically replaced in the SVG are unique strings using ***[value]***
     * If changes in the legend SVG are necessary, make sure the values to insert are maintained
     * It is also recommended to use inkscape (Adobe illustrator SVG won't work out-of-the-box
     * without major alterations)
     * @ignore
     */
    let updatedSvg = svgString.slice(); // Clone the string
    Object.keys(templateValues).forEach((key) => {
      const value =
        typeof templateValues[key] === 'function'
          ? templateValues[key]()
          : templateValues[key];
      updatedSvg = updatedSvg.replace(`***${key}***`, value);
    });

    // The legend SVG MUST NOT contain width and height attributes (only a viewBox)
    // because it breaks canvg rendering: a bad canvas size is set.
    // so we remove it before the conversion to canvas.
    const svgDoc = new DOMParser().parseFromString(
      updatedSvg,
      'application/xml',
    );
    svgDoc.documentElement.removeAttribute('width');
    svgDoc.documentElement.removeAttribute('height');
    updatedSvg = new XMLSerializer().serializeToString(svgDoc);

    // Add legend SVG
    const canvass = document.createElement('canvas');
    canvass.width = canvas.width;
    canvass.height = canvas.height;

    const instance = await Canvg.fromString(
      canvass.getContext('2d'),
      updatedSvg,
    );
    await instance.render();

    // Add SVG to map canvas
    ctx.drawImage(canvass, 0, 0);
  }

  // Scale to fit the export size
  ctx.scale(1 / exportScale, 1 / exportScale);

  // Add canvas to PDF
  doc.addImage(canvas, 'JPEG', 0, 0, exportSize[0], exportSize[1]);

  // download the result
  doc.save(exportFileName);
};
