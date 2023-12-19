import lines from "./lines";

// Get mapbox line-color expression.
const getLineColorExpr = (lineProperty) => {
  const expr = ["case"];
  Object.entries(lines).forEach(([key, { property, color }]) => {
    if (property === lineProperty) {
      expr.push(["==", ["get", property], key]);
      expr.push(color);
    }
  });
  expr.push("rgba(0, 0, 0, 0)");
  return expr;
};

// Generate dashed styles for features with multiple lines in the label.
const generateDashedStyleLayers = (line, layer) => {
  const { property, sourceId, sourceLayer } = layer;
  const styleLayers = [];
  const linesLabels = line.split(",");
  linesLabels.forEach((label, index) => {
    const color = lines[label]?.color;
    if (!color) {
      // eslint-disable-next-line no-console
      console.log(
        `There is no color defined for ${label}, available labels are `,
        lines,
      );
      return;
    }
    styleLayers.push({
      id: `${line}${index}`,
      source: sourceId,
      "source-layer": sourceLayer,
      type: "line",
      filter: ["==", line, ["get", property]],
      paint: {
        "line-color": color,
        "line-width": 4,
        "line-dasharray": [(linesLabels.length - index) * 2, index * 2],
      },
    });
  });
  return styleLayers;
};

// Load the tilestats data to get all the possible values for hauptlinie or touristische_linie property.
const getDashedStyleLayers = (layer, zweitTilestats = {}) => {
  const { property } = layer;
  const styleLayers = [];
  (zweitTilestats[`geops.zweitausbildung.${property}`] || []).forEach(
    (value) => {
      const split = value.split(",");
      if (split.length > 1) {
        styleLayers.push(...generateDashedStyleLayers(value, layer));
      }
    },
  );
  return styleLayers;
};

const getStyleLayers = (layer, zweitTilestats = {}) => {
  const { property, sourceId, sourceLayer, name, key } = layer;
  const defautStyle = {
    type: "line",
    filter: ["has", property],
    paint: {
      "line-color": getLineColorExpr(property),
      "line-width": 4,
    },
    layout: {
      "line-cap": "round",
    },
  };
  const styleLayers = [
    // Lines with only one color.
    {
      ...defautStyle,
      id: name || key,
      source: sourceId,
      "source-layer": sourceLayer,
    },
    // Lines with a dashed style.
    ...getDashedStyleLayers(layer, zweitTilestats),
  ];

  // if a line has others sources to add, we add the corresponding style layer.
  Object.values(lines).forEach(
    ({ property: prop, extraSources, extraStyleLayers = [] }) => {
      if (prop !== property || !extraSources) {
        return;
      }
      Object.keys(extraSources).forEach((sourceKey, index) => {
        styleLayers.push({
          ...defautStyle,
          id: sourceKey,
          source: sourceKey,
          ...(extraStyleLayers[index] || {}),
        });
      });
    },
  );
  return styleLayers;
};

export default getStyleLayers;
