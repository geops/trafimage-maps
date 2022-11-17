import MapboxStyleLayer from '../MapboxStyleLayer';

const lineWidth = 15;

class StsHighlightRoutesLayer extends MapboxStyleLayer {
  highlightRoutes(names = []) {
    const { mbMap, loaded } = this.mapboxLayer || {};
    if (loaded && mbMap && mbMap.getStyle()) {
      let lineWidthProp = 0;
      if (names.length) {
        const any = ['any'];
        names.forEach((name) => {
          any.push(['in', name, ['get', 'route_names_premium']]);
          any.push(['in', name, ['get', 'route_names_gttos']]);
        });
        lineWidthProp = ['case', any, lineWidth, 0];
      }
      mbMap
        .getStyle()
        .layers.filter(this.styleLayersFilter)
        .forEach((layer) => {
          mbMap.setPaintProperty(layer.id, 'line-width', lineWidthProp);
        });
    }
  }
}

export default StsHighlightRoutesLayer;
