import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import { MdLoop } from 'react-icons/md';
import { withTranslation } from 'react-i18next';
import qs from 'querystring';

import DestinationInput from './DestinationInput';
import CONF from '../../config/appConfig';

import './TransportPopup.scss';

const propTypes = {
  uic: PropTypes.number.isRequired,

  platforms: PropTypes.string,

  icon: PropTypes.object,

  name: PropTypes.string.isRequired,

  showTitle: PropTypes.boolean,

  // react-i18next
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  platforms: null,
  icon: null,
  showTitle: false,
};

class TransportPopup extends Component {
  static formatTime(time) {
    const d = new Date(time);

    return [`0${d.getHours()}`.slice(-2), `0${d.getMinutes()}`.slice(-2)].join(
      ':',
    );
  }

  static getMinDiff(time) {
    const min = Math.floor(Math.abs(new Date(time) - new Date()) / 1000 / 60);
    return min > 0 && min < 60 ? [min, "'"].join('') : null;
  }

  constructor(props) {
    super(props);

    this.state = {
      departures: [],
      departuresLoading: true,
      platformName: 'abfahrtszeiten_kante',
    };

    this.selectedDestination = null;
    this.loadInterval = null;
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.loadDepartures();
    this.loadInterval = window.setInterval(() => this.loadDepartures(), 5000);
  }

  componentWillUnmount() {
    this.mounted = false;
    window.clearInterval(this.loadInterval);
  }

  /**
   * On selection of a destination in the input.
   */
  onDestinationSelect(selectedDestination) {
    this.selectedDestination = selectedDestination;
    this.loadDepartures(selectedDestination);
  }

  /**
   * Load departures.
   * @param {string} destination Selected destination.
   */
  loadDepartures() {
    const { platforms, uic } = this.props;

    const urlParams = {};

    if (platforms) {
      urlParams.platforms = `${platforms || ''}`;
    }

    if (this.selectedDestination) {
      urlParams.destination = `${this.selectedDestination}`;
    }

    const url = `${CONF.departureUrl}/departures/${uic}?${qs.stringify(
      urlParams,
    )}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // HACK to prevent "update of unmounted component" warning
        if (!this.mounted) {
          return;
        }

        // platform type does not change between departures
        const platformType = data && data.length ? data[0].type : null;
        let platformName = null;

        switch (platformType) {
          case 2:
            platformName = 'abfahrtszeiten_gleis';
            break;
          case 4:
            platformName = 'abfahrtszeiten_steg';
            break;
          default:
            platformName = 'abfahrtszeiten_kante';
            break;
        }

        this.setState({
          departures: data,
          departuresLoading: false,
          platformName,
        });
      });
  }

  render() {
    const { platforms, uic, name, icon, showTitle, t } = this.props;

    const { departuresLoading, platformName } = this.state;
    let { departures } = this.state;
    departures = departures.slice(0, 7);

    let platformsFormatted = platforms || '';
    platformsFormatted = platformsFormatted
      .split(',')
      .filter(v => v)
      .join(', ');

    let title = null;
    if (showTitle) {
      const text = platformsFormatted
        ? `${t('Abfahrtszeiten')} ${t(platformName)} ${platformsFormatted}`
        : `${t('Abfahrtszeiten')} ${name}`;

      title = (
        <div className="tm-departure-title" title={text}>
          {text}
        </div>
      );
    }

    const loading = departuresLoading ? (
      <div className="tm-loader">
        <MdLoop className="tm-load-spinner" focusable={false} />
      </div>
    ) : null;

    let info = null;

    if (!departuresLoading && departures.length === 0) {
      info = (
        <p>
          <i>
            {`${t(
              'Für den aktuellen Zeitraum konnten keine ' +
                'Verbindungen gefunden werden',
            )}.`}
          </i>
        </p>
      );
    }

    return (
      <div className="tm-transport-popup-body">
        <div className="tm-popup-title">{name}</div>

        {icon}
        {title}

        <DestinationInput
          platforms={platformsFormatted}
          onSelect={d => this.onDestinationSelect(d)}
          uic={uic}
        />

        {loading}
        {info}

        <div
          className={`tm-table-wrapper${departuresLoading ? ' loading' : ''}`}
        >
          <table className="tm-departures">
            <tbody>
              <tr>
                <th>{t('Linie')}</th>
                <th>{t('Ziel')}</th>
                <th colSpan="2">{t('Planmässige Abfahrt')}</th>
              </tr>
              {departures.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="tm-departure-name">{d.label}</div>
                  </td>
                  <td>
                    <div className="tm-departure-destination">
                      {d.destination}
                    </div>
                  </td>
                  <td>{TransportPopup.formatTime(d.time)}</td>
                  <td>
                    <div
                      className={
                        'tm-departure-platform ' +
                        `${d.type === 2 ? 'train' : ''}`
                      }
                    >
                      <div className="tm-platform-inner">{d.platform}</div>
                    </div>
                  </td>
                  <td>
                    <div className="tm-departure-min">
                      {TransportPopup.getMinDiff(d.time)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

TransportPopup.propTypes = propTypes;
TransportPopup.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(),
)(TransportPopup);
