import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import OLMap from 'ol/Map';
import { defaults as defaultInteractions } from 'ol/interaction';
import ConfigReader from 'react-spatial/ConfigReader';
import Zoom from 'react-spatial/components/Zoom';
import LayerService from 'react-spatial/LayerService';

import APP_CONF from './appConfig';
import Permalink from './components/Permalink';
import Map from './components/Map';
import { setLayers } from './model/map/actions';

import 'react-spatial/themes/default/index.scss';
import './App.scss';

const propTypes = {
  initialState: PropTypes.object,
  dispatchSetLayers: PropTypes.func.isRequired,
};

const defaultProps = {
  initialState: {},
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
  }

  componentDidMount() {
    const { dispatchSetLayers } = this.props;
    const layers = ConfigReader.readConfig(this.map, APP_CONF.layers);

    this.layerService = new LayerService(layers);
    dispatchSetLayers([...this.layerService.getLayers()]);
  }

  render() {
    const { initialState } = this.props;
    return (
      <div className="tm-app">
        <Map map={this.map} projection={APP_CONF.projection} />
        <Permalink map={this.map} initialState={initialState} />
        <Zoom map={this.map} />
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchSetLayers: setLayers,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);
