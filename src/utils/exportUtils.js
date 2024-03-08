import maplibregl from "maplibre-gl";
import OLMap from "ol/Map";
import View from "ol/View";
import { toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LineString } from "ol/geom";
import { getCenter } from "ol/extent";
import { jsPDF as JsPDF } from "jspdf";
import { ScaleLine } from "ol/control";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import NorthArrowCircle from "../img/northArrowCircle.png"; // svg export doesn't work for ie11
import getLayersAsFlatArray from "./getLayersAsFlatArray";
import { FORCE_EXPORT_PROPERTY } from "./constants";
import LayerService from "./LayerService";
import { getSBBFontsDefinition } from "./fontUtils";

const actualPixelRatio = window.devicePixelRatio;
const geoJson = new GeoJSON();

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
          mbLayer.layout.visibility = "visible";
        }
      });
    }
  });
  topicStyleLayersToHide.forEach((styleLayer) => {
    if (styleLayer.styleLayersFilter) {
      newMbStyle.layers.forEach((mbLayer) => {
        if (styleLayer.styleLayersFilter(mbLayer)) {
          // eslint-disable-next-line no-param-reassign
          mbLayer.layout.visibility = "none";
        }
      });
    }
  });
  return newMbStyle;
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // On safari and chrome iOS we have to wait the fonts are properly loaded
      // it's ugly but seems to work.
      window.setTimeout(() => {
        resolve(img);
      }, 2000);
    };
    img.onerror = reject;
    img.src = src;
  });

/**
 * Creates a styled scaleline element from the openlayers scaleline control
 * @param {ol.controls.ScaleLineControl} scaleLineControl
 * @param {number} resolution The resolution of the map
 * @returns
 */
export const getStyledPdfScaleLine = (scaleLineControl, resolution = 1) => {
  const pixelRatio = window.devicePixelRatio || 1;
  const scaleLineElement = scaleLineControl?.element?.children[0];
  const width = parseInt(scaleLineElement.style.width, 10);
  scaleLineElement.style.width = `${(width * resolution) / pixelRatio}px`;
  scaleLineElement.style.height = `${(10 * resolution) / pixelRatio}px`;
  scaleLineElement.style["font-size"] = `${(6 * resolution) / pixelRatio}px`;
  scaleLineElement.style["border-width"] = `${(1 * resolution) / pixelRatio}px`;
  scaleLineElement.style["border-color"] = "black";
  scaleLineElement.style["font-color"] = "black";
  scaleLineElement.style["font-family"] = "SBBWeb-Roman,Arial,sans-serif";
  scaleLineElement.style.display = "flex";
  scaleLineElement.style["align-items"] = "center";
  scaleLineElement.style["justify-content"] = "center";
  return scaleLineElement;
};

/**
 * Adds a layer with invisible labels to displace the labels at the edge of the exported map
 * @param {maplibregl.Map} mbMap A maplibregl map
 * @param {string} sourceId The id of the displace source
 * @param {string} layerId The id of the displace layer
 */
const addLabelDisplaceLayer = (
  mbMap,
  sourceId = "printframe",
  layerId = "print_frame_displacement",
) => {
  const extent = mbMap.getBounds().toArray();
  const displaceSource = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        geoJson.writeFeatureObject(
          new Feature(
            new LineString([
              extent[0],
              [extent[0][0], extent[1][1]],
              extent[1],
              [extent[1][0], extent[0][1]],
              extent[0],
            ]),
          ),
        ),
      ],
    },
  };
  const displaceLayer = {
    id: layerId,
    type: "symbol",
    source: "printframe",
    metadata: { "geltungsbereiche.filter": "printframe" },
    minzoom: 0,
    maxzoom: 24,
    layout: {
      "symbol-placement": "line",
      "symbol-spacing": 1,
      "text-font": ["SBB Web Roman"],
      "text-field": "x",
      "text-size": 4,
      "text-max-angle": 1000,
      "text-pitch-alignment": "viewport",
      "text-rotation-alignment": "viewport",
      visibility: "visible",
    },
    paint: { "text-opacity": 0 },
  };
  mbMap.addSource(sourceId, displaceSource);
  mbMap.addLayer(displaceLayer);
};

