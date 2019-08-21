import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TiVideo } from 'react-icons/ti';
import Map from 'ol/Map';
import LayerService from 'react-spatial/LayerService';
import TrajservLayer from 'react-transit/layers/TrajservLayer';
import RouteSchedule from 'react-transit/components/RouteSchedule';
import MenuItem from '../components/Menu/MenuItem';
import './TrackerMenu.scss';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
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
    const { layerService } = this.props;

    this.trackerLayer = layerService
      .getLayersAsFlatArray()
      .find(l => l instanceof TrajservLayer);

    this.state = {
      open: this.trackerLayer && this.trackerLayer.getVisible(),
      collapsed: true,
      trajectory: null,
    };

    if (this.trackerLayer) {
      this.trackerLayer.olLayer.on('change:visible', () =>
        this.setState({ open: this.trackerLayer.getVisible() }),
      );

      this.trackerLayer.onClick(traj => {
        this.setState({
          open: true,
          collapsed: false,
          trajectory: traj,
        });
      });
    }
  }

  render() {
    const { open, collapsed, trajectory } = this.state;
    const { map } = this.props;

    if (!open) {
      return null;
    }

    return (
      <MenuItem
        className="wkp-tracker-menu"
        title="Zugtracker"
        icon={<TiVideo />}
        map={map}
        open={open}
        collapsed={collapsed}
        onCollapseToggle={c => this.setState({ collapsed: c })}
      >
        {trajectory ? <RouteSchedule lineInfos={trajectory} /> : null}
      </MenuItem>
    );
  }
}

TrackerMenu.propTypes = propTypes;
export default TrackerMenu;
