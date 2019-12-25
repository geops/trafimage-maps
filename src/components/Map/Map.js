import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';

import Layer from 'react-spatial/layers/Layer';
import { unByKey } from 'ol/Observable';
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import { setResolution, setCenter, setZoom } from '../../model/map/actions';
import { setClickedFeatureInfo } from '../../model/app/actions';

const propTypes = {
  dispatchHtmlEvent: PropTypes.func,

  // mapStateToProps
  clickedFeatureInfo: PropTypes.arrayOf(PropTypes.shape()),
  center: PropTypes.arrayOf(PropTypes.number),
  extent: PropTypes.arrayOf(PropTypes.number),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  resolution: PropTypes.number,
  zoom: PropTypes.number,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetResolution: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  // mapStateToProps
  center: [0, 0],
  clickedFeatureInfo: [],
  layers: [],
  extent: undefined,
  resolution: undefined,
  zoom: 9,
  dispatchHtmlEvent: () => {},
};

class Map extends PureComponent {
  componentDidMount() {
    const { map, dispatchHtmlEvent } = this.props;
    unByKey([this.onPointerMoveRef, this.onSingleClickRef]);
    this.onPointerMoveRef = map.on('pointermove', e => this.onPointerMove(e));
    this.onSingleClickRef = map.on('singleclick', e => this.onSingleClick(e));
    dispatchHtmlEvent(new CustomEvent('load'));
  }

  componentWillUnmount() {
    unByKey([this.onPointerMoveRef, this.onSingleClickRef]);
  }

  onMapMoved(evt) {
    const {
      center,
      resolution,
      dispatchSetCenter,
      dispatchSetResolution,
      dispatchSetZoom,
      zoom,
      dispatchHtmlEvent,
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

    // Propagate the ol event to the WebComponent
    const htmlEvent = new CustomEvent(evt.type, { detail: evt });
    dispatchHtmlEvent(htmlEvent);
  }

  onPointerMove(evt) {
    const { map, coordinate } = evt;
    const {
      layerService,
      clickedFeatureInfo,
      dispatchSetClickedFeatureInfo,
    } = this.props;

    if (map.getView().getInteracting() || map.getView().getAnimating()) {
      return;
    }

    layerService.getFeatureInfoAtCoordinate(coordinate).then(featureInfos => {
      let infos = featureInfos.filter(({ features }) => features.length);
      map.getTarget().style.cursor = infos.length ? 'pointer' : 'auto';

      const isClickInfoOpen =
        clickedFeatureInfo &&
        clickedFeatureInfo.length &&
        clickedFeatureInfo.every(({ layer }) => !layer.get('showPopupOnHover'));

      // don't continue if there's a popup that was opened by click
      if (!isClickInfoOpen) {
        infos = infos.filter(
          ({ layer }) =>
            layer.get('showPopupOnHover') && layer.get('popupComponent'),
        );

        dispatchSetClickedFeatureInfo(infos);
      }
    });
  }

  onSingleClick(evt) {
    const { coordinate } = evt;
    const {
      layerService,
      dispatchSetClickedFeatureInfo,
      dispatchHtmlEvent,
    } = this.props;

    layerService.getFeatureInfoAtCoordinate(coordinate).then(featureInfos => {
      // Display only info of layers with a popup defined.
      let infos = featureInfos
        .reverse()
        .filter(
          ({ layer }) =>
            layer.get('popupComponent') && !layer.get('showPopupOnHover'),
        );

      // Clear the select style.
      infos.forEach(({ layer, features }) => {
        if (layer.select) {
          layer.select(features);
        }
      });

      // Dispatch only infos with features found.
      infos = infos.filter(({ features }) => features.length);
      dispatchSetClickedFeatureInfo(infos);

      // Propagate the infos clicked to the WebComponent
      dispatchHtmlEvent(
        new CustomEvent('getfeatureinfo', {
          detail: infos,
        }),
      );
    });

    // Propagate the ol event to the WebComponent
    const htmlEvent = new CustomEvent(evt.type, {
      detail: evt,
    });
    dispatchHtmlEvent(htmlEvent);
  }

  render() {
    const { center, zoom, layers, map, resolution, extent, t } = this.props;

    return (
      <>
        <BasicMap
          center={center}
          resolution={resolution}
          extent={extent}
          layers={layers}
          zoom={zoom}
          map={map}
          ariaLabel={t('Karte')}
          onMapMoved={evt => this.onMapMoved(evt)}
          viewOptions={{
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
  clickedFeatureInfo: state.app.clickedFeatureInfo,
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
  dispatchSetClickedFeatureInfo: setClickedFeatureInfo,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(Map);
