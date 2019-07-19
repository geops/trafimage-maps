import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import TrafimageRasterLayer from '../../layers/TrafimageRasterLayer';
import TOPIC_CONF from '../../appConfig/topics';
import { setActiveTopic, setClickedFeatureInfo } from '../../model/app/actions';
import { setLayers } from '../../model/map/actions';

const propTypes = {
  topic: PropTypes.string.isRequired,
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  token: PropTypes.string,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
};

const defaultProps = {
  baseLayers: null,
  layers: null,
  token: null,
};

class TopicLoader extends Component {
  constructor(props) {
    super(props);
    const { dispatchSetActiveTopic, topic } = this.props;
    dispatchSetActiveTopic(TOPIC_CONF[topic]);
  }

  componentDidMount() {
    const {
      dispatchSetLayers,
      baseLayers,
      layers,
      layerService,
      topic,
      token,
    } = this.props;

    const appLayers = TOPIC_CONF[topic].layers;
    const bl = baseLayers || appLayers.filter(l => l.getIsBaseLayer());
    const tl = layers || appLayers.filter(l => !l.getIsBaseLayer());
    const newLayers = [...bl, ...tl];

    layerService.setLayers(newLayers);
    dispatchSetLayers(newLayers);

    for (let i = 0; i < newLayers.length; i += 1) {
      if (newLayers[i] instanceof VectorLayer) {
        newLayers[i].onClick(this.onClick.bind(this));
      }
    }

    if (token) {
      newLayers
        .filter(l => l instanceof TrafimageRasterLayer)
        .forEach(l => l.setToken(token));
    }
  }

  onClick(features, layer, event) {
    const { dispatchSetClickedFeatureInfo } = this.props;

    dispatchSetClickedFeatureInfo({
      features,
      layer,
      event,
    });
  }

  render() {
    return null;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetClickedFeatureInfo: setClickedFeatureInfo,
  dispatchSetLayers: setLayers,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopicLoader);
