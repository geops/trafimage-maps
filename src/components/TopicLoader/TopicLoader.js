import { MatomoContext } from '@datapunt/matomo-tracker-react';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { Layer } from 'mobility-toolbox-js/ol';
import LayerService from '../../utils/LayerService';
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

  appBaseUrl: PropTypes.string,
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
  cartaroUrl: PropTypes.string,
  searchUrl: PropTypes.string,

  // mapDispatchToProps
  // dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  // dispatchSetTopics: PropTypes.func.isRequired,
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
  searchUrl: null,
  appBaseUrl: null,
};

class TopicLoader extends PureComponent {
  componentDidMount() {
    this.loadTopics();
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
      searchUrl,
    } = this.props;

    // Sometimes the array object is different but the content is the same as before.
    const areTopicsReallyUpdated =
      topics?.map((t) => `${t.key}`).join() !==
      prevProps.topics?.map((t) => `${t.key}`).join();

    // Here the "if/else if" are important to avoid loading multiple time the layers in the layerService,
    // which can results to a wrong orders of "change:visible" listeners.
    if (
      areTopicsReallyUpdated ||
      (!prevProps.activeTopic && activeTopic) ||
      permissionInfos !== prevProps.permissionInfos
    ) {
      this.loadTopics(prevProps);
    } else if (
      activeTopic?.key !== prevProps.activeTopic?.key ||
      (activeTopic &&
        (apiKey !== prevProps.apiKey || searchUrl !== prevProps.searchUrl))
    ) {
      this.updateServices(activeTopic); // updateServices calls updateLayers
    } else if (
      activeTopic &&
      (apiKey !== prevProps.apiKey ||
        language !== prevProps.language ||
        apiKeyName !== prevProps.apiKeyName ||
        appBaseUrl !== prevProps.appBaseUrl ||
        cartaroUrl !== prevProps.cartaroUrl ||
        vectorTilesKey !== prevProps.vectorTilesKey ||
        vectorTilesUrl !== prevProps.vectorTilesUrl ||
        staticFilesUrl !== prevProps.staticFilesUrl)
    ) {
      this.updateLayers(activeTopic.layers);
    }
  }

  loadTopics() {
    const { topics, appBaseUrl, permissionInfos, activeTopic } = this.props;

    // console.log('loadTopics', !topics?.length, !activeTopic);

    // wait until all web components attributes are properly set
    if (!topics?.length || !activeTopic) {
      return;
    }

    const visibleTopics = topics.filter(
      (topic) =>
        (!topic.permission ||
          (permissionInfos &&
            permissionInfos.permissions &&
            permissionInfos.permissions.includes(topic.permission))) &&
        (topic.key === activeTopic?.key || !topic.hideInLayerTree),
    );
    const visibleActiveTopic = visibleTopics.find(
      (t) => t.key === activeTopic?.key,
    );
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

    this.updateServices();
  }

  updateServices() {
    const {
      t,
      apiKey,
      searchUrl,
      appBaseUrl,
      layerService,
      activeTopic,
      dispatchSetFeatureInfo,
      dispatchSetSearchService,
    } = this.props;

    // console.log('updateServices', !apiKey || !searchUrl);
    // wait until all web components attributes are properly set
    if (!apiKey || !searchUrl) {
      return;
    }

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

    this.updateLayers();

    const newSearchService = new SearchService();
    newSearchService.setSearches(activeTopic.searches || {});
    newSearchService.setApiKey(apiKey);
    newSearchService.setSearchUrl(searchUrl);
    newSearchService.setSearchesProps({
      t,
      activeTopic,
      layerService,
      dispatchSetFeatureInfo,
    });
    dispatchSetSearchService(newSearchService);
  }

  updateLayers() {
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
      activeTopic,
    } = this.props;

    // console.log(
    //   'ici',
    //   !apiKey ||
    //     !apiKeyName ||
    //     !appBaseUrl ||
    //     !activeTopic ||
    //     !vectorTilesUrl ||
    //     !vectorTilesKey,
    // );
    // wait until all web components attributes are properly set
    if (
      !apiKey ||
      !apiKeyName ||
      !appBaseUrl ||
      !activeTopic ||
      !vectorTilesUrl ||
      !vectorTilesKey
    ) {
      return;
    }

    const topicLayers = activeTopic.layers;
    const [currentBaseLayer] = layerService
      .getLayersAsFlatArray()
      .filter((l) => l.get('isBaseLayer') && l.visible);

    // In case you set the topics after the default topics are loaded, you'll loose
    // the layers visibility set initially by the permalink parameters.
    // We try to apply the current layers visibility to the new topics.
    layerService.getLayersAsFlatArray().forEach((layer) => {
      topicLayers.forEach((topicLayer) => {
        if (layer.key === topicLayer.key) {
          // topicLayer.setVisible(layer.visible);
          // eslint-disable-next-line no-param-reassign
          topicLayer.visible = layer.visible;
        }
      });
    });

    const visibleBaseLayers = topicLayers.filter(
      (l) => l.get('isBaseLayer') && l.visible,
    );

    // Set the visible baselayer if need to be changed on topic change.
    if (visibleBaseLayers.indexOf(currentBaseLayer) === -1) {
      topicLayers
        .filter((l) => l.get('isBaseLayer'))
        .forEach((lay, idx) => {
          // lay.setVisible(idx === 0);
          // eslint-disable-next-line no-param-reassign
          lay.visible = idx === 0;
        });
    }

    // Layers to display
    const layers = [...topicLayers];

    // Draw layer is only useful with the permalink draw.id parameter.
    // So if there is no permalink no need to add this layer.
    // This fix a bug in CASA where ol_uid of the drawLayer is the same as another
    // layer creating a js error when the web component is unmounted.
    if (activeTopic?.elements?.permalink) {
      layers.push(drawLayer);
    }

    // TODO: It seems there is a mix of using layerService and layers.
    // Dispatching dispatchSetLayers(topicLayers) should updtae the layerService
    // then update the flatLayers.
    layerService.setLayers(layers);

    const flatLayers = layerService.getLayersAsFlatArray();
    for (let i = 0; i < flatLayers.length; i += 1) {
      // TODO: seems unused so should we remove it?
      if (flatLayers[i].setGeoServerUrl) {
        flatLayers[i].setGeoServerUrl(`${appBaseUrl}/geoserver/trafimage/ows`);
      }

      // TODO: seems unused so should we remove it?
      if (flatLayers[i].setGeoServerWMSUrl) {
        flatLayers[i].setGeoServerWMSUrl(
          `${appBaseUrl}/geoserver/trafimage/ows/service/wms`,
        );
      }
      // TODO: seems unused so should we remove it?
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

    dispatchSetLayers(layers);
  }

  render() {
    const { history } = this.props;
    return <TopicElements history={history} />;
  }
}

const mapStateToProps = (state) => ({
  activeTopic: state.app.activeTopic,
  topics: state.app.topics,
  language: state.app.language,
  layerService: state.app.layerService,
  drawLayer: state.map.drawLayer,
  permissionInfos: state.app.permissionInfos,
  cartaroUrl: state.app.cartaroUrl,
  searchUrl: state.app.searchUrl,
  appBaseUrl: state.app.appBaseUrl,
  staticFilesUrl: state.app.staticFilesUrl,
  apiKey: state.app.apiKey,
  apiKeyName: state.app.apiKeyName,
  mapsetUrl: state.app.mapsetUrl,
  shortenerUrl: state.app.shortenerUrl,
  drawUrl: state.app.drawUrl,
  vectorTilesUrl: state.app.vectorTilesUrl,
  vectorTilesKey: state.app.vectorTilesKey,
  loginUrl: state.app.loginUrl,
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
