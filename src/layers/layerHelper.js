import {
  Style as OLStyle,
  Circle as OLCircle,
  Fill as OLFill,
  Stroke as OLStroke,
} from 'ol/style';

const dataResolutions = [750, 500, 250, 100, 50, 20, 10, 5];

function getDataResolution(resolution) {
  return dataResolutions.reduce((prev, curr) =>
    Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
  );
}

const defaultStyle = new OLStyle({
  image: new OLCircle({
    radius: 10,
    fill: new OLFill({
      color: 'rgba(255,255,255,0.01)',
    }),
  }),
});

const highlightStyle = new OLStyle({
  image: new OLCircle({
    radius: 10,
    fill: new OLFill({
      color: 'rgba(0,61,155,0.5)',
    }),
  }),
  fill: new OLFill({ color: 'rgba(0,61,155,0.2)' }),
  stroke: new OLStroke({ color: 'rgba(0,61,155,0.5)', width: 10 }),
});

export default { defaultStyle, highlightStyle, getDataResolution };
