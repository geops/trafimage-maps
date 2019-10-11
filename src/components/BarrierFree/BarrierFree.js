import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
// import Feature from 'ol/Feature';
import LayerService from 'react-spatial/LayerService';

const propTypes = {
  focusClass: PropTypes.string,
  refDialog: PropTypes.object,

  // mapStateToProps
  dialogVisible: PropTypes.string,
  selectedForInfos: PropTypes.object,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  resolution: PropTypes.number,
  zoom: PropTypes.number,

  // mapDispatchToProps
};

const defaultProps = {
  focusClass: 'wkp-bf-focus',
  refDialog: undefined,
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

let featureIndex = 0;
// let tabFeature = false;

function BarrierFree({
  focusClass,
  refDialog,
  layerService,
  center,
  resolution,
  zoom,
  dialogVisible,
  selectedForInfos,
}) {
  let visibleLayers = [];
  let visibleFeatures = [];

  let timeout;

  const setVisibleFeats = () => {
    visibleLayers = layerService
      .getLayersAsFlatArray()
      .reverse()
      .filter(l => !l.getIsBaseLayer() && l.getVisible());

    let visFeats = [];
    visibleLayers.forEach(l => {
      if (l && l.olLayer) {
        const features = l.olLayer.getSource().getFeatures();
        if (features.length > 0) {
          visFeats = visFeats.concat(features);
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
    // Remov bf class from all the document
    document.querySelectorAll(`.${focusClass}`).forEach(elt => {
      // debugger;
      elt.classList.remove(focusClass);
    });

    if (forceTarget) {
      forceTarget.classList.add(focusClass);
    } else {
      e.target.focus();
      e.target.classList.add(focusClass);
    }
    /* else if (e.target.tagName === 'BODY') {
      // IE initially focus body,
      // needs to wait before setting the style. [IABPKLEIN-231]
      setTimeout(() => {
        document.activeElement.classList.add(focusClass);
      }, 10);
    }
    */
  };

  const onDocumentClick = () => {
    // Remov bf class from all the document
    document.querySelectorAll(`.${focusClass}`).forEach(elt => {
      elt.classList.remove(focusClass);
    });
    /*
    // Reset values to default
    this.tabFeature = false;
    this.featureIndex = null;
    */
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
    // eslint-disable-next-line no-console
    console.log('onFocus Features', visibleFeatures);

    featureIndex = featureIndex || 0;
    visibleLayers[0].clickedFeature = visibleFeatures[featureIndex];
    visibleLayers[0].olLayer.changed();
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
    // eslint-disable-next-line no-console
    console.log('useEffect - visibleLayers', visibleLayers, visibleFeatures);
  }, [center, zoom, resolution, layerService, visibleFeatures, visibleLayers]);

  useEffect(() => {
    if (dialogVisible) {
      const node = findNode(refDialog);
      if (!node) {
        return;
      }

      const nodeToFocus = node.querySelector('[tabindex="0"]');
      if (!nodeToFocus) {
        return;
      }
      /*
      node.removeEventListener('keydown', this.onPopupKeyDown);
      node.addEventListener('keydown', this.onPopupKeyDown);
      */
      nodeToFocus.focus();

      // First time we focus a feature, the class name is not apply properly
      // using classList
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = window.setTimeout(() => {
        nodeToFocus.classList.add(focusClass);
      }, 50);
    }
  }, [selectedForInfos, dialogVisible, refDialog]);

  // Ensure focus goes in dialog/menu/popup when opened

  return (
    <div
      role="button"
      label="barrierfree"
      /*
      ref={node => {
        this.refBarrierFree = node;
      }}
      */
      tabIndex="0"
      onFocus={() => {
        onFocus();
      }}
    />
  );
}

const mapStateToProps = state => ({
  // app
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
