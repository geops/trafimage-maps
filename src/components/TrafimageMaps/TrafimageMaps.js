// import polyfills if application is not loaded via index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import OLMap from 'ol/Map';
import Projection from 'ol/proj/Projection';
import { defaults as defaultInteractions } from 'ol/interaction';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/Layer';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import ResizeHandler from 'react-spatial/components/ResizeHandler';

import Permalink from '../Permalink';
import Map from '../Map';
import Menu from '../Menu';
import Header from '../Header';
import Footer from '../Footer';
import MapControls from '../MapControls';
import TopicLoader from '../TopicLoader';
import Popup from '../Popup';
import store, { getStore } from '../../model/store';

import 'react-spatial/themes/default/index.scss';
import './TrafimageMaps.scss';

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
  children: PropTypes.element,

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
  },
  baseLayers: null,
  popupComponents: null,
  projection: 'EPSG:3857',
  layers: null,
  apiKey: null,
  history: null,
};

class TrafimageMaps extends Component {
  constructor(props) {
    super(props);

    this.map = new OLMap({
      controls: [],
      interactions: defaultInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
    });

    this.layerService = new LayerService();
  }

  render() {
    const {
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
    } = this.props;

    const defaultElements = {
      header: <Header />,
      popup: <Popup map={this.map} popupComponents={popupComponents} />,
      footer: <Footer layerService={this.layerService} map={this.map} />,
      menu: <Menu layerService={this.layerService} />,
      permalink: (
        <Permalink
          map={this.map}
          history={history}
          layerService={this.layerService}
        />
      ),
      mapControls: <MapControls map={this.map} />,
      baseLayerToggler: (
        <BaseLayerToggler layerService={this.layerService} map={this.map} />
      ),
    };

    const appElements = Object.entries(defaultElements).map(([k, v]) =>
      elements[k] ? <div key={k}>{v}</div> : null,
    );

    // Classes for active components used for conditional styling
    const elementClasses = Object.keys(elements)
      .filter(k => elements[k])
      .map(k => k);

    /**
     * If the application runs standalone, we want to use a consistent store.
     * However when running in Stylegudist, every application needs it own store
     */
    const appStore = history ? store : getStore();

    return (
      <Provider store={appStore}>
        <div className={`tm-app ${elementClasses.join(' ')}`}>
          <TopicLoader
            layerService={this.layerService}
            baseLayers={baseLayers}
            layers={layers}
            topics={topics}
            activeTopicKey={activeTopicKey}
            apiKey={apiKey}
          />
          <ResizeHandler observe={this} />
          <Map
            map={this.map}
            initialCenter={center}
            initialZoom={zoom}
            projection={projection}
          />

          {appElements.map(elem => elem)}

          {children}
        </div>
      </Provider>
    );
  }
}

TrafimageMaps.propTypes = propTypes;
TrafimageMaps.defaultProps = defaultProps;

export default TrafimageMaps;
