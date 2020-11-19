import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { TiVideo } from 'react-icons/ti';
import { fromLonLat } from 'ol/proj';
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
      trajectory: null,
    };
    this.onLayerClick = this.onLayerClick.bind(this);
  }

  componentDidMount() {
    this.initializeClick();
  }

  componentDidUpdate(prevProps) {
    const { menuOpen, layers } = this.props;
    if (menuOpen !== prevProps.menuOpen) {
      this.closeMenu();
    }

    if (layers !== prevProps.layers) {
      this.initializeClick();
    }
  }

  componentWillUnmount() {
    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];

    this.trackerLayers.forEach((layer) => {
      layer.unClick(this.onLayerClick);
    });
  }

  onLayerClick(traj) {
    const { dispatchSetMenuOpen } = this.props;
    if (traj) {
      dispatchSetMenuOpen(false);
    }
    this.setState({
      open: !!traj,
      collapsed: false,
      trajectory: traj,
    });
  }

  initializeClick() {
    const { layerService } = this.props;
    this.trackerLayers = layerService
      .getLayersAsFlatArray()
      .filter((l) => l.isTrackerLayer);

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
    this.setState({
      open: false,
      collapsed: false,
      trajectory: null,
    });
  }

  render() {
    const { open, collapsed, trajectory } = this.state;
    const { map, t } = this.props;

    if (!open) {
      return null;
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
      >
        {trajectory ? (
          <div>
            <RouteSchedule
              trackerLayer={this.trackerLayers.find((l) => l.visible)}
              lineInfos={trajectory}
              onStationClick={(station) => {
                map.getView().animate({
                  zoom: map.getView().getZoom(),
                  center: fromLonLat(station.coordinates),
                });
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
