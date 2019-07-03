import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import OLMap from 'ol/Map';
import Projection from 'ol/proj/Projection';
import { defaults as defaultInteractions } from 'ol/interaction';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/Layer';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import Zoom from 'react-spatial/components/Zoom';
import ResizeHandler from 'react-spatial/components/ResizeHandler';

import Permalink from '../Permalink';
import Map from '../Map';
import Menu from '../Menu';
import Header from '../Header';
import Footer from '../Footer';
import TopicLoader from '../TopicLoader';

import { getStore } from '../../model/store';

import 'react-spatial/themes/default/index.scss';
import './TrafimageMaps.scss';

const propTypes = {
  /**
   * Name of the topic to display.
   */
  topic: PropTypes.string.isRequired,

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
   * Projection used for the map.
   */
  projection: PropTypes.oneOfType([
    PropTypes.instanceOf(Projection),
    PropTypes.string,
  ]),
};

const defaultProps = {
  children: null,
  elements: {
    header: false,
    footer: false,
    menu: false,
    permalink: false,
    mapControls: false,
    baseLayerToggler: false,
  },
  baseLayers: null,
  projection: 'EPSG:3857',
  layers: null,
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
      projection,
      topic,
    } = this.props;

    const defaultElements = {
      header: <Header />,
      footer: <Footer layerService={this.layerService} map={this.map} />,
      menu: <Menu layerService={this.layerService} />,
      permalink: <Permalink map={this.map} />,
      mapControls: <Zoom map={this.map} />,
      baseLayerToggler: (
        <BaseLayerToggler layerService={this.layerService} map={this.map} />
      ),
    };

    const appElements = Object.entries(defaultElements).map(([k, v]) =>
      elements[k] ? <div key={k}>{v}</div> : null,
    );

    return (
      <Provider store={getStore()}>
        <div className="tm-app">
          <TopicLoader
            map={this.map}
            layerService={this.layerService}
            baseLayers={baseLayers}
            layers={layers}
            topic={topic}
          />
          <ResizeHandler observe={this} />
          <Map map={this.map} projection={projection} />

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
