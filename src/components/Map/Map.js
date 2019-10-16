import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';

import Layer from 'react-spatial/layers/Layer';
import { unByKey } from 'ol/Observable';
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import { setResolution, setCenter, setZoom } from '../../model/map/actions';

const propTypes = {
  projection: PropTypes.string,

  // mapStateToProps
  center: PropTypes.arrayOf(PropTypes.number),
  extent: PropTypes.arrayOf(PropTypes.number),
  initialCenter: PropTypes.arrayOf(PropTypes.number),
  initialZoom: PropTypes.number,
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  resolution: PropTypes.number,
  zoom: PropTypes.number,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetResolution: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
};

const defaultProps = {
  projection: 'EPSG:3857',

  // mapStateToProps
  center: [0, 0],
  initialCenter: undefined,
  initialZoom: undefined,
  layers: [],
  extent: undefined,
  resolution: undefined,
  zoom: 9,
};

class Map extends PureComponent {
  constructor(props) {
    super(props);

    const {
      initialCenter,
      initialZoom,
      dispatchSetCenter,
      dispatchSetZoom,
    } = this.props;

    if (initialCenter) {
      dispatchSetCenter(initialCenter);
    }

    if (typeof initialZoom !== 'undefined') {
      dispatchSetZoom(initialZoom);
    }
  }

  componentDidMount() {
    const { map } = this.props;
    unByKey(this.onPointerMoveRef);
    this.onPointerMoveRef = map.on('pointermove', e => this.onPointerMove(e));
  }

  onMapMoved(evt) {
    const {
      center,
      resolution,
      dispatchSetCenter,
      dispatchSetResolution,
      dispatchSetZoom,
      zoom,
    } = this.props;

    const newResolution = evt.map.getView().getResolution();
    const newZoom = evt.map.getView().getZoom();
    const newCenter = evt.map.getView().getCenter();

    if (zoom !== newZoom) {
      dispatchSetZoom(newZoom);
    }

    if (resolution !== newResolution) {
      dispatchSetResolution(newResolution);
    }

    if (center[0] !== newCenter[0] || center[1] !== newCenter[1]) {
      dispatchSetCenter(newCenter);
    }
  }

  onPointerMove(evt) {
    const { map, layerService } = this.props;

    if (map.getView().getInteracting() || map.getView().getAnimating()) {
      return;
    }

    const promises = [
      ...layerService
        .getLayersAsFlatArray()
        .filter(l => l.getVisible() && !l.isBaseLayer)
        .map(layer => {
          if (!layer.getVisible()) {
            return Promise.resolve(false);
          }
          return layer
            .getFeatureInfoAtCoordinate(evt.coordinate)
            .then(featureInfo => {
              return !!featureInfo.features[0];
            });
        }),
    ];
    Promise.all(promises).then(res => {
      map.getTarget().style.cursor = res.includes(true) ? 'pointer' : 'auto';
    });
  }

  render() {
    const {
      projection,
      center,
      zoom,
      layers,
      map,
      resolution,
      extent,
    } = this.props;

    return (
      <>
        <BasicMap
          center={center}
          resolution={resolution}
          extent={extent}
          layers={layers}
          zoom={zoom}
          map={map}
          onMapMoved={evt => this.onMapMoved(evt)}
          viewOptions={{
            projection,
            maxZoom: 20,
          }}
        />
      </>
    );
  }
}

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

const mapStateToProps = state => ({
  layerService: state.app.layerService,
  layers: state.map.layers,
  center: state.map.center,
  extent: state.map.extent,
  resolution: state.map.resolution,
  zoom: state.map.zoom,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetResolution: setResolution,
  dispatchSetZoom: setZoom,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Map);
