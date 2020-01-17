import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import LayerService from 'react-spatial/LayerService';
import { setLayers } from '../../model/map/actions';
import {
  setActiveTopic,
  setTopics,
  setClickedFeatureInfo,
  setSearchService,
  fetchPermissions,
} from '../../model/app/actions';
import SearchService from '../Search/SearchService';
import TopicElements from '../TopicElements';
import redirectHelper from '../../utils/redirectHelper';

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
  appBaseUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetTopics: PropTypes.func.isRequired,
  dispatchSetClickedFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchService: PropTypes.func.isRequired,
  dispatchFetchPermissions: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  history: null,
  activeTopic: null,
  cartaroUrl: null,
  appBaseUrl: null,
  vectorTilesKey: null,
  vectorTilesUrl: null,
};

class TopicLoader extends Component {
  componentDidMount() {
    const { dispatchFetchPermissions } = this.props;
    dispatchFetchPermissions();
    this.loadTopics();
  }

  componentDidUpdate(prevProps) {
    const {
      activeTopic,
      topics,
      permissions,
      apiKey,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
    } = this.props;

    if (activeTopic !== prevProps.activeTopic) {
      this.updateServices(activeTopic);
    }

    if (permissions !== prevProps.permissions || topics !== prevProps.topics) {
      this.loadTopics();
    }

    if (
      vectorTilesUrl !== prevProps.vectorTilesUrl ||
      apiKey !== prevProps.apiKey ||
      vectorTilesKey !== prevProps.vectorTilesKey ||
      vectorTilesUrl !== prevProps.vectorTilesUrl ||
      cartaroUrl !== prevProps.cartaroUrl ||
      appBaseUrl !== prevProps.appBaseUrl
    ) {
      this.updateServices(activeTopic);
    }
  }

  loadTopics() {
    const {
      topics,
      permissions,
      dispatchSetTopics,
      dispatchSetActiveTopic,
    } = this.props;

    const visibleTopics = topics.filter(
      t => !t.permissions || permissions.includes(t.permission),
    );

    const activeTopic = visibleTopics.find(topic => topic.active) || topics[0];
    activeTopic.active = true; // in case we fall back to the first topic.
    dispatchSetTopics(visibleTopics);
    dispatchSetActiveTopic(activeTopic);
    this.updateServices(activeTopic);
  }

  updateServices(activeTopic) {
    const {
      t,
      apiKey,
      appBaseUrl,
      layerService,
      dispatchSetClickedFeatureInfo,
      dispatchSetSearchService,
    } = this.props;

    if (!activeTopic) {
      this.updateLayers([]);
      dispatchSetSearchService();
    }

    if (activeTopic.redirect) {
      // Redirection to the old wkp
      redirectHelper.redirect(appBaseUrl, activeTopic.key, {
        baselayers: '',
        layers: '',
      });
      return;
    }

    this.updateLayers(activeTopic.layers);

    const newSearchService = new SearchService();
    newSearchService.setSearches(activeTopic.searches || []);
    newSearchService.setApiKey(apiKey);
    newSearchService.setSearchesProps({
      t,
      activeTopic,
      layerService,
      dispatchSetClickedFeatureInfo,
    });
    dispatchSetSearchService(newSearchService);
  }

  updateLayers(topicLayers) {
    const {
      layerService,
      dispatchSetLayers,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
    } = this.props;

    const [currentBaseLayer] = layerService
      .getLayersAsFlatArray()
      .filter(l => l.getIsBaseLayer() && l.getVisible());

    const visibleBaseLayers = topicLayers.filter(
      l => l.getIsBaseLayer() && l.getVisible(),
    );

    // Set the visible baselayer if need to be changed on topic change.
    if (visibleBaseLayers.indexOf(currentBaseLayer) === -1) {
      topicLayers
        .filter(l => l.getIsBaseLayer())
        .forEach((lay, idx) => {
          lay.setVisible(idx === 0);
        });
    }

    layerService.setLayers(topicLayers);
    const flatLayers = layerService.getLayersAsFlatArray();
    dispatchSetLayers(topicLayers);

    for (let i = 0; i < flatLayers.length; i += 1) {
      if (flatLayers[i].setGeoServerUrl) {
        flatLayers[i].setGeoServerUrl(`${appBaseUrl}/geoserver/trafimage/ows`);
      } else if (flatLayers[i].setGeoServerWMSUrl) {
        flatLayers[i].setGeoServerWMSUrl(
          `${appBaseUrl}/geoserver/trafimage/ows/service/wms`,
        );
      } else if (flatLayers[i].setGeoJsonUrl) {
        flatLayers[i].setGeoJsonUrl(`${appBaseUrl}/service/gjc/ows`);
      } else if (flatLayers[i].setStyleConfig) {
        flatLayers[i].setStyleConfig(vectorTilesUrl, vectorTilesKey);
      } else if (flatLayers[i].setCartaroUrl) {
        flatLayers[i].setCartaroUrl(cartaroUrl);
      }
    }
  }

  render() {
    const { history, appBaseUrl } = this.props;
    return <TopicElements history={history} appBaseUrl={appBaseUrl} />;
  }
}

const mapStateToProps = state => ({
  activeTopic: state.app.activeTopic,
  layerService: state.app.layerService,
  permissions: state.app.permissions,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetLayers: setLayers,
  dispatchSetTopics: setTopics,
  dispatchSetClickedFeatureInfo: setClickedFeatureInfo,
  dispatchSetSearchService: setSearchService,
  dispatchFetchPermissions: fetchPermissions,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TopicLoader);
