// import polyfills if application is not loaded via index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import '../../i18n';

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'lodash/fp';
import { Provider } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Projection from 'ol/proj/Projection';
import Layer from 'react-spatial/layers/Layer';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import ResizeHandler from 'react-spatial/components/ResizeHandler';
import Menu from '../Menu';
import FeatureMenu from '../FeatureMenu';
import TrackerMenu from '../../menus/TrackerMenu';
import ShareMenu from '../../menus/ShareMenu';
import Permalink from '../Permalink';
import Map from '../Map';
import Header from '../Header';
import Footer from '../Footer';
import MapControls from '../MapControls';
import TopicLoader from '../TopicLoader';
import Popup from '../Popup';
import MainDialog from '../MainDialog';
import Search from '../Search';
import store, { getStore } from '../../model/store';

import 'react-spatial/themes/default/index.scss';
import './TrafimageMaps.scss';
import TopicsMenu from '../TopicsMenu';
import { setZoom } from '../../model/map/actions';

const propTypes = {
  /**
   * Name of the topic to display.
   */
  activeTopicKey: PropTypes.string,

  /**
   * Array of topics from ./src/config/topics
   */
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  /**
   * Additional elements.
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  /**
   * Visible elements on the map application.
   */
  elements: PropTypes.shape({
    header: PropTypes.bool,
    footer: PropTypes.bool,
    menu: PropTypes.bool,
    permaLink: PropTypes.bool,
    popup: PropTypes.bool,
    mapControls: PropTypes.bool,
    baseLayerToggler: PropTypes.bool,
    shareMenu: PropTypes.bool,
    featureMenu: PropTypes.bool,
    trackerMenu: PropTypes.bool,
  }),

  /**
   * List of base layers.
   */
  baseLayers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

  /**
   * List of layers.
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

  /**
   * Mapping of layer keys and Popup component names.
   * Component names are names of files from the folder `src/components/Popup`
   * without the `.js` extension.
   * Example: { 'ch.sbb.netzkarte': 'NetzkartePopup' }
   */
  popupComponents: PropTypes.objectOf(PropTypes.string),

  /**
   * Array of menus compomnents to display as child of Menu component.
   * Example: [<TrackerMenu/>]
   */
  menus: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  /**
   * Array of menus compomnents to display at the bottom of the TopicsMenu.
   * Example: [<ShareMenu/>]
   */
  subMenus: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  /**
   * Projection used for the map.
   */
  projection: PropTypes.oneOfType([
    PropTypes.instanceOf(Projection),
    PropTypes.string,
  ]),

  /**
   * Initial map center described by an array of coordinates
   * containing longitude and latitude.
   */
  center: PropTypes.arrayOf(PropTypes.number),

  /**
   * Initial zoom level.
   */
  initialZoom: PropTypes.number,

  /**
   * Zoom level.
   */
  zoom: PropTypes.number,

  /**
   * API key for using geOps services.
   */
  apiKey: PropTypes.string,

  /**
   * React router history.
   */
  history: PropTypes.shape(),

  /**
   * React router url params.
   */
  initialState: PropTypes.shape(),

  /**
   * translation function.
   */
  t: PropTypes.func.isRequired,

  /**
   * URL endpoint for Cartaro.
   */
  cartaroUrl: PropTypes.string,

  /**
   * URL endpoint for GeoServer.
   */
  geoServerUrl: PropTypes.string,

  /**
   * API key for vector tiles hosted by geOps.
   */
  vectorTilesKey: PropTypes.string,

  /**
   * URL endpoint for vector tiles hosted by geOps.
   */
  vectorTilesUrl: PropTypes.string,
};

const defaultProps = {
  activeTopicKey: null,
  children: null,
  center: [925472, 5920000],
  initialZoom: 9,
  zoom: undefined,
  elements: {
    header: false,
    footer: false,
    menu: false,
    permalink: false,
    popup: false,
    mapControls: false,
    baseLayerToggler: false,
    shareMenu: false,
    trackerMenu: false,
    featureMenu: false,
    search: false,
  },
  baseLayers: null,
  popupComponents: {},
  projection: 'EPSG:3857',
  layers: null,
  apiKey: null,
  history: null,
  initialState: {},
  menus: null,
  subMenus: null,
  cartaroUrl: null,
  geoServerUrl: null,
  vectorTilesKey: null,
  vectorTilesUrl: null,
};

