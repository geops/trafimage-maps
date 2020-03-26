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
import { setFeatureInfo, setSearchOpen } from '../../model/app/actions';

const propTypes = {
  dispatchHtmlEvent: PropTypes.func,
  maxZoom: PropTypes.number,

  // mapStateToProps
  featureInfo: PropTypes.arrayOf(PropTypes.shape()),
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
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchOpen: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  // mapStateToProps
  center: [0, 0],
  featureInfo: [],
  layers: [],
  extent: undefined,
  resolution: undefined,
  zoom: 9,
  maxZoom: 20,
  dispatchHtmlEvent: () => {},
};

class Map extends PureComponent {
  /**
   * Compare 2 feature info objects and return true
   * if they are the same.
   * @private
   */
  static isSameFeatureInfo(first, second) {
    if (first.length !== second.length) {
      return false;
    }

    const firstFeatures = first.map(f => f.features).flat();
    const secondFeatures = second.map(s => s.features).flat();

    if (firstFeatures.length !== secondFeatures.length) {
      return false;
    }

    return firstFeatures.every((f, i) => secondFeatures[i] === f);
  }

  componentDidMount() {
    const { map, dispatchHtmlEvent } = this.props;
    unByKey([this.onPointerMoveRef, this.onSingleClickRef]);
    this.onPointerMoveRef = map.on('pointermove', e => this.onPointerMove(e));
    this.onSingleClickRef = map.on('singleclick', e => this.onSingleClick(e));
    dispatchHtmlEvent(new CustomEvent('load'));

    this.increaseFontSize();
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
    const { layerService, featureInfo, dispatchSetFeatureInfo } = this.props;

    if (map.getView().getInteracting() || map.getView().getAnimating()) {
      return;
    }

    layerService.getFeatureInfoAtCoordinate(coordinate).then(newInfos => {
      let infos = newInfos.filter(({ features }) => features.length);
      map.getTarget().style.cursor = infos.length ? 'pointer' : 'auto';

      const isClickInfoOpen =
        featureInfo.length &&
        featureInfo.every(({ layer }) => !layer.get('showPopupOnHover'));

      // don't continue if there's a popup that was opened by click
      if (!isClickInfoOpen) {
        infos = infos
          .filter(
            ({ layer }) =>
              layer.get('showPopupOnHover') && layer.get('popupComponent'),
          )
          .map(info => {
            /* Apply showPopupOnHover function if defined to further filter features */
            const showPopupOnHover = info.layer.get('showPopupOnHover');
            if (typeof showPopupOnHover === 'function') {
              return {
                ...info,
                features: info.layer.get('showPopupOnHover')(info.features),
              };
            }
            return info;
          });

        if (!Map.isSameFeatureInfo(featureInfo, infos)) {
          dispatchSetFeatureInfo(infos);
        }
      }
    });
  }

  onSingleClick(evt) {
    const { coordinate } = evt;
    const {
      layerService,
      dispatchSetFeatureInfo,
      dispatchSetSearchOpen,
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
      dispatchSetFeatureInfo(infos);

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
    dispatchSetSearchOpen(false);
  }

  // eslint-disable-next-line class-methods-use-this
  increaseFontSize2(mbMap, delta) {
    mbMap.getStyle().layers.forEach(layer => {
      try {
        // console.log(layer.id, layer);
        const size = mbMap.getLayoutProperty(layer.id, 'text-size');
        if (size && !size.stops && !Array.isArray(size)) {
          const newSize = size + delta;
          // console.log(size, newSize);
          mbMap.setLayoutProperty(layer.id, 'text-size', newSize);
        } else if (size && size.stops && !Array.isArray(size)) {
          const newStops = {
            stops: size.stops.map(stop => {
              return [stop[0], stop[1] + delta];
            }),
          };
          // console.log('stops', size, newStops);
          mbMap.setLayoutProperty(layer.id, 'text-size', newStops);
        } else if (
          size &&
          !size.stops &&
          Array.isArray(size) &&
          size[0] === 'match'
        ) {
          const newMatch = [...size].map((match, idx) => {
            if ((idx !== 0 && idx % 2 === 0) || idx === size.length - 1) {
              return match + delta;
            }
            return match;
          });
          // console.log('match', size, newMatch);
          mbMap.setLayoutProperty(layer.id, 'text-size', newMatch);
        } else if (size !== 0) {
          // console.log('others', size, layer);
          mbMap.setLayoutProperty(layer.id, 'text-size', 16 + delta);
        }
      } catch (e) {
        // console.log(layer.id, layer);
      }
    });
  }

  increaseFontSize(delta = 1) {
    const { layerService } = this.props;
    const baseLayer = (layerService
      .getBaseLayers()
      .filter(layer => layer.getVisible()) || [])[0];
    if (baseLayer) {
      // console.log('idle', baseLayer.mapboxLayer.mbMap);
      if (
        !baseLayer.mapboxLayer.mbMap ||
        !baseLayer.mapboxLayer.mbMap.loaded()
      ) {
        this.currentMbMap = baseLayer.mapboxLayer.mbMap;
        // console.log('idle', baseLayer.mapboxLayer.mbMap);
        baseLayer.mapboxLayer.mbMap.once('idle', () => {
          // console.log('idle');
          this.increaseFontSize2(baseLayer.mapboxLayer.mbMap, delta);
        });
      }
    }
  }

  render() {
    const {
      center,
      zoom,
      maxZoom,
      layers,
      map,
      resolution,
      extent,
      t,
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
          ariaLabel={t('Karte')}
          onMapMoved={evt => this.onMapMoved(evt)}
          viewOptions={{
            maxZoom,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '200px',
            margin: 'auto',
            top: '0',
            bottom: '0',
            height: '200px',
          }}
        >
          <button
            type="button"
            style={{
              width: '100px',
              height: '100px',
            }}
            onClick={() => {
              this.increaseFontSize2(this.currentMbMap, -5);
            }}
          >
            -
          </button>
          <button
            type="button"
            style={{
              width: '100px',
              height: '100px',
            }}
            onClick={() => {
              this.increaseFontSize2(this.currentMbMap, 5);
            }}
          >
            +
          </button>
        </div>
      </>
    );
  }
}

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

const mapStateToProps = state => ({
  featureInfo: state.app.featureInfo,
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
  dispatchSetFeatureInfo: setFeatureInfo,
  dispatchSetSearchOpen: setSearchOpen,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(Map);
