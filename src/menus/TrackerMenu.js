import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TiVideo } from 'react-icons/ti';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import LayerService from 'react-spatial/LayerService';
import TrackerLayer from 'react-public-transport/components/Tracker/TrackerLayer';
import './TrackerMenu.scss';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

class TrackerMenu extends Component {
  static getTimeString(time) {
    return [
      `0${time.getHours()}`.slice(-2),
      `0${time.getMinutes()}`.slice(-2),
    ].join(':');
  }

  static renderTrajctory(trajectory) {
    if (!trajectory) {
      return null;
    }

    return (
      <div className="wkp-trajectory">
        {trajectory.map(t => (
          <div key={t.name} className="wkp-trajectory-stop">
            <div className="wkp-trajectory-stop-time">
              {TrackerMenu.getTimeString(new Date(t.arrival))}
              <div className="wkp-trajectory-stop-icon" />
            </div>
            <div className="wkp-trajectory-stop-name">{t.name}</div>
          </div>
        ))}
      </div>
    );
  }

  constructor(props) {
    super(props);
    const { layerService } = this.props;

    this.trackerLayer = layerService
      .getLayersAsFlatArray()
      .find(l => l instanceof TrackerLayer);

    this.state = {
      closed: false,
      visible: this.trackerLayer && this.trackerLayer.getVisible(),
      trajectory: null,
    };

    if (this.trackerLayer) {
      this.trackerLayer.olLayer.on('change:visible', () =>
        this.setState({ visible: this.trackerLayer.getVisible() }),
      );

      this.trackerLayer.onClick(trajectories => {
        if (trajectories.length) {
          const trajectory = [];
          const id = trajectories[0].get('id');

          this.trackerLayer.fetchTrajectory(id).then(traj => {
            for (let i = 0; i < traj.p.length; i += 1) {
              for (let j = 0; j < traj.p[i].length; j += 1) {
                const stop = traj.p[i][j];
                if (stop.n) {
                  trajectory.push({
                    name: stop.n,
                    arrival: stop.a ? stop.a * 1000 : null,
                    departure: stop.d ? stop.d * 1000 : null,
                  });
                }
              }
            }

            this.setState({ trajectory });
          });
        }
      });
    }
  }

  render() {
    const { visible, closed, trajectory } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <div className="wkp-menu wkp-tracker-menu">
        <div
          className="wkp-menu-title"
          role="button"
          tabIndex={0}
          onClick={() => this.setState({ closed: !closed })}
          onKeyPress={e => e.which === 13 && this.setState({ closed: !closed })}
        >
          <div className="wkp-menu-title-left">
            <TiVideo className="wkp-menu-title-icon" />
            Zugtracker
          </div>

          <div className="wkp-menu-title-toggler">
            {closed ? <FaAngleDown /> : <FaAngleUp />}
          </div>
        </div>
        <div className={`wkp-menu-body ${closed ? 'closed' : ''}`}>
          {TrackerMenu.renderTrajctory(trajectory)}
        </div>
      </div>
    );
  }
}

TrackerMenu.propTypes = propTypes;
export default TrackerMenu;
