import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import OLMap from 'ol/Map';
import { defaults as defaultInteractions } from 'ol/interaction';

import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import Zoom from 'react-spatial/components/Zoom';

import Permalink from './components/Permalink';
import Map from './components/Map';
import Menu from './components/Menu';
import Header from './components/Header';
import Footer from './components/Footer';
import { setLayers } from './model/map/actions';
import { setActiveTopic } from './model/app/actions';

import APP_CONF from './appConfig';

import 'react-spatial/themes/default/index.scss';
import './App.scss';

const propTypes = {
  topic: PropTypes.string.isRequired,

  // mapDispatchToProps
  dispatchSetLayers: PropTypes.func.isRequired,
  dispatchSetActiveTopic: PropTypes.func.isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.map = new OLMap({
      controls: [],
      interactions: defaultInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
    });

    const { topic, dispatchSetActiveTopic } = this.props;
    const layerConfig = APP_CONF[topic].layers;
    const layers = ConfigReader.readConfig(this.map, layerConfig);

    this.layerService = new LayerService(layers);
    dispatchSetActiveTopic(APP_CONF[topic]);
  }

  componentDidMount() {
    const { dispatchSetLayers } = this.props;
    dispatchSetLayers([...this.layerService.getLayers()]);
  }

  render() {
    return (
      <div className="tm-app">
        <Header />
        <Menu layerService={this.layerService} />
        <Map map={this.map} projection={APP_CONF.projection} />
        <Permalink map={this.map} />
        <Zoom map={this.map} />
        <BaseLayerToggler layerService={this.layerService} map={this.map} />
        <Footer map={this.map} />
      </div>
    );
  }
}

App.propTypes = propTypes;

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchSetLayers: setLayers,
  dispatchSetActiveTopic: setActiveTopic,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);
