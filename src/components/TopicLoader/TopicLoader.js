import { MatomoContext } from '@datapunt/matomo-tracker-react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import LayerService from 'react-spatial/LayerService';
import { Layer } from 'mobility-toolbox-js/ol';
import { setLayers } from '../../model/map/actions';
import {
  setActiveTopic,
  setTopics,
  setFeatureInfo,
  setSearchService,
} from '../../model/app/actions';
import SearchService from '../Search/SearchService';
import TopicElements from '../TopicElements';
import { redirect, redirectToLogin } from '../../utils/redirectHelper';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  apiKey: PropTypes.string,
  apiKeyName: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  cartaroUrl: PropTypes.string,
  appBaseUrl: PropTypes.string.isRequired,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,
  staticFilesUrl: PropTypes.string,

  // mapStateToProps
  activeTopic: PropTypes.shape(),
  language: PropTypes.string.isRequired,
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  permissionInfos: PropTypes.shape({
    user: PropTypes.string,
    permissions: PropTypes.array,
  }),
  drawLayer: PropTypes.instanceOf(Layer).isRequired,

  // mapDispatchToProps
  dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetTopics: PropTypes.func.isRequired,
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchService: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

const defaultProps = {
  apiKey: null,
  apiKeyName: 'key',
  history: null,
  activeTopic: null,
  cartaroUrl: null,
  vectorTilesKey: null,
  vectorTilesUrl: null,
  permissionInfos: null,
  staticFilesUrl: null,
};

class TopicLoader extends Component {
  componentDidMount() {
    const { apiKey } = this.props;

    if (apiKey) {
      this.loadTopics();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      activeTopic,
      language,
      topics,
      permissionInfos,
      apiKey,
      apiKeyName,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
      staticFilesUrl,
    } = this.props;

    // Sometimes the array object is different but the content is the same as before.
    const areTopicsReallyUpdated =
      topics !== prevProps.topics &&
      ((topics || []).length !== (prevProps.topics || []).length ||
        (topics || []).some((topic, index) => {
          return topic !== (prevProps.topics || [])[index];
        }));

    // Here the "if/else if" are important to avoid loading multiple time the layers in the layerService,
    // which can results to a wrong orders of "change:visible" listeners.
    if (
      (!prevProps.apiKey && apiKey !== prevProps.apiKey) ||
      permissionInfos !== prevProps.permissionInfos ||
      areTopicsReallyUpdated
    ) {
      this.loadTopics(); // loadTopics calls updateServices and updateLayers
    } else if (
      (activeTopic || {}).key !== (prevProps.activeTopic || {}).key ||
      (activeTopic &&
        (vectorTilesUrl !== prevProps.vectorTilesUrl ||
          apiKey !== prevProps.apiKey ||
          vectorTilesKey !== prevProps.vectorTilesKey ||
          cartaroUrl !== prevProps.cartaroUrl ||
          appBaseUrl !== prevProps.appBaseUrl ||
          staticFilesUrl !== prevProps.staticFilesUrl))
    ) {
      this.updateServices(activeTopic); // updateServices calls updateLayers
    } else if (
      activeTopic &&
      (language !== prevProps.language ||
        apiKey !== prevProps.apiKey ||
        apiKeyName !== prevProps.apiKeyName)
    ) {
      this.updateLayers(activeTopic.layers);
    }

    if (activeTopic !== prevProps.activeTopic) {
      this.updateServices(activeTopic);
    }
  }

  loadTopics() {
    const matomo = this.context;
    const {
      topics,
      appBaseUrl,
      permissionInfos,
      dispatchSetTopics,
      dispatchSetActiveTopic,
    } = this.props;

    // Load only topics when permissions are loaded, to avoid double loading.
    if (!topics.length) {
      return;
    }
    const activeTopic = topics.find((t) => t.active);
    const visibleTopics = topics.filter(
      (topic) =>
        (!topic.permission ||
          (permissionInfos &&
            permissionInfos.permissions &&
            permissionInfos.permissions.includes(topic.permission))) &&
        !topic.hideInLayerTree,
    );
    let visibleActiveTopic = visibleTopics.find((t) => t.active);
    const isTopicNeedsPermission = activeTopic && !visibleActiveTopic;

    // If the user has received permissions info, is not logged in and the topic is hidden, we redirect to the login page.
    if (isTopicNeedsPermission && permissionInfos && !permissionInfos.user) {
      redirectToLogin(appBaseUrl);
      return;
    }

    // If the wanted topic can't be seen, we do nothing until the login redirect happens.
    if (isTopicNeedsPermission && !permissionInfos) {
      return;
    }

    visibleActiveTopic = visibleActiveTopic || topics[0];
    visibleActiveTopic.active = true; // in case we fall back to the first topic.
    dispatchSetTopics(visibleTopics);
    dispatchSetActiveTopic(visibleActiveTopic);
    this.updateServices(visibleActiveTopic);

    if (matomo) {
      matomo.trackEvent({ category: visibleActiveTopic.name, action: 'load' });
    }
  }