class TrafimageMaps extends React.PureComponent {
  static getComponents(dfltComponents, elementsToDisplay) {
    return Object.entries(dfltComponents).map(([k, v]) =>
      elementsToDisplay[k] ? <div key={k}>{v}</div> : null,
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      tabFocus: false,
    };
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    const { history } = this.props;

    /**
     * If the application runs standalone, we want to use a consistent store.
     * However when running in Stylegudist, every application needs it own store
     */
    this.store = history ? store : getStore();
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { zoom } = this.props;

    if (zoom !== prevProps.zoom) {
      this.store.dispatch(setZoom(zoom));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
  }

  onDocumentKeyDown(e) {
    if (e.which === 9) {
      this.setState({ tabFocus: true });
    }
  }

  onDocumentClick() {
    this.setState({ tabFocus: false });
  }

  render() {
    const {
      t,
      baseLayers,
      children,
      elements,
      layers,
      popupComponents,
      projection,
      topics,
      activeTopicKey,
      apiKey,
      history,
      center,
      initialState,
      menus,
      subMenus,
      cartaroUrl,
      geoServerUrl,
      vectorTilesKey,
      vectorTilesUrl,
      initialZoom,
    } = this.props;
    const { map, layerService, searchService } = this.store.getState().app;

    searchService.setApiKey(apiKey);

    // Define which component to display as child of TopicsMenu.
    const appTopicsMenuChildren = TrafimageMaps.getComponents(
      {
        shareMenu: <ShareMenu />,
      },
      elements,
    );

    // Define which component to display as child of Menu.
    const appMenuChildren = TrafimageMaps.getComponents(
      {
        featureMenu: <FeatureMenu popupComponents={popupComponents} />,
        trackerMenu: <TrackerMenu />,
      },
      elements,
    );

    // Define which components to display.
    const defaultElements = {
      header: <Header />,
      search: <Search />,
      popup: <Popup popupComponents={popupComponents} />,
      permalink: <Permalink history={history} initialState={initialState} />,
      menu: (
        <Menu>
          <TopicsMenu>
            {appTopicsMenuChildren}
            {subMenus}
          </TopicsMenu>
          {appMenuChildren}
          {menus}
        </Menu>
      ),
      baseLayerToggler: (
        <BaseLayerToggler
          layerService={layerService}
          map={map}
          mapTabIndex={-1} // No accessible via Tab nav.
          titleButton={t('Baselayerwechsel')}
          titleButtonNext={t('Nächste Baselayer')}
          titleButtonPrevious={t('Vorherige Baselayer')}
          fallbackImgDir="/img/baselayer/"
          validExtent={[656409.5, 5740863.4, 1200512.3, 6077033.16]}
        />
      ),
      mapControls: <MapControls />,
      footer: <Footer />,
    };

    const appElements = TrafimageMaps.getComponents(defaultElements, elements);
    const { tabFocus } = this.state;

    return (
      <Provider store={this.store}>
        <div className={`tm-app ${elements.header ? 'header' : ''}`}>
          <div className={`tm-barrier-free ${tabFocus ? '' : 'tm-no-focus'}`}>
            <ResizeHandler observe=".tm-app" />
            <TopicLoader
              layerService={layerService}
              searchService={searchService}
              baseLayers={baseLayers}
              layers={layers}
              map={map}
              topics={topics}
              activeTopicKey={activeTopicKey}
              cartaroUrl={cartaroUrl}
              geoServerUrl={geoServerUrl}
              vectorTilesKey={vectorTilesKey}
              vectorTilesUrl={vectorTilesUrl}
            />
            <Map
              map={map}
              initialCenter={center}
              initialZoom={initialZoom}
              projection={projection}
              popupComponents={popupComponents}
            />
            {appElements}
            {children}
            <MainDialog />
          </div>
        </div>
      </Provider>
    );
  }
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default compose(withTranslation())(TrafimageMaps);
