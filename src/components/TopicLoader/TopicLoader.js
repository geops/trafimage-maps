import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/layers/Layer';
import TrafimageGeoServerWMSLayer from '../../layers/TrafimageGeoServerWMSLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import HandicapLayer from '../../layers/HandicapLayer';
import { setLayers } from '../../model/map/actions';
import {
  setActiveTopic,
  setTopics,
  setClickedFeatureInfo,
  setSearchService,
} from '../../model/app/actions';
import SearchService from '../Search/SearchService';
import layerHelper from '../../layers/layerHelper';

const propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeTopic: PropTypes.shape(),
  activeTopicKey: PropTypes.string,
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  cartaroUrl: PropTypes.string,
  geoServerUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetTopics: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchService: PropTypes.func.isRequired,
};

const defaultProps = {
  activeTopicKey: null,
  activeTopic: null,
  baseLayers: null,
  layers: null,
  cartaroUrl: null,
  geoServerUrl: null,
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
      ? topics.find(t => t.key === activeTopicKey)
      : topics && topics[0];
    if (!this.topic) {
      return;
    }

    if (this.topic.linkUrl) {
      TopicLoader.openLinkTopic(this.topic.linkUrl);
    }
    dispatchSetActiveTopic(this.topic);
    dispatchSetTopics(topics);
  }

  componentDidMount() {
    if (this.topic) {
      this.updateServices(this.topic);
    }
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, topics, dispatchSetActiveTopic } = this.props;

    if (activeTopic && activeTopic !== prevProps.activeTopic) {
      this.updateServices(activeTopic);
    }

    if (topics !== prevProps.topics && topics && topics.length) {
      dispatchSetActiveTopic(topics[0]);
    }
  }

  updateServices(topic) {
    const {
      dispatchSetClickedFeatureInfo,
      dispatchSetSearchService,
      activeTopic,
    } = this.props;
    if (topic.linkUrl) {
      TopicLoader.openLinkTopic(topic);
      return;
    }
    this.updateLayers(topic.layers);

    const newSearchService = new SearchService(layerHelper.highlightStyle);
    newSearchService.setSearches(topic.searches || []);
    newSearchService.setSearchesProps({
      topic,
      activeTopic,
      dispatchSetClickedFeatureInfo,
    });
    dispatchSetSearchService(newSearchService);
  }

  updateLayers(topicLayers) {
    const {
      layerService,
      layers,
      baseLayers,
      dispatchSetLayers,
      cartaroUrl,
      geoServerUrl,
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
      if (flatLayers[i] instanceof TrafimageGeoServerWMSLayer) {
        flatLayers[i].setGeoServerWMSUrl(`${geoServerUrl}/service/wms`);
      } else if (flatLayers[i] instanceof TrafimageMapboxLayer) {
        flatLayers[i].setStyleConfig(vectorTilesUrl, vectorTilesKey);
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
  dispatchSetSearchService: setSearchService,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopicLoader);
