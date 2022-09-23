import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { TiVideo } from 'react-icons/ti';
import Map from 'ol/Map';
import { Layer } from 'mobility-toolbox-js/ol';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import { unByKey } from 'ol/Observable';
import { setMenuOpen } from '../../model/app/actions';
import MenuItem from '../../components/Menu/MenuItem';

const propTypes = {
  // mapStateToProps
  map: PropTypes.instanceOf(Map).isRequired,
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
  layerService: PropTypes.object.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,

  // mapDispatchToProps
  dispatchSetMenuOpen: PropTypes.func.isRequired,
};

class TrackerMenu extends Component {
  static getTimeString(time) {
    return [
      `0${time.getHours()}`.slice(-2),
      `0${time.getMinutes()}`.slice(-2),
    ].join(':');
  }

  constructor(props) {
    super(props);

    this.olEventsKeys = [];
    this.state = {
      open: false,
      collapsed: true,
      lineInfos: null,
    };
    this.onStopSequence = this.onStopSequence.bind(this);
    this.onLayerClick = this.onLayerClick.bind(this);
  }

  componentDidMount() {
    this.initializeClick();
  }

  componentDidUpdate(prevProps, prevState) {
    const { layer, feature } = this.state;
    const { menuOpen, layers } = this.props;
    if (menuOpen !== prevProps.menuOpen) {
      this.closeMenu();
    }

    if (layers !== prevProps.layers) {
      this.initializeClick();
    }

    if (layer !== prevState.layer || feature !== prevState.feature) {
      if (layer && feature) {
        this.getStopSequence();
      }
    }
  }

  componentWillUnmount() {
    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];
    this.trackerLayers.forEach((layer) => {
      layer.unClick(this.onLayerClick);
    });
  }

  onLayerClick(features, layer) {
    const { dispatchSetMenuOpen } = this.props;

    if (features.length) {
      dispatchSetMenuOpen(false);
    }
    this.setState({
      open: !!features.length,
      collapsed: false,
      feature: features[0],
      layer,
      lineInfos: null,
    });
  }

  onStopSequence(stopSequence) {
    if (stopSequence[0]) {
      // eslint-disable-next-line no-param-reassign
      stopSequence[0].backgroundColor = stopSequence[0].stroke;
      // eslint-disable-next-line no-param-reassign
      stopSequence[0].color = stopSequence[0].text_color;
    }

    this.setState({
      lineInfos: stopSequence[0],
    });
  }

  getStopSequence() {
    const { feature, layer } = this.state;
    const { api } = layer;
    const vehicleId = feature.get('train_id');
    api.getStopSequence(vehicleId).then((data) => {
      this.onStopSequence(data);
    });
  }

  initializeClick() {
    const { layerService } = this.props;
    this.trackerLayers = layerService
      .getLayersAsFlatArray()
      .filter((l) => !!l.trajectories);

    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];
    this.trackerLayers.forEach((layer) => {
      layer.unClick(this.onLayerClick);
      this.olEventsKeys.push(
        layer.olLayer.on('change:visible', () => {
          this.setState({
            open: false,
          });
        }),
      );
      layer.onClick(this.onLayerClick);
    });
  }

  closeMenu() {
    // Clear selected trains.
    this.trackerLayers.forEach((layer) => {
      // eslint-disable-next-line no-param-reassign
      layer.selectedVehicleId = null;
      const source = layer.vectorLayer.getSource();
      if (source.getFeatures().length) {
        source.clear();
      }
    });

    this.setState({
      open: false,
      collapsed: false,
      lineInfos: null,
    });
  }

  render() {
    const { open, collapsed, lineInfos } = this.state;
    const { map, t } = this.props;

    if (!open) {
      return null;
    }
    // TO REMOVE
    if (lineInfos) {
      lineInfos.routeIdentifier = lineInfos.routeIdentifier || '';
    }

    return (
      <MenuItem
        className="wkp-tracker-menu"
        title={t('ch.sbb.puenktlichkeit')}
        icon={<TiVideo />}
        map={map}
        open={open}
        collapsed={collapsed}
        onCollapseToggle={(c) => this.setState({ collapsed: c })}
        onClose={() => this.closeMenu()}
      >
        {lineInfos ? (
          <div>
            <RouteSchedule
              trackerLayer={this.trackerLayers.find((l) => l.visible)}
              lineInfos={lineInfos}
              onStationClick={(station) => {
                if (station.coordinate) {
                  map.getView().animate({
                    zoom: map.getView().getZoom(),
                    center: station.coordinate,
                  });
                }
              }}
            />
          </div>
        ) : null}
      </MenuItem>
    );
  }
}

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state) => ({
  map: state.app.map,
  menuOpen: state.app.menuOpen,
  layers: state.map.layers,
  layerService: state.app.layerService,
});

const mapDispatchToProps = {
  dispatchSetMenuOpen: setMenuOpen,
};

TrackerMenu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TrackerMenu);
