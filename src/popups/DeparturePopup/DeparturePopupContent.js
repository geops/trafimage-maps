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

  platform: PropTypes.string,

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
  platform: undefined, // important to avoid the platform param to be add in the url.
};

class DeparturePopupContent extends Component {
  static updatePermalink(destination) {
    const oldParams = qs.parse(window.location.search);
    const parameters = {
      ...oldParams,
      ...{
        [DESTINATION_FILTER]: destination ? destination.label : undefined,
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
    const min = Math.floor((new Date(time) - new Date()) / 1000 / 60);
    if (min < 0) {
      return null;
    }
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
      isOffline: false,
    };
    this.loadInterval = null;
    this.mounted = false;
    this.abortController = new AbortController();
  }

  componentDidMount() {
    const { destinationUrl, dispatchSetDeparturesFilter, uic, platform } =
      this.props;
    const { destinationFilter } = this.state;
    this.mounted = true;
    this.loadDepartures();
    this.loadInterval = window.setInterval(() => this.loadDepartures(), 5000);

    dispatchSetDeparturesFilter(uic.toString(), platform);

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
        })
        .catch(() => {});
    } else {
      this.onDestinationSelect(destinationFilter);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { destinationFilter } = this.state;

    if (destinationFilter !== prevState.destinationFilter) {
      this.loadDepartures();
    }
  }

  componentWillUnmount() {
    const { dispatchSetDeparturesFilter } = this.props;
    this.abortController.abort();
    this.mounted = false;
    window.clearInterval(this.loadInterval);
    dispatchSetDeparturesFilter();
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
      limit: '30',
    };
    if (uic) {
      urlParams.uic = uic;
    }

    if (destinationFilter) {
      urlParams.destination_uic = `${destinationFilter.id}`;
    }

    const url = `${departuresUrl}/?${qs.stringify(urlParams)}`;
    this.abortController.abort();
    this.abortController = new AbortController();
    fetch(url, { signal: this.abortController.signal })
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
          isOffline: !navigator.onLine,
        });
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') {
          // ignore user abort request
          return;
        }
        this.setState({
          departuresLoading: false,
          isOffline: true,
        });
      });
  }

  renderMinDiff(minDiff) {
    const { isOffline } = this.state;
    if (isOffline && minDiff) {
      return <>&nbsp;&nbsp;-&nbsp;</>;
    }
    return minDiff;
  }

  render() {
    const { uic, icon, showTitle, t } = this.props;
    let { departures } = this.state;
    departures = departures.sort(
      (a, b) =>
        new Date(a.estimatedTimeLocal || a.timetabledTimeLocal).getTime() -
        new Date(b.estimatedTimeLocal || b.timetabledTimeLocal).getTime(),
    );
    const { destinationFilter, departuresLoading, platformName, isOffline } =
      this.state;

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
        {showTitle && (
          <div className="tm-departure-title">
            {`${t(`Abfahrtszeiten aller ${platformName}`)}`}
          </div>
        )}

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
                <th className="tm-departure-line-cell">{t('Linie')}</th>
                <th>{t('Ziel')}</th>
                <th colSpan="2">
                  <SBBClock focusable={false} height="23px" width="23px" />
                </th>
                <th>
                  {t(platformName)[0].toUpperCase() +
                    t(platformName).substring(1)}
                </th>
              </tr>
              {departures.map((departure, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={idx}>
                  <td className="tm-departure-line-cell">
                    <div className="tm-departure-name">
                      {departure.lineName}
                    </div>
                  </td>
                  <td>
                    <div className="tm-departure-destination">
                      {departure.destinationText}
                    </div>
                  </td>
                  <td>
                    {DeparturePopupContent.formatTime(
                      departure.timetabledTimeLocal,
                    )}
                  </td>
                  <td>
                    <div
                      className="tm-departure-min"
                      style={{
                        color: isOffline
                          ? '#333'
                          : DeparturePopupContent.getDelayColor(
                              departure.estimatedTimeLocal,
                              departure.timetabledTimeLocal,
                            ),
                      }}
                    >
                      {this.renderMinDiff(
                        DeparturePopupContent.getMinDiff(
                          departure.estimatedTimeLocal ||
                            departure.timetabledTimeLocal,
                        ),
                      )}
                    </div>
                  </td>
                  <td>
                    <div
                      className={
                        'tm-departure-platform ' +
                        `${departure.modeOfTransport === 'rail' ? 'train' : ''}`
                      }
                    >
                      <div className="tm-platform-inner">
                        {departure.plannedQuay}
                      </div>
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
