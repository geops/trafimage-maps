// import polyfills if application is not loaded via index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
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
};

const defaultProps = {
  activeTopicKey: null,
  children: null,
  center: [925472, 5950684],
  zoom: 14,
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
};

const getComponents = (dfltComponents, elementsToDisplay) => {
  return Object.entries(dfltComponents).map(([k, v]) =>
    elementsToDisplay[k] ? <div key={k}>{v}</div> : null,
  );
};

function TrafimageMaps({
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
  zoom,
  initialState,
  menus,
  subMenus,
}) {
  /**
   * If the application runs standalone, we want to use a consistent store.
   * However when running in Stylegudist, every application needs it own store
   */
  const appStore = history ? store : getStore();
  const { map, layerService, searchService } = appStore.getState().app;

  // Define which component to display as child of TopicsMenu.
  const appTopicsMenuChildren = getComponents(
    {
      shareMenu: <ShareMenu />,
    },
    elements,
  );

  // Define which component to display as child of Menu.
  const appMenuChildren = getComponents(
    {
      featureMenu: <FeatureMenu popupComponents={popupComponents} />,
      trackerMenu: <TrackerMenu />,
    },
    elements,
  );

  // Define which components to display.
  const defaultElements = {
    header: <Header />,
    popup: <Popup popupComponents={popupComponents} />,
    footer: <Footer />,
    permalink: <Permalink history={history} initialState={initialState} />,
    mapControls: <MapControls />,
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
        fallbackImgDir="/img/baselayer/"
        validExtent={[656409.5, 5740863.4, 1200512.3, 6077033.16]}
      />
    ),
    search: <Search map={map} searchService={searchService} />,
  };

  const appElements = getComponents(defaultElements, elements);

  // Classes for active components used for conditional styling
  const elementClasses = Object.keys(elements)
    .filter(k => elements[k])
    .map(k => k);

  return (
    <Provider store={appStore}>
      <div className={`tm-app ${elementClasses.join(' ')}`}>
        <ResizeHandler observe=".tm-app" />
        <TopicLoader
          layerService={layerService}
          searchService={searchService}
          baseLayers={baseLayers}
          layers={layers}
          map={map}
          topics={topics}
          activeTopicKey={activeTopicKey}
          apiKey={apiKey}
          popupComponents={popupComponents}
        />
        <Map
          map={map}
          initialCenter={center}
          initialZoom={zoom}
          projection={projection}
          popupComponents={popupComponents}
        />
        {appElements}
        {children}
        <MainDialog />
      </div>
    </Provider>
  );
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default React.memo(TrafimageMaps);
