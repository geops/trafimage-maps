import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { touchOnly } from "ol/events/condition";
import { Layer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import OLMap from "ol/Map";
import BasicMap from "react-spatial/components/BasicMap";
import MapAccessibility from "../MapAccessibility";
import { setResolution, setCenter, setZoom } from "../../model/map/actions";
import {
  setFeatureInfo,
  setSearchOpen,
  updateDrawEditLink,
} from "../../model/app/actions";
import Copyright from "../Copyright/Copyright";
import NoDragPanWarning from "../NoDragPanWarning";
import NoMouseWheelWarning from "../NoMouseWheelWarning";
import getFeatureInfoAtCoordinate from "../../utils/getFeatureInfoAtCoordinate";
import getQueryableLayers from "../../utils/getQueryableLayers";

const propTypes = {
  dispatchHtmlEvent: PropTypes.func,

  // mapStateToProps
  featureInfo: PropTypes.arrayOf(PropTypes.shape()),
  center: PropTypes.arrayOf(PropTypes.number),
  extent: PropTypes.arrayOf(PropTypes.number),
  maxExtent: PropTypes.arrayOf(PropTypes.number),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  map: PropTypes.instanceOf(OLMap).isRequired,
  activeTopic: PropTypes.shape().isRequired,
  resolution: PropTypes.number,
  zoom: PropTypes.number,
  showPopups: PropTypes.bool,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetResolution: PropTypes.func.isRequired,
  dispatchSetZoom: PropTypes.func.isRequired,
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchOpen: PropTypes.func.isRequired,
  dispatchUpdateDrawEditlink: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  // mapStateToProps
  center: [925472, 5920000],
  featureInfo: [],
  layers: [],
  extent: undefined,
  maxExtent: undefined,
  resolution: undefined,
  zoom: 9,
  maxZoom: 20,
  minZoom: 2,
  dispatchHtmlEvent: () => {},
  showPopups: true,
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

    const firstFeatures = first.map((f) => f.features).flat();
    const secondFeatures = second.map((s) => s.features).flat();

    if (firstFeatures.length !== secondFeatures.length) {
      return false;
    }

    return firstFeatures.every((f, i) => secondFeatures[i] === f);
  }

  componentDidMount() {
    const { map, dispatchHtmlEvent } = this.props;
    this.onPointerMoveRef = map.on("pointermove", (e) => this.onPointerMove(e));
    this.onSingleClickRef = map.on("singleclick", (e) => this.onSingleClick(e));
    dispatchHtmlEvent(new CustomEvent("load"));
    map?.updateSize();
  }

  componentDidUpdate() {
    const { map } = this.props;
    // VIP: Without the map stays white.
    map?.updateSize();
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
      dispatchUpdateDrawEditlink,
    } = this.props;
    const newResolution = evt.map.getView().getResolution();
    const newZoom = evt.map.getView().getZoom();
    const newCenter = evt.map.getView().getCenter();

    if (zoom !== newZoom) {
      dispatchSetZoom(newZoom);
      dispatchUpdateDrawEditlink();
    }

    if (resolution !== newResolution) {
      dispatchSetResolution(newResolution);
      dispatchUpdateDrawEditlink();
    }

    if (center[0] !== newCenter[0] || center[1] !== newCenter[1]) {
      dispatchSetCenter(newCenter);
      dispatchUpdateDrawEditlink();
    }

    // Propagate the ol event to the WebComponent
    const htmlEvent = new CustomEvent(evt.type, { detail: evt });
    dispatchHtmlEvent(htmlEvent);
  }

  onPointerMove(evt) {
    const { map, coordinate } = evt;
    const {
      layers,
      featureInfo,
      dispatchSetFeatureInfo,
      showPopups,
      activeTopic,
    } = this.props;

    if (document.activeElement !== map.getTargetElement()) {
      map.getTargetElement().focus();
    }

    if (
      touchOnly(evt) ||
      !showPopups ||
      (!activeTopic?.elements?.popup && !activeTopic.enableFeatureClick) ||
      map.getView().getInteracting() ||
      map.getView().getAnimating()
    ) {
      return;
    }

    const queryableLayers = getQueryableLayers("pointermove", layers, map);
    getFeatureInfoAtCoordinate(coordinate, queryableLayers).then((newInfos) => {
      // If the featureInfos contains one from a priority layer.
      // We display only these featureInfos.
      // See DirektVerbindungen layers for an example.
      const priorityLayersInfos = newInfos.filter(
        ({ features, layer }) =>
          features.length && layer.get("priorityFeatureInfo"),
      );
      const hasPriorityLayer = priorityLayersInfos.length;

      const otherLayersInfos = newInfos.filter(
        ({ features, layer }) =>
          features.length && !layer.get("priorityFeatureInfo"),
      );

      let infos = hasPriorityLayer ? priorityLayersInfos : otherLayersInfos;

      // We highlight the features already displayed in the feature information
      const layerAlreadyHighlighted = [];
      featureInfo?.forEach(({ layer, features }) => {
        const featuresToHighlight = [
          ...features,
          ...(infos.find((info) => info.layer === layer)?.features || []),
        ];
        layer?.highlight?.(featuresToHighlight);
        layerAlreadyHighlighted.push(layer);
      });

      // We highlight the features under the mouse
      infos.forEach(({ layer, features }) => {
        if (!layerAlreadyHighlighted.includes(layer)) {
          layer?.highlight?.(features);
        }
      });

      map.getTarget().style.cursor = infos.length ? "pointer" : "auto";

      const shouldNotSetInfoOnHover =
        featureInfo.length &&
        featureInfo.every(({ layer }) =>
          layer.get("disableSetFeatureInfoOnHover"),
        );

      const clickInfoOpen =
        featureInfo.length &&
        featureInfo.every(({ layer }) => {
          return layer.get("popupComponent") && !layer.get("showPopupOnHover");
        });

      // don't continue if there's a popup that was opened by click
      if (!clickInfoOpen && !shouldNotSetInfoOnHover) {
        infos = infos
          .filter(
            ({ layer }) =>
              layer.get("showPopupOnHover") && layer.get("popupComponent"),
          )
          .map((info) => {
            /* Apply showPopupOnHover function if defined to further filter features */
            const showPopupOnHover = info.layer.get("showPopupOnHover");
            if (typeof showPopupOnHover === "function") {
              return {
                ...info,
                features: info.layer.get("showPopupOnHover")(info.features),
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
    const { coordinate, map } = evt;
    const {
      dispatchSetFeatureInfo,
      dispatchSetSearchOpen,
      dispatchHtmlEvent,
      activeTopic,
      showPopups,
      layers,
    } = this.props;

    // If there is no popup to display just ignore the click event.
    if (
      !showPopups ||
      (!activeTopic?.elements?.popup && !activeTopic.enableFeatureClick)
    ) {
      return;
    }

    const queryableLayers = getQueryableLayers("singleclick", layers, map);
    getFeatureInfoAtCoordinate(coordinate, queryableLayers).then(
      (featureInfos) => {
        // If the featureInfos contains one from a priority layer.
        // We display only these featureInfos.
        // See DirektVerbindungen layers for an example.
        const priorityLayersInfos = featureInfos.filter(
          ({ features, layer }) =>
            features.length && layer.get("priorityFeatureInfo"),
        );
        const hasPriorityLayer = priorityLayersInfos.length;

        const otherLayersInfos = featureInfos.filter(
          ({ features, layer }) =>
            features.length && !layer.get("priorityFeatureInfo"),
        );

        // Clear the highlight style when there is priority layers
        if (hasPriorityLayer) {
          otherLayersInfos.forEach(({ layer }) => {
            layer?.highlight?.([]);
          });
        }

        // Display only info of layers with a popup defined.
        const infos = (
          hasPriorityLayer ? priorityLayersInfos : otherLayersInfos
        )
          .reverse()
          .filter(({ layer }) => {
            return (
              (layer.get("popupComponent") && !layer.get("showPopupOnHover")) ||
              activeTopic.enableFeatureClick
            );
          });

        // Dispatch only infos with features found.
        dispatchSetFeatureInfo(infos);

        // Propagate the infos clicked to the WebComponent
        dispatchHtmlEvent(
          new CustomEvent("getfeatureinfo", {
            detail: infos,
          }),
        );
      },
    );

    // Propagate the ol event to the WebComponent
    const htmlEvent = new CustomEvent(evt.type, {
      detail: evt,
    });
    dispatchHtmlEvent(htmlEvent);
    dispatchSetSearchOpen(false);
  }

  render() {
    const {
      center,
      zoom,
      maxZoom,
      minZoom,
      layers,
      map,
      resolution,
      maxExtent,
      extent,
      t,
      activeTopic,
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
          ariaLabel={t("Karte")}
          onMapMoved={(evt) => this.onMapMoved(evt)}
          viewOptions={{
            maxZoom,
            minZoom,
            extent: maxExtent,
            constrainOnlyCenter: activeTopic.constrainOnlyCenter,
          }}
          tabIndex={0}
        />
        <MapAccessibility layers={layers} map={map} />
        <Copyright />
        <NoDragPanWarning />
        <NoMouseWheelWarning />
      </>
    );
  }
}

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  featureInfo: state.app.featureInfo,
  layers: state.map.layers,
  center: state.map.center,
  extent: state.map.extent,
  resolution: state.map.resolution,
  zoom: state.map.zoom,
  maxExtent: state.map.maxExtent,
  maxZoom: state.map.maxZoom,
  minZoom: state.map.minZoom,
  showPopups: state.app.showPopups,
  activeTopic: state.app.activeTopic,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetResolution: setResolution,
  dispatchSetZoom: setZoom,
  dispatchSetFeatureInfo: setFeatureInfo,
  dispatchSetSearchOpen: setSearchOpen,
  dispatchUpdateDrawEditlink: updateDrawEditLink,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(Map);
