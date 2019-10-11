import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import OLMap from 'ol/Map';
import { containsExtent } from 'ol/extent';
import LayerService from 'react-spatial/LayerService';

const propTypes = {
  focusClass: PropTypes.string,
  refDialog: PropTypes.object,
  refFooter: PropTypes.object,
  refBaseLayerToggler: PropTypes.object,

  // mapStateToProps
  dialogVisible: PropTypes.string,
  selectedForInfos: PropTypes.object,
  map: PropTypes.instanceOf(OLMap).isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  resolution: PropTypes.number,
  zoom: PropTypes.number,

  // mapDispatchToProps
};

const defaultProps = {
  focusClass: 'wkp-bf-focus',
  refDialog: undefined,
  refFooter: undefined,
  refBaseLayerToggler: undefined,
  dialogVisible: null,
  center: [0, 0],
  resolution: undefined,
  zoom: 9,

  // mapStateToProps
  selectedForInfos: null,
};

const findNode = refNode => {
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(refNode.current);
};

let tabFeature = false;
let featLayer = null;
let visibleLayers = [];
let visibleFeatures = [];
let featureIndex = 0;

function BarrierFree({
  focusClass,
  refDialog,
  refFooter,
  refBaseLayerToggler,
  layerService,
  center,
  resolution,
  zoom,
  map,
  dialogVisible,
  selectedForInfos,
}) {
  let timeout;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const focusRef = ref => {
    const node = findNode(ref);
    if (!node) {
      return;
    }
    const nodeToFocus = node.querySelector('[tabindex="0"]');
    if (!nodeToFocus) {
      return;
    }
    nodeToFocus.focus();

    // First time we focus a feature, the class name is not apply properly using classList
    timeout = window.setTimeout(() => {
      nodeToFocus.classList.add(focusClass);
    }, 50);
  };

  const focusFeature = () => {
    const featToFocus = visibleFeatures[featureIndex];
    featLayer = featToFocus ? featToFocus.get('layerRef') : null;
    if (featLayer) {
      tabFeature = true;
      featLayer.clickedFeature = featToFocus;
      featLayer.olLayer.changed();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setVisibleFeats = () => {
    visibleLayers = layerService
      .getLayersAsFlatArray()
      .reverse()
      .filter(l => !l.getIsBaseLayer() && l.getVisible());

    const mapExtent = map.getView().calculateExtent(map.getSize());

    let visFeats = [];
    visibleLayers.forEach(l => {
      if (l && l.olLayer) {
        const features = l.olLayer.getSource().getFeatures();
        if (features.length > 0) {
          features.forEach(f => f.set('layerRef', l));
          const visibleFeats = features.filter(feat =>
            containsExtent(mapExtent, feat.getGeometry().getExtent()),
          );
          visFeats = visFeats.concat(visibleFeats);
        }
      }
    });
    visFeats.sort((a, b) => {
      if (
        a.getGeometry().getCoordinates()[0] <
        b.getGeometry().getCoordinates()[0]
      ) {
        return -1;
      }
      return 1;
    });
    visibleFeatures = visFeats;
  };

  const onKeyUp = (e, forceTarget) => {
    const forward = !e.shiftKey;
    // Remov bf class from all the document
    document.querySelectorAll(`.${focusClass}`).forEach(elt => {
      elt.classList.remove(focusClass);
    });
    if (!tabFeature) {
      if (forceTarget) {
        forceTarget.classList.add(focusClass);
      } else {
        e.target.focus();
        e.target.classList.add(focusClass);
      }
    } else {
      if (forward) {
        featureIndex += 1;
      } else {
        featureIndex -= 1;
      }
      if (forward && featureIndex >= visibleFeatures.length) {
        // Remove feature highlight
        featLayer.clickedFeature = null;
        featLayer.olLayer.changed();

        // Focus on 1st footer item
        const nodeToFocus = findNode(refFooter).querySelector('a');
        nodeToFocus.focus();
        timeout = window.setTimeout(() => {
          nodeToFocus.classList.add(focusClass);
        }, 50);

        tabFeature = false;
      } else if (!forward && featureIndex <= -1) {
        // Remove feature highlight
        featLayer.clickedFeature = null;
        featLayer.olLayer.changed();
        // Focus on element before barrierfree
        // TODO: if refBaseLayerToggler else zoom out
        const baseLayerElems = findNode(refBaseLayerToggler).querySelectorAll(
          '[tabindex="0"]',
        );
        const nodeToFocus = baseLayerElems[baseLayerElems.length - 1];
        nodeToFocus.focus();
        timeout = window.setTimeout(() => {
          nodeToFocus.classList.add(focusClass);
        }, 50);

        tabFeature = false;
        featureIndex = 0;
      } else {
        focusFeature();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  const onDocumentClick = () => {
    // Remov bf class from all the document
    document.querySelectorAll(`.${focusClass}`).forEach(elt => {
      elt.classList.remove(focusClass);
    });
    // Reset values to default
    tabFeature = false;
  };

  const onDocumentKeyUp = e => {
    if (e.keyCode === 9) {
      onKeyUp(e);
    }
    if ([38, 40].includes(e.keyCode)) {
      onKeyUp(e, document.activeElement);
    }
  };

  const onDocumentKeyDown = e => {
    if (e.keyCode === 9) {
      onKeyUp(e);
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  };

  /**
   * When the focus happens on the barrierfree element
   * we hover the feature at the current index.
   */
  const onFocus = () => {
    setVisibleFeats();
    tabFeature = true;
    featureIndex = featureIndex || 0;
    focusFeature();
  };

  useEffect(() => {
    // ComponentDidMount
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyUp);
    document.addEventListener('keydown', onDocumentKeyDown);

    setVisibleFeats();
    // ComponentWillUnmount
    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keyup', onDocumentKeyUp);
      document.removeEventListener('keydown', onDocumentKeyDown);

      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setVisibleFeats();
  }, [center, zoom, resolution, layerService, setVisibleFeats]);

  useEffect(() => {
    if (dialogVisible) {
      focusRef(refDialog);
    }
  }, [selectedForInfos, dialogVisible, refDialog, focusRef]);

  return (
    <div
      role="button"
      label="barrierfree"
      tabIndex="0"
      onFocus={() => {
        onFocus();
      }}
    />
  );
}

const mapStateToProps = state => ({
  // app
  map: state.app.map,
  layerService: state.app.layerService,
  dialogVisible: state.app.dialogVisible,
  selectedForInfos: state.app.selectedForInfos,

  // map
  layers: state.map.layers,
  center: state.map.center,
  resolution: state.map.resolution,
  zoom: state.map.zoom,
});

const mapDispatchToProps = {};

BarrierFree.propTypes = propTypes;
BarrierFree.defaultProps = defaultProps;

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(BarrierFree);
