import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import TrafimageRasterLayer from '../../layers/TrafimageRasterLayer';
import TOPIC_CONF from '../../config/topics';
import { setLayers } from '../../model/map/actions';
import {
  setActiveTopic,
  setTopics,
  setClickedFeatureInfo,
} from '../../model/app/actions';

const propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeTopic: PropTypes.shape(),
  activeTopicKey: PropTypes.string,
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  apiKey: PropTypes.string,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetTopics: PropTypes.func.isRequired,
};

const defaultProps = {
  activeTopicKey: null,
  activeTopic: null,
  baseLayers: null,
  layers: null,
  apiKey: null,
};

class TopicLoader extends Component {
  constructor(props) {
    super(props);
    const {
      activeTopicKey,
      dispatchSetActiveTopic,
      dispatchSetTopics,
      topics,
    } = this.props;

    this.topic = activeTopicKey
      ? TOPIC_CONF.find(t => t.key === activeTopicKey)
      : topics[0];

    dispatchSetActiveTopic(this.topic);
    dispatchSetTopics(topics);
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

    if (!features.length) {
      return;
    }

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
      apiKey,
    } = this.props;

    const newLayers = [
      ...(baseLayers || []),
      ...topicLayers,
      ...(layers || []),
    ];

    layerService.setLayers(newLayers);
    const flatLayers = layerService.getLayersAsFlatArray();
    dispatchSetLayers(newLayers);

    for (let i = 0; i < flatLayers.length; i += 1) {
      if (apiKey && flatLayers[i] instanceof TrafimageRasterLayer) {
        flatLayers[i].setApiKey(apiKey);
      }

      if (flatLayers[i] instanceof VectorLayer) {
        flatLayers[i].onClick(this.onClick.bind(this));
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
  dispatchSetTopics: setTopics,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopicLoader);
