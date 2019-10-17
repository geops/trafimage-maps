import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/layers/Layer';
import Map from 'ol/Map';
import { unByKey } from 'ol/Observable';
import TrafimageRasterLayer from '../../layers/TrafimageRasterLayer';
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
  map: PropTypes.instanceOf(Map).isRequired,
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
    const { dispatchSetClickedFeatureInfo, layerService, map } = this.props;
    this.updateLayers(this.topic.layers);

    this.singleclickKey = map.on('singleclick', e => {
      const infoPromises = layerService
        .getLayersAsFlatArray()
        .filter(l => l.getVisible())
        .map(l => l.getFeatureInfoAtCoordinate(e.coordinate));

      Promise.all(infoPromises).then(featureInfos => {
        const infos = featureInfos.filter(i => i && i.features.length);
        dispatchSetClickedFeatureInfo(infos);
      });
    });
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

      searchService.setSearches(activeTopic.searches);
      searchService.setSearchProps({
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
