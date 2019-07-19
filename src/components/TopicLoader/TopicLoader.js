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
  activeTopic: PropTypes.shape(),
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
  activeTopic: null,
  baseLayers: null,
  layers: null,
  token: null,
};

class TopicLoader extends Component {
  constructor(props) {
    super(props);
    const { dispatchSetActiveTopic, topic } = this.props;
    this.topic = TOPIC_CONF.find(t => t.key === topic);
    dispatchSetActiveTopic(this.topic);
  }

  componentDidMount() {
    this.updateLayers(this.topic.layers);
  }

  componentDidUpdate(prevProps) {
    const { activeTopic } = this.props;

    if (activeTopic !== prevProps.activeTopic) {
      this.updateLayers(activeTopic.layers);
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

  updateLayers(topicLayers) {
    const {
      layerService,
      layers,
      baseLayers,
      dispatchSetLayers,
      token,
    } = this.props;

    const newLayers = [
      ...(baseLayers || []),
      ...topicLayers,
      ...(layers || []),
    ];

    layerService.setLayers(newLayers);
    dispatchSetLayers(newLayers);

    for (let i = 0; i < newLayers.length; i += 1) {
      if (token && newLayers[i] instanceof TrafimageRasterLayer) {
        newLayers[i].setToken(token);
      }

      if (newLayers[i] instanceof VectorLayer) {
        newLayers[i].onClick(this.onClick.bind(this));
      }
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
});

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
