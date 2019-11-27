import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { TiVideo } from 'react-icons/ti';
import { transform as transformCoords } from 'ol/proj';
import Map from 'ol/Map';
import TrackerLayer from 'react-transit/layers/TrackerLayer';
import RouteSchedule from 'react-transit/components/RouteSchedule';
import { unByKey } from 'ol/Observable';
import {
  setMenuOpen,
  setTrackerMenuOpen,
  setTrackerMenuCollapse,
} from '../../model/app/actions';
import MenuItem from '../../components/Menu/MenuItem';

const propTypes = {
  // mapStateToProps
  trackerMenuOpen: PropTypes.bool.isRequired,
  trackerMenuCollapse: PropTypes.bool.isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
  layerService: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,

  // mapDispatchToProps
  dispatchSetMenuOpen: PropTypes.func.isRequired,
  dispatchSetTrackerMenuOpen: PropTypes.func.isRequired,
  dispatchSetTrackerMenuCollapse: PropTypes.func.isRequired,
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
      trajectory: null,
    };
    this.onLayerClick = this.onLayerClick.bind(this);
  }

  componentDidMount() {
    const { layerService, dispatchSetTrackerMenuOpen } = this.props;

    this.trackerLayers = layerService
      .getLayersAsFlatArray()
      .filter(l => l instanceof TrackerLayer);

    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];
    if (this.trackerLayers.length) {
      this.trackerLayers.forEach(layer => {
        this.olEventsKeys.push(
          layer.olLayer.on('change:visible', () => {
            dispatchSetTrackerMenuOpen(false);
          }),
        );
        layer.onClick(this.onLayerClick);
      });
    }
  }

  componentWillUnmount() {
    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];

    this.trackerLayers.forEach(layer => {
      layer.unClick(this.onLayerClick);
    });
  }

  onLayerClick(traj) {
    const {
      dispatchSetTrackerMenuOpen,
      dispatchSetTrackerMenuCollapse,
      dispatchSetMenuOpen,
    } = this.props;
    if (traj) {
      dispatchSetMenuOpen(false);
    }
    dispatchSetTrackerMenuOpen(!!traj);
    dispatchSetTrackerMenuCollapse(false);
    this.setState({
      trajectory: traj,
    });
  }

  render() {
    const { trajectory } = this.state;
    const {
      t,
      map,
      trackerMenuOpen,
      trackerMenuCollapse,
      dispatchSetMenuOpen,
      dispatchSetTrackerMenuCollapse,
    } = this.props;

    if (!trackerMenuOpen) {
      return null;
    }

    return (
      <MenuItem
        className="wkp-tracker-menu"
        title={t('ch.sbb.puenktlichkeit')}
        icon={<TiVideo />}
        map={map}
        open={trackerMenuOpen}
        collapsed={trackerMenuCollapse}
        onCollapseToggle={c => {
          dispatchSetMenuOpen(false);
          dispatchSetTrackerMenuCollapse(c);
        }}
      >
        {trajectory ? (
          <div>
            <RouteSchedule
              trackerLayer={this.trackerLayers.find(l => l.getVisible())}
              lineInfos={trajectory}
              onStationClick={station => {
                map.getView().animate({
                  zoom: map.getView().getZoom(),
                  center: transformCoords(
                    station.coordinates,
                    'EPSG:4326',
                    'EPSG:3857',
                  ),
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
const mapStateToProps = state => ({
  map: state.app.map,
  trackerMenuOpen: state.app.trackerMenuOpen,
  trackerMenuCollapse: state.app.trackerMenuCollapse,
  layerService: state.app.layerService,
});

const mapDispatchToProps = {
  dispatchSetMenuOpen: setMenuOpen,
  dispatchSetTrackerMenuOpen: setTrackerMenuOpen,
  dispatchSetTrackerMenuCollapse: setTrackerMenuCollapse,
};

TrackerMenu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TrackerMenu);
