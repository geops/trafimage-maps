import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/layers/Layer';
import { unByKey } from 'ol/Observable';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import TrafimageTileserverLayer from '../../layers/TrafimageTileserverLayer';
import HandicapLayer from '../../layers/HandicapLayer';
import TOPIC_CONF from '../../config/topics';
import { setLayers } from '../../model/map/actions';
import {
  setActiveTopic,
  setTopics,
  setClickedFeatureInfo,
} from '../../model/app/actions';
import SearchService from '../Search/SearchService';

const propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeTopic: PropTypes.shape(),
  activeTopicKey: PropTypes.string,
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  searchService: PropTypes.instanceOf(SearchService).isRequired,
  cartaroUrl: PropTypes.string,
  tileserverUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetTopics: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
};

const defaultProps = {
  activeTopicKey: null,
  activeTopic: null,
  baseLayers: null,
  layers: null,
  cartaroUrl: null,
  tileserverUrl: null,
  vectorTilesKey: null,
  vectorTilesUrl: null,
};

class TopicLoader extends Component {
  static openLinkTopic(topic) {
    window.location.href = topic.linkUrl;
  }

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

    if (this.topic.linkUrl) {
      TopicLoader.openLinkTopic(this.topic);
    }

    dispatchSetActiveTopic(this.topic);
    dispatchSetTopics(topics);
  }

  componentDidMount() {
    this.updateLayers(this.topic.layers);
  }

  componentDidUpdate(prevProps) {
    const {
      activeTopic,
      dispatchSetClickedFeatureInfo,
      searchService,
    } = this.props;

    if (activeTopic !== prevProps.activeTopic) {
      if (activeTopic.linkUrl) {
        TopicLoader.openLinkTopic(activeTopic);
      }
      this.updateLayers(activeTopic.layers);

      searchService.setSearches(activeTopic.searches || []);
      searchService.setSearchesProps({
        activeTopic,
        dispatchSetClickedFeatureInfo,
      });
    }
  }

  componentWillUnmount() {
    unByKey(this.singleclickKey);
  }

  updateLayers(topicLayers) {
    const {
      layerService,
      layers,
      baseLayers,
      dispatchSetLayers,
      cartaroUrl,
      tileserverUrl,
      vectorTilesKey,
      vectorTilesUrl,
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
      if (flatLayers[i] instanceof TrafimageMapboxLayer) {
        flatLayers[i].setStyleConfig(vectorTilesUrl, vectorTilesKey);
      } else if (flatLayers[i] instanceof TrafimageTileserverLayer) {
        flatLayers[i].setTileserverUrl(tileserverUrl);
      } else if (flatLayers[i] instanceof HandicapLayer) {
        flatLayers[i].setCartaroUrl(cartaroUrl);
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
  dispatchSetLayers: setLayers,
  dispatchSetTopics: setTopics,
  dispatchSetClickedFeatureInfo: setClickedFeatureInfo,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopicLoader);
