import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import { MdLoop } from 'react-icons/md';
import { withTranslation } from 'react-i18next';
import qs from 'query-string';

import DestinationInput from './DestinationInput';
import CONF from '../../config/appConfig';

import { setDeparturesFilter } from '../../model/app/actions';

import './TransportPopupContent.scss';

const DESTINATION_FILTER = 'destination';

const propTypes = {
  uic: PropTypes.number.isRequired,

  platforms: PropTypes.string,

  icon: PropTypes.object,

  name: PropTypes.string.isRequired,

  showTitle: PropTypes.bool,

  // react-i18next
  t: PropTypes.func.isRequired,

  // TODO Eva Permalink und State wie im Pünktlichkeitslayer für destination nur hier

  // mapDispatchToProps
  dispatchSetDeparturesFilter: PropTypes.func.isRequired,
};

const defaultProps = {
  platforms: null,
  icon: null,
  showTitle: false,
};

class TransportPopupContent extends Component {
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

    const parameters = qs.parse(window.location.search);
    this.destinationFilter = parameters[DESTINATION_FILTER];

    this.loadInterval = null;
    this.mounted = false;
  }

  componentDidMount() {
    const { dispatchSetDeparturesFilter, uic } = this.props;

    this.mounted = true;
    this.loadDepartures();
    this.loadInterval = window.setInterval(() => this.loadDepartures(), 5000);

    dispatchSetDeparturesFilter(uic);

    this.onDestinationSelect(this.destinationFilter);
  }

  componentWillUnmount() {
    this.mounted = false;
    window.clearInterval(this.loadInterval);
  }

  /**
   * On selection of a destination in the input.
   */
  onDestinationSelect(selectedDestination) {
    this.destinationFilter = selectedDestination;
    this.updatePermalink();
    this.loadDepartures();
  }

  updatePermalink() {
    const oldParams = qs.parse(window.location.search);
    const parameters = {
      ...oldParams,
      ...{
        [DESTINATION_FILTER]: this.destinationFilter,
      },
    };
    const qStr = qs.stringify(parameters, { encode: false });
    const search = qStr ? `?${qStr}` : '';
    if (
      (!qStr && window.location.search) ||
      (qStr && search !== window.location.search)
    ) {
      const { hash } = window.location;
      window.history.replaceState(
        undefined,
        undefined,
        `${search}${hash || ''}`,
      );
    }
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

    if (this.destinationFilter) {
      urlParams.destination = `${this.destinationFilter}`;
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
          destination={this.destinationFilter}
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
                  <td>{TransportPopupContent.formatTime(d.time)}</td>
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
                      {TransportPopupContent.getMinDiff(d.time)}
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

const mapDispatchToProps = {
  dispatchSetDeparturesFilter: setDeparturesFilter,
};

TransportPopupContent.propTypes = propTypes;
TransportPopupContent.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(
    null,
    mapDispatchToProps,
  ),
)(TransportPopupContent);
