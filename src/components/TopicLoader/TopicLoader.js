import { MatomoContext } from '@datapunt/matomo-tracker-react';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { Layer } from 'mobility-toolbox-js/ol';
import { unByKey } from 'ol/Observable';
import LayerService from '../../utils/LayerService';
import {
  setLayers,
  setMaxZoom,
  setMinZoom,
  setMaxExtent,
} from '../../model/map/actions';
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

  // mapStateToProps
  activeTopic: PropTypes.shape(),
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  language: PropTypes.string.isRequired,
  permissionInfos: PropTypes.shape({
    user: PropTypes.string,
    permissions: PropTypes.array,
  }),
  drawLayer: PropTypes.instanceOf(Layer).isRequired,
  cartaroUrl: PropTypes.string,
  searchUrl: PropTypes.string,
  realtimeKey: PropTypes.string,
  realtimeUrl: PropTypes.string,
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  appBaseUrl: PropTypes.string,
  vectorTilesKey: PropTypes.string,
  vectorTilesUrl: PropTypes.string,
  staticFilesUrl: PropTypes.string,
  apiKey: PropTypes.string,
  apiKeyName: PropTypes.string,

  // mapDispatchToProps
  // dispatchSetActiveTopic: PropTypes.func.isRequired,
  dispatchSetLayers: PropTypes.func.isRequired,
  // dispatchSetTopics: PropTypes.func.isRequired,
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
  dispatchSetSearchService: PropTypes.func.isRequired,
  dispatchSetMaxZoom: PropTypes.func.isRequired,
  dispatchSetMinZoom: PropTypes.func.isRequired,
  dispatchSetMaxExtent: PropTypes.func.isRequired,

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
  realtimeKey: null,
  realtimeUrl: null,
  layers: [],
};

class TopicLoader extends PureComponent {
  constructor(props) {
    super(props);
    this.updateMapLimits = this.updateMapLimits.bind(this);
  }

  componentDidMount() {
    this.loadTopics();
  }

