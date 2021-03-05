import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { MdLoop } from 'react-icons/md';
import { withTranslation } from 'react-i18next';
import qs from 'query-string';

import DestinationInput from './DestinationInput';

import { ReactComponent as SBBClock } from '../../img/clock_10_large.svg';
import { setDeparturesFilter } from '../../model/app/actions';

import './DeparturePopupContent.scss';

const DESTINATION_FILTER = 'destination';

const propTypes = {
  uic: PropTypes.number.isRequired,

  icon: PropTypes.object,

  name: PropTypes.string.isRequired,

  showTitle: PropTypes.bool,

  // react-i18next
  t: PropTypes.func.isRequired,

  // mapStateToProps
  departuresUrl: PropTypes.string.isRequired,
  destinationUrl: PropTypes.string.isRequired,
  apiKey: PropTypes.string,

  // mapDispatchToProps
  dispatchSetDeparturesFilter: PropTypes.func.isRequired,
};

const defaultProps = {
  icon: null,
  showTitle: false,
  apiKey: null,
};

class DeparturePopupContent extends Component {
  static updatePermalink(destination) {
    const oldParams = qs.parse(window.location.search);
    const parameters = {
      ...oldParams,
      ...{
        [DESTINATION_FILTER]: destination ? destination.label : null,
      },
    };
    const qStr = qs.stringify(parameters);
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

  static getDelayColor(estimatedTimeLocal, timetabledTimeLocal) {
    if (!estimatedTimeLocal || !timetabledTimeLocal) {
      return 'green';
    }

    const min = Math.floor(
      (new Date(estimatedTimeLocal) - new Date(timetabledTimeLocal)) /
        1000 /
        60,
    );
    if (min >= 3 && min < 5) {
      return 'orange';
    }
    if (min >= 5) {
      return 'red';
    }
    return 'green';
  }

  constructor(props) {
    super(props);

    this.state = {
      departures: [],
      departuresLoading: true,
      destinationFilter: null,
      platformName: 'abfahrtszeiten_kante',
    };
    this.loadInterval = null;
    this.mounted = false;
  }

  componentDidMount() {
    const { destinationUrl, dispatchSetDeparturesFilter, uic } = this.props;
    const { destinationFilter } = this.state;
    this.mounted = true;
    this.loadDepartures();
    this.loadInterval = window.setInterval(() => this.loadDepartures(), 5000);

    dispatchSetDeparturesFilter(uic.toString());

    const parameters = qs.parse(window.location.search);
    if (parameters[DESTINATION_FILTER]) {
      const url = `${destinationUrl}/${uic}?&destination=${parameters[DESTINATION_FILTER]}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const destination = data
            ? {
                label: data[0].dest,
                id: data[0].stop,
              }
            : null;
          this.onDestinationSelect(destination);
        });
    } else {
      this.onDestinationSelect(destinationFilter);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    window.clearInterval(this.loadInterval);
  }

  /**
   * On selection of a destination in the input.
   * @private
   */
  onDestinationSelect(selectedDestination) {
    this.setState({
      destinationFilter: selectedDestination,
    });
    DeparturePopupContent.updatePermalink(selectedDestination);
    this.loadDepartures();
  }

  /**
   * Load departures.
   * @param {string} destination Selected destination.
   * @private
   */
  loadDepartures() {
    const { apiKey, uic, departuresUrl } = this.props;
    const { destinationFilter } = this.state;

    const urlParams = {
      key: apiKey,
      limit: '20',
    };
    if (uic) {
      urlParams.uic = uic;
    }

    if (destinationFilter) {
      urlParams.destination_uic = `${destinationFilter.id}`;
    }

    const url = `${departuresUrl}/?${qs.stringify(urlParams)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // HACK to prevent "update of unmounted component" warning
        if (!this.mounted) {
          return;
        }
        if (data.error) {
          // eslint-disable-next-line no-console
          console.warn(data.error);
          return;
        }
        // mode of transport does not change between departures
        const platformType =
          data && data.length ? data[0].modeOfTransport : null;
        let platformName = null;

        switch (platformType) {
          case 'rail':
            platformName = 'abfahrtszeiten_gleis';
            break;
          case 'water':
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
    const { uic, name, icon, showTitle, t } = this.props;
    let { departures } = this.state;
    departures = departures.slice(0, 9);
    const { destinationFilter, departuresLoading, platformName } = this.state;

    let title = null;
    if (showTitle) {
      const text = `${t('Abfahrtszeiten')} ${name}`;

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
      <div className="tm-departure-popup-body">
        {icon}
        {title}

        <DestinationInput
          destination={destinationFilter}
          onSelect={(d) => this.onDestinationSelect(d)}
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
                <th
                  style={{
                    padding: '1px 7px 1px 3px',
                  }}
                >
                  {t('Linie')}
                </th>
                <th>{t('Ziel')}</th>
                <th colSpan="2">
                  <SBBClock focusable={false} height="23px" width="23px" />
                </th>
                <th>{t(platformName)}</th>
              </tr>
              {departures.map((d, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={idx}>
                  <td
                    style={{
                      padding: '1px 7px 1px 3px',
                    }}
                  >
                    <div className="tm-departure-name">{d.lineName}</div>
                  </td>
                  <td>
                    <div className="tm-departure-destination">
                      {d.destinationText}
                    </div>
                  </td>
                  <td>
                    {DeparturePopupContent.formatTime(d.timetabledTimeLocal)}
                  </td>
                  <td>
                    <div
                      className="tm-departure-min"
                      style={{
                        color: DeparturePopupContent.getDelayColor(
                          d.estimatedTimeLocal,
                          d.timetabledTimeLocal,
                        ),
                      }}
                    >
                      {DeparturePopupContent.getMinDiff(
                        d.estimatedTimeLocal || d.timetabledTimeLocal,
                      )}
                    </div>
                  </td>
                  <td>
                    <div
                      className={
                        'tm-departure-platform ' +
                        `${d.modeOfTransport === 'rail' ? 'train' : ''}`
                      }
                    >
                      <div className="tm-platform-inner">{d.plannedQuay}</div>
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

const mapStateToProps = (state) => ({
  departuresUrl: state.app.departuresUrl,
  destinationUrl: state.app.destinationUrl,
  apiKey: state.app.apiKey,
});

const mapDispatchToProps = {
  dispatchSetDeparturesFilter: setDeparturesFilter,
};

DeparturePopupContent.propTypes = propTypes;
DeparturePopupContent.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(DeparturePopupContent);