  updateServices(activeTopic) {
    const {
      t,
      apiKey,
      appBaseUrl,
      layerService,
      dispatchSetFeatureInfo,
      dispatchSetSearchService,
    } = this.props;

    if (!activeTopic) {
      this.updateLayers([]);
      dispatchSetSearchService();
      return;
    }

    if (activeTopic.redirect) {
      // Redirection to the old wkp
      redirect(appBaseUrl, activeTopic.key, {
        baselayers: '',
        layers: '',
      });
      return;
    }

    if (activeTopic.translations) {
      Object.entries(activeTopic.translations).forEach(([lang, trans]) => {
        i18next.addResourceBundle(lang, 'translation', trans);
      });
    }

    this.updateLayers(activeTopic.layers);

    const newSearchService = new SearchService();
    newSearchService.setSearches(activeTopic.searches || []);
    newSearchService.setApiKey(apiKey);
    newSearchService.setSearchesProps({
      t,
      activeTopic,
      layerService,
      dispatchSetFeatureInfo,
    });
    dispatchSetSearchService(newSearchService);
  }

  updateLayers(topicLayers) {
    const {
      apiKey,
      apiKeyName,
      language,
      layerService,
      dispatchSetLayers,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
      staticFilesUrl,
      drawLayer,
    } = this.props;

    const [currentBaseLayer] = layerService
      .getLayersAsFlatArray()
      .filter((l) => l.isBaseLayer && l.visible);

    // In case you set the topics after the default topics are loaded, you'll loose
    // the layers visibility set initially by the permalink parameters.
    // We try to apply the current layers visibility to the new topics.
    layerService.getLayersAsFlatArray().forEach((layer) => {
      topicLayers.forEach((topicLayer) => {
        if (layer.key === topicLayer.key) {
          topicLayer.setVisible(layer.visible);
        }
      });
    });

    const visibleBaseLayers = topicLayers.filter(
      (l) => l.isBaseLayer && l.visible,
    );

    // Set the visible baselayer if need to be changed on topic change.
    if (visibleBaseLayers.indexOf(currentBaseLayer) === -1) {
      topicLayers
        .filter((l) => l.isBaseLayer)
        .forEach((lay, idx) => {
          lay.setVisible(idx === 0);
        });
    }

    // TODO: It seems there is a mix of using layerService and layers.
    // Dispatching dispatchSetLayers(topicLayers) should updtae the layerService
    // then update the flatLayers.
    layerService.setLayers([...topicLayers, drawLayer]);
    const flatLayers = layerService.getLayersAsFlatArray();
    dispatchSetLayers(topicLayers);

    for (let i = 0; i < flatLayers.length; i += 1) {
      if (flatLayers[i].setGeoServerUrl) {
        flatLayers[i].setGeoServerUrl(`${appBaseUrl}/geoserver/trafimage/ows`);
      }
      if (flatLayers[i].setGeoServerWMSUrl) {
        flatLayers[i].setGeoServerWMSUrl(
          `${appBaseUrl}/geoserver/trafimage/ows/service/wms`,
        );
      }
      if (flatLayers[i].setGeoJsonUrl) {
        flatLayers[i].setGeoJsonUrl(`${appBaseUrl}/service/gjc/ows`);
      }
      if (flatLayers[i].setStyleConfig) {
        flatLayers[i].setStyleConfig(
          vectorTilesUrl,
          vectorTilesKey,
          apiKeyName,
        );
      }
      if (flatLayers[i].setCartaroUrl) {
        flatLayers[i].setCartaroUrl(cartaroUrl);
      }
      if (flatLayers[i].setLanguage) {
        flatLayers[i].setLanguage(language);
      }
      if (flatLayers[i].setStaticFilesUrl) {
        flatLayers[i].setStaticFilesUrl(staticFilesUrl);
      }
      if (flatLayers[i].api) {
        flatLayers[i].api.apiKey = apiKey;
      }
    }
  }

  render() {
    const { history, appBaseUrl, staticFilesUrl } = this.props;
    return (
      <TopicElements
        history={history}
        appBaseUrl={appBaseUrl}
        staticFilesUrl={staticFilesUrl}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  activeTopic: state.app.activeTopic,
  language: state.app.language,
  layerService: state.app.layerService,
  permissionsInfos: state.app.permissionsInfos,
  drawLayer: state.map.drawLayer,
  permissionInfos: state.app.permissionInfos,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetLayers: setLayers,
  dispatchSetTopics: setTopics,
  dispatchSetFeatureInfo: setFeatureInfo,
  dispatchSetSearchService: setSearchService,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;
TopicLoader.contextType = MatomoContext;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TopicLoader);
