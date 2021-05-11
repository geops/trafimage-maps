import mapboxgl from 'mapbox-gl';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LineString } from 'ol/geom';
import { getCenter } from 'ol/extent';
import NorthArrowCircle from './northArrowCircle.png'; // svg export doesn't work for ie11

const actualPixelRatio = window.devicePixelRatio;

export const buildMapboxMapHd = (map, elt, center, style, scale, zoom) => {
  Object.defineProperty(window, 'devicePixelRatio', {
    get() {
      return scale;
    },
  });
  const mbMap = new mapboxgl.Map({
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

  map.getLayers().forEach((layer) => {
    if (!layer.getVisible()) {
      return;
    }

    if (layer.getSource() instanceof VectorSource) {
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
  });
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
  //   div.style.visibility = 'hidden';
  div.style.width = `${targetSize[0]}px`;
  div.style.height = `${targetSize[1]}px`;
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
  return buildMapboxMapHd(
    map,
    div,
    center,
    mbMap.getStyle(),
    scale,
    targetZoom,
  ).then(() => {
    return buildOlMapHd(map, div, center, scale, targetResolution);
  });
};

export const clean = (mapToExport) => {
  mapToExport.getLayers().clear();
  document.body.removeChild(mapToExport.getTarget());
  mapToExport.setTarget(null);
};

export const generateExtraData = (layerService, exportNorthArrow) => {
  const extraData = {};

  if (layerService) {
    extraData.copyright = {
      text: () => {
        const layers = layerService.getLayersAsFlatArray();
        const copyrights = layers
          .filter((layer) => layer.visible && layer.copyrights)
          .map((layer) => {
            // Parse the copyright html drawn from the layer
            const parsed = new DOMParser().parseFromString(
              layer.copyrights,
              'text/html',
            );
            const copyrightArray = [];
            parsed
              .getElementsByTagName('a')
              .forEach((copyright) => copyrightArray.push(copyright.text));
            return copyrightArray;
          });
        const unique = Array.from(new Set(copyrights));
        return unique.join(' | ');
      },
    };
  }

  if (exportNorthArrow) {
    extraData.northArrow = {
      src: NorthArrowCircle,
    };
  }
  return extraData;
};
