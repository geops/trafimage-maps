import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { TiVideo } from 'react-icons/ti';
import Map from 'ol/Map';
import { transform as transformCoords } from 'ol/proj';
import LayerService from 'react-spatial/LayerService';
import TrackerLayer from 'react-transit/layers/TrackerLayer';
import RouteSchedule from 'react-transit/components/RouteSchedule';
import { setMenuOpen } from '../../model/app/actions';
import MenuItem from '../../components/Menu/MenuItem';
import './TrackerMenu.scss';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,

  dispatchSetMenuOpen: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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
    const { layerService, dispatchSetMenuOpen } = this.props;

    this.trackerLayers = layerService
      .getLayersAsFlatArray()
      .filter(l => l instanceof TrackerLayer);

    this.state = {
      open: this.trackerLayers.length && this.getVisibleLayerName(),
      collapsed: true,
      trajectory: null,
    };

    if (this.trackerLayers.length) {
      this.trackerLayers.forEach(layer => {
        layer.olLayer.on('change:visible', () =>
          this.setState({
            open: this.getVisibleLayerName(),
          }),
        );

        layer.onClick(traj => {
          dispatchSetMenuOpen(false);
          this.setState({
            open: layer.getName(),
            collapsed: false,
            trajectory: traj,
          });
        });
      });
    }
  }

  getVisibleLayerName() {
    const layerVisible = this.trackerLayers.find(l => l.getVisible());
    return layerVisible ? layerVisible.getName() : false;
  }

  render() {
    const { open, collapsed, trajectory } = this.state;
    const { t, map } = this.props;

    if (!open) {
      return null;
    }

    return (
      <MenuItem
        className="wkp-tracker-menu"
        title={t('ch.sbb.puenktlichkeit')}
        icon={<TiVideo />}
        map={map}
        open={typeof open === 'string'}
        collapsed={collapsed}
        onCollapseToggle={c => this.setState({ collapsed: c })}
      >
        {trajectory ? (
          <div>
            <RouteSchedule
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
const mapStateToProps = state => ({});

const mapDispatchToProps = {
  dispatchSetMenuOpen: setMenuOpen,
};

TrackerMenu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TrackerMenu);
