import React, { Component } from 'react';
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
import TopicElements from '../TopicElements';
import layerHelper from '../../layers/layerHelper';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  apiKey: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeTopic: PropTypes.shape(),
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
  history: null,
  activeTopic: null,
  cartaroUrl: null,
  geoServerUrl: null,
  vectorTilesKey: null,
  vectorTilesUrl: null,
};

class TopicLoader extends Component {
  static openLinkTopic(topic) {
    window.location.href = topic.linkUrl;
  }

  componentDidMount() {
    const { dispatchSetTopics, dispatchSetActiveTopic, topics } = this.props;
    const activeTopic = topics.find(topic => topic.active) || topics[0];
    activeTopic.active = true; // in case we fall back to the first topic.
    dispatchSetTopics(topics);
    dispatchSetActiveTopic(activeTopic);
    this.updateServices(activeTopic);
  }

  componentDidUpdate(prevProps) {
    const { activeTopic, topics, dispatchSetActiveTopic } = this.props;
    if (activeTopic !== prevProps.activeTopic) {
      this.updateServices(activeTopic);
    }

    if (topics !== prevProps.topics) {
      const newActiveTopic = topics.find(topic => topic.active) || topics[0];
      dispatchSetActiveTopic(newActiveTopic);
      this.updateServices(newActiveTopic);
    }
  }

  updateServices(activeTopic) {
    const {
      apiKey,
      dispatchSetClickedFeatureInfo,
      dispatchSetSearchService,
    } = this.props;

    if (!activeTopic) {
      this.updateLayers([]);
      dispatchSetSearchService();
    }

    if (activeTopic.linkUrl) {
      TopicLoader.openLinkTopic(activeTopic);
      return;
    }

    this.updateLayers(activeTopic.layers);

    const newSearchService = new SearchService(layerHelper.highlightStyle);
    newSearchService.setSearches(activeTopic.searches || []);
    newSearchService.setApiKey(apiKey);
    newSearchService.setSearchesProps({
      activeTopic,
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
      if (flatLayers[i].setGeoServerUrl) {
        flatLayers[i].setGeoServerUrl(geoServerUrl);
      } else if (flatLayers[i].setGeoServerWMSUrl) {
        flatLayers[i].setGeoServerWMSUrl(`${geoServerUrl}/service/wms`);
      } else if (flatLayers[i].setStyleConfig) {
        flatLayers[i].setStyleConfig(vectorTilesUrl, vectorTilesKey);
      } else if (flatLayers[i].setCartaroUrl) {
        flatLayers[i].setCartaroUrl(cartaroUrl);
      }
    }
  }

  render() {
    const { history } = this.props;
    return <TopicElements history={history} />;
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  layerService: state.app.layerService,
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicLoader);