export const buildMapboxMapHd = (map, elt, center, style, scale, zoom) => {
  Object.defineProperty(window, "devicePixelRatio", {
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
    mbMap.on("load", () => addLabelDisplaceLayer(mbMap));
    mbMap.on("idle", () => {
      Object.defineProperty(window, "devicePixelRatio", {
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
  const olScaleline = new ScaleLine();
  const mapToExport = new OLMap({
    target: elt,
    controls: [olScaleline],
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
  const div = document.createElement("div");
  div.style.width = `${targetSize[0]}px`;
  div.style.height = `${targetSize[1]}px`;
  div.style.margin = `0 0 0 -50000px`; // we move the map to the left to be ensure it is hidden during export
  document.body.style.overflow = "hidden";
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

  const baseLayer = layerService.getBaseLayers()[0];
  const mbMap = baseLayer?.mbMap || baseLayer?.mapboxLayer.mbMap;

  if (!mbMap) {
    // eslint-disable-next-line no-console
    console.error("Mapbox map not found!");
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
  document.body.style.overflow = "";
  mapToExport.setTarget(null);
};

export const generateExtraData = (layers, options = { copyright: true }) => {
  const { copyright, northArrow } = options;
  const extraData = {};

  if (copyright) {
    extraData.copyright = {
      text: () => {
        const copyrights = getLayersAsFlatArray(layers)
          .filter((layer) => layer.visible && layer.copyrights)
          .map((layer) => {
            // Parse the copyright html drawn from the layer
            const parsed = new DOMParser().parseFromString(
              layer.copyrights,
              "text/html",
            );
            const copyrightArray = [];
            const coll = parsed.getElementsByTagName("a");
            for (let i = 0; i < coll.length; i += 1) {
              const cpyright = coll[i];
              copyrightArray.push(cpyright.text);
            }
            return copyrightArray;
          })
          .flat();
        const unique = Array.from(new Set(copyrights));
        return unique.join(" | ");
      },
    };
  }

  if (northArrow) {
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
  templateValues = {},
  overlayImageUrl,
  exportFileName = `trafimage-${new Date().toISOString().slice(0, 10)}.pdf`,
  scaleLineConfig,
) => {
  clean(mapToExport, map, new LayerService(layers));
  // Add the image to a newly created PDF
  const doc = new JsPDF({
    orientation: "landscape",
    unit: "pt",
    format: exportFormat,
  });

  // Add map image
  const ctx = canvas.getContext("2d");

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
        typeof templateValues[key] === "function"
          ? templateValues[key]()
          : templateValues[key];
      updatedSvg = updatedSvg.replace(`***${key}***`, value);
    });

    // The legend SVG MUST NOT contain width and height attributes (only a viewBox)
    // because it breaks the image rendering, a bad width and height is set
    // so we remove it before the conversion
    const svgDoc = new DOMParser().parseFromString(
      updatedSvg,
      "application/xml",
    );
    svgDoc.documentElement.removeAttribute("width");
    svgDoc.documentElement.removeAttribute("height");

    // Remove SVG scaleline when using dynamic scaleline
    if (scaleLineConfig?.canvas) {
      svgDoc.documentElement.getElementById("scaleline")?.remove();
    }

    // Insert SBB font definition as first child in the SVG
    const fontDefsString = await getSBBFontsDefinition();
    const fontDefsElement = new DOMParser().parseFromString(
      fontDefsString,
      "application/xml",
    ).documentElement;
    svgDoc.documentElement.insertBefore(
      fontDefsElement,
      svgDoc.documentElement.firstChild,
    );

    // Convert SVG to image
    updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    const blob = new Blob([updatedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    // window.open(url, "_blank");
    const image = await loadImage(url);

    // Add SVG to map canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  // Add dynamic scaleline if defined
  if (scaleLineConfig?.canvas) {
    const { x, y, canvas: scaleLineCanvas } = scaleLineConfig;
    ctx.drawImage(scaleLineCanvas, x, y);
  }

  // Scale to fit the export size
  ctx.scale(1 / exportScale, 1 / exportScale);

  // Add canvas to PDF
  doc.addImage(canvas, "JPEG", 0, 0, exportSize[0], exportSize[1]);

  // download the result
  doc.save(exportFileName);
};

export const sizesByFormat = {
  // https://www.din-formate.de/reihe-a-din-groessen-mm-pixel-dpi.html
  a0: [3370, 2384],
  a1: [2384, 1684],
  a3: [1191, 842],
  a4: [842, 595],
};

export const validateOption = (format, exportScale, maxCanvasSize, map) => {
  if (!map || !maxCanvasSize) {
    return true;
  }
  const exportSize = sizesByFormat[format];
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
};

export const getHighestPossibleRes = (maxCanvasSize, map, options) => {
  const highestRes = options.reduce((final, option) => {
    let newFinal = { ...final };
    if (
      !validateOption(option.paperSize, option.quality, maxCanvasSize, map) &&
      option.weight > (final.weight || 0)
    ) {
      newFinal = option;
    }
    return newFinal;
  });
  return { paperSize: highestRes.paperSize, quality: highestRes.quality };
};

export const optionsA0 = [
  { label: "A0 (72 dpi)", quality: 1, paperSize: "a0", weight: 8 },
  { label: "A0 (150 dpi)", quality: 2, paperSize: "a0", weight: 10 },
  { label: "A0 (300 dpi)", quality: 3, paperSize: "a0", weight: 12 },
];

export const optionsA1 = [
  { label: "A1 (72 dpi)", quality: 1, paperSize: "a1", weight: 7 },
  { label: "A1 (150 dpi)", quality: 2, paperSize: "a1", weight: 9 },
  { label: "A1 (300 dpi)", quality: 3, paperSize: "a1", weight: 11 },
];

export const optionsA3 = [
  { label: "A3 (72 dpi)", quality: 1, paperSize: "a3", weight: 2 },
  { label: "A3 (150 dpi)", quality: 2, paperSize: "a3", weight: 4 },
  { label: "A3 (300 dpi)", quality: 3, paperSize: "a3", weight: 6 },
];

export const optionsA4 = [
  { label: "A4 (72 dpi)", quality: 1, paperSize: "a4", weight: 1 },
  { label: "A4 (150 dpi)", quality: 2, paperSize: "a4", weight: 3 },
  { label: "A4 (300 dpi)", quality: 3, paperSize: "a4", weight: 5 },
];

export const exportOptions = [
  ...optionsA0,
  ...optionsA1,
  ...optionsA3,
  ...optionsA4,
];