  componentDidUpdate(prevProps) {
    const {
      activeTopic,
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

  componentWillUnmount() {
    this.onChangeVisibleKeys.forEach((key) => unByKey(key));
  }

  loadTopics() {
    const { topics, appBaseUrl, permissionInfos, activeTopic } = this.props;

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
      activeTopic,
      dispatchSetFeatureInfo,
      dispatchSetSearchService,
    } = this.props;

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

    const layers = this.updateLayers();

    const newSearchService = new SearchService();
    newSearchService.setSearches(activeTopic.searches || {});
    newSearchService.setApiKey(apiKey);
    newSearchService.setSearchUrl(searchUrl);
    newSearchService.setSearchesProps({
      t,
      activeTopic,
      layerService: new LayerService(layers),
      dispatchSetFeatureInfo,
    });

    unByKey(this.onChangeVisibleKeys);
    this.onChangeVisibleKeys = new LayerService(layers)
      .getLayersAsFlatArray()
      .map((layer) =>
        layer.on('change:visible', () => {
          this.updateMapLimits();
          if (layer.get('deselectOnChangeVisible')) {
            dispatchSetFeatureInfo([]);
          }
        }),
      );
    this.updateMapLimits();
    dispatchSetSearchService(newSearchService);
  }

  updateMapLimits() {
    const {
      activeTopic,
      dispatchSetMaxZoom,
      dispatchSetMinZoom,
      dispatchSetMaxExtent,
    } = this.props;

    const visibleLayers = activeTopic?.layers.filter((l) => l.visible) || [];

    // Set maxExtent (CAUTION: will break if there are multiple visible layers with different maxExtents)
    const visibleLayersMaxExtent = visibleLayers
      .find((layer) => layer.get('maxExtent'))
      ?.get('maxExtent');

    if (visibleLayersMaxExtent) {
      dispatchSetMaxExtent(visibleLayersMaxExtent);
    } else {
      dispatchSetMaxExtent();
    }

    /* 
      We set minZoom and maxZoom: 
      - We get min/max values for each visible layer and then select the min for maxZoom and max for minZoom
    */
    const visibleLayersMaxZoom = visibleLayers.reduce(
      (maxZooms, layer) =>
        layer.get('maxZoom') ? [...maxZooms, layer.get('maxZoom')] : maxZooms,
      [],
    );

    if (visibleLayersMaxZoom.length) {
      dispatchSetMaxZoom(Math.min(...visibleLayersMaxZoom));
    } else {
      dispatchSetMaxZoom(activeTopic?.maxZoom);
    }

    const visibleLayersMinZoom = visibleLayers.reduce(
      (minZooms, layer) =>
        layer.get('minZoom') ? [...minZooms, layer.get('minZoom')] : minZooms,
      [],
    );

    if (visibleLayersMinZoom.length) {
      dispatchSetMinZoom(Math.max(...visibleLayersMinZoom));
    } else {
      dispatchSetMinZoom(activeTopic?.minZoom);
    }
  }

  updateLayers() {
    const {
      apiKey,
      apiKeyName,
      language,
      dispatchSetLayers,
      cartaroUrl,
      appBaseUrl,
      vectorTilesKey,
      vectorTilesUrl,
      staticFilesUrl,
      drawLayer,
      activeTopic,
      realtimeKey,
      realtimeUrl,
      layers,
    } = this.props;

    // wait until all web components attributes are properly set
    if (
      !apiKey ||
      !apiKeyName ||
      !appBaseUrl ||
      !activeTopic ||
      !vectorTilesUrl ||
      !vectorTilesKey
    ) {
      return [];
    }

    const topicLayers = activeTopic.layers;
    const layerAsFlatArray = new LayerService(layers).getLayersAsFlatArray();
    const [currentBaseLayer] = layerAsFlatArray.filter(
      (l) => l.get('isBaseLayer') && l.visible,
    );

    // In case you set the topics after the default topics are loaded, you'll loose
    // the layers visibility set initially by the permalink parameters.
    // We try to apply the current layers visibility to the new topics.
    layerAsFlatArray.forEach((layer) => {
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

    // Make sure a base layer is a visible on topic change
    if (
      !visibleBaseLayers.length ||
      (currentBaseLayer && visibleBaseLayers.indexOf(currentBaseLayer) === -1)
    ) {
      topicLayers
        .filter((l) => l.get('isBaseLayer'))
        .forEach((lay, idx) => {
          // lay.setVisible(idx === 0);
          // eslint-disable-next-line no-param-reassign
          lay.visible = idx === 0;
        });
    }

    // Layers to display
    const newLayers = [...topicLayers];

    // Draw layer is only useful with the permalink draw.id parameter.
    // So if there is no permalink no need to add this layer.
    // This fix a bug in CASA where ol_uid of the drawLayer is the same as another
    // layer creating a js error when the web component is unmounted.
    if (activeTopic?.elements?.permalink) {
      newLayers.push(drawLayer);
    }

    const flatLayers = new LayerService(newLayers).getLayersAsFlatArray();
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

      // Realtime layers
      if (flatLayers[i].api?.wsApi) {
        if (realtimeUrl) {
          let newUrl = realtimeUrl;
          if (realtimeKey) {
            newUrl = `${newUrl}?key=${realtimeKey}`;
          }
          flatLayers[i].api.url = newUrl;
        }
      }
    }

    dispatchSetLayers(newLayers);

    return newLayers;
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
  drawLayer: state.map.drawLayer,
  layers: state.map.layers,
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
  realtimeKey: state.app.realtimeKey,
  realtimeUrl: state.app.realtimeUrl,
});

const mapDispatchToProps = {
  dispatchSetActiveTopic: setActiveTopic,
  dispatchSetLayers: setLayers,
  dispatchSetTopics: setTopics,
  dispatchSetFeatureInfo: setFeatureInfo,
  dispatchSetSearchService: setSearchService,
  dispatchSetMaxZoom: setMaxZoom,
  dispatchSetMinZoom: setMinZoom,
  dispatchSetMaxExtent: setMaxExtent,
};

TopicLoader.propTypes = propTypes;
TopicLoader.defaultProps = defaultProps;
TopicLoader.contextType = MatomoContext;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TopicLoader);
