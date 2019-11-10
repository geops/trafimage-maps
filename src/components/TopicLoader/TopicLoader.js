import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
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
  activeTopicKey: PropTypes.string,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  cartaroUrl: PropTypes.string,
  geoServerUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,

  // mapStateToProps
  activeTopic: PropTypes.shape(),

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetTopics: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchService: PropTypes.func.isRequired,
};

const defaultProps = {
  activeTopic: null,
  activeTopicKey: null,
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
      dispatchSetActiveTopic,
      dispatchSetTopics,
      activeTopicKey,
      topics,
    } = this.props;

    this.topic =
      topics && (topics.find(t => t.key === activeTopicKey) || topics[0]);

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
      this.topic = topics.find(t => t.active) || topics[0];
      dispatchSetActiveTopic(this.topic);
    }
  }

  updateServices(topic) {
    const {
      dispatchSetClickedFeatureInfo,
      dispatchSetSearchService,
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
      dispatchSetClickedFeatureInfo,
    });
    dispatchSetSearchService(newSearchService);
  }

  updateLayers(topicLayers) {
    const {
      layerService,
      dispatchSetLayers,
      cartaroUrl,
      geoServerUrl,
      vectorTilesKey,
      vectorTilesUrl,
    } = this.props;

    layerService.setLayers(topicLayers);
    const flatLayers = layerService.getLayersAsFlatArray();
    dispatchSetLayers(topicLayers);

    for (let i = 0; i < flatLayers.length; i += 1) {
      if (flatLayers[i].setGeoServerWMSUrl) {
        flatLayers[i].setGeoServerWMSUrl(`${geoServerUrl}/service/wms`);
      } else if (flatLayers[i].setStyleConfig) {
        flatLayers[i].setStyleConfig(vectorTilesUrl, vectorTilesKey);
      } else if (flatLayers[i].setCartaroUrl) {
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
