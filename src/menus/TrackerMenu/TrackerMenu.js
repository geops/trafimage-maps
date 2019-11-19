import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import { TiVideo } from 'react-icons/ti';
import { transform as transformCoords } from 'ol/proj';
import Map from 'ol/Map';
import TrackerLayer from 'react-transit/layers/TrackerLayer';
import FilterButton from 'react-transit/components/FilterButton';
import FollowButton from 'react-transit/components/FollowButton';
import RouteSchedule from 'react-transit/components/RouteSchedule';
import { unByKey } from 'ol/Observable';
import { setCenter } from '../../model/map/actions';
import {
  setMenuOpen,
  setLineFilter,
  setRouteFilter,
  setOperatorFilter,
} from '../../model/app/actions';
import MenuItem from '../../components/Menu/MenuItem';
import { ReactComponent as Filter } from '../../img/FilterButton/filter.svg';
import { ReactComponent as Follow } from '../../img/FollowButton/follow.svg';
import './TrackerMenu.scss';

const propTypes = {
  // mapStateToProps
  routeFilter: PropTypes.string,
  map: PropTypes.instanceOf(Map).isRequired,
  layerService: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,

  // mapDispatchToProps
  dispatchSetCenter: PropTypes.func.isRequired,
  dispatchSetMenuOpen: PropTypes.func.isRequired,
  dispatchSetLineFilter: PropTypes.func.isRequired,
  dispatchSetRouteFilter: PropTypes.func.isRequired,
  dispatchSetOperatorFilter: PropTypes.func.isRequired,
};

const defaultProps = {
  routeFilter: undefined,
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
      followActive: false,
    };
    this.onLayerClick = this.onLayerClick.bind(this);
  }

  componentDidMount() {
    const { layerService } = this.props;

    this.trackerLayers = layerService
      .getLayersAsFlatArray()
      .filter(l => l instanceof TrackerLayer);

    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];
    if (this.trackerLayers.length) {
      this.trackerLayers.forEach(layer => {
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

    [this.trackerParentLayer] = layerService
      .getLayersAsFlatArray()
      .filter(l => l.getName() === 'ch.sbb.puenktlichkeit');

    if (this.trackerParentLayer) {
      this.olEventsKeys.push(
        this.trackerParentLayer.on('change:visible', evt => {
          if (!evt.target.getVisible()) {
            // Remove tracker specific url params when layer hidden.
            this.removeTrackerUrlParams();
          }
        }),
      );
    }
  }

  componentWillUnmount() {
    unByKey(this.olEventsKeys);
    this.olEventsKeys = [];

    this.trackerLayers.forEach(layer => {
      layer.setFilter(null);
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

  removeTrackerUrlParams() {
    const {
      dispatchSetLineFilter,
      dispatchSetRouteFilter,
      dispatchSetOperatorFilter,
    } = this.props;

    dispatchSetLineFilter(undefined);
    dispatchSetRouteFilter(undefined);
    dispatchSetOperatorFilter(undefined);
  }

  render() {
    const { open, collapsed, trajectory, followActive } = this.state;
    const {
      map,
      t,
      dispatchSetCenter,
      routeFilter,
      dispatchSetRouteFilter,
    } = this.props;

    if (!open) {
      return null;
    }

    const trackerLayer = this.trackerLayers.find(l => l.getVisible());

    return (
      <MenuItem
        className="wkp-tracker-menu"
        title={t('ch.sbb.puenktlichkeit')}
        icon={<TiVideo />}
        map={map}
        open={open}
        collapsed={collapsed}
        onCollapseToggle={c => this.setState({ collapsed: c })}
      >
        {trajectory ? (
          <div>
            <RouteSchedule
              trackerLayer={trackerLayer}
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
              renderHeaderButtons={routeIdentifier => (
                <>
                  <FilterButton
                    title="Filter"
                    active={!!routeFilter}
                    onClick={() =>
                      dispatchSetRouteFilter(
                        routeFilter ? undefined : routeIdentifier.split('.')[0],
                      )
                    }
                    routeIdentifier={routeIdentifier}
                    trackerLayer={trackerLayer}
                  >
                    <Filter focusable={false} />
                  </FilterButton>
                  <FollowButton
                    setCenter={coord => dispatchSetCenter(coord)}
                    title="Follow"
                    active={followActive}
                    onClick={active =>
                      this.setState({
                        followActive: active,
                      })
                    }
                    routeIdentifier={routeIdentifier}
                    trackerLayer={trackerLayer}
                  >
                    <Follow focusable={false} />
                  </FollowButton>
                </>
              )}
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
  routeFilter: state.app.routeFilter,
  layerService: state.app.layerService,
});

const mapDispatchToProps = {
  dispatchSetCenter: setCenter,
  dispatchSetMenuOpen: setMenuOpen,
  dispatchSetLineFilter: setLineFilter,
  dispatchSetRouteFilter: setRouteFilter,
  dispatchSetOperatorFilter: setOperatorFilter,
};

TrackerMenu.propTypes = propTypes;
TrackerMenu.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TrackerMenu);
