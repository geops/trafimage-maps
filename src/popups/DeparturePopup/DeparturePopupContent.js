import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { MdLoop } from 'react-icons/md';
import { withTranslation } from 'react-i18next';
import qs from 'query-string';

import DestinationInput from './DestinationInput';

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

  constructor(props) {
    super(props);

    this.state = {
      departures: [],
      departuresLoading: true,
      destinationFilter: null,
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

        this.setState({
          departures: data,
          departuresLoading: false,
        });
      });
  }

  render() {
    const { uic, name, icon, showTitle, t } = this.props;

    const { departures, destinationFilter, departuresLoading } = this.state;

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
                <th>{t('Linie')}</th>
                <th>{t('Ziel')}</th>
                <th colSpan="2">{t('Planmässige Abfahrt')}</th>
              </tr>
              {departures.map((d, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={idx}>
                  <td>
                    <div className="tm-departure-name">{d.lineName}</div>
                  </td>
                  <td>
                    <div className="tm-departure-destination">
                      {d.destinationText}
                    </div>
                  </td>
                  <td>
                    {DeparturePopupContent.formatTime(
                      d.estimatedTimeLocal || d.timetabledTimeLocal,
                    )}
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
                  <td>
                    <div className="tm-departure-min">
                      {DeparturePopupContent.getMinDiff(
                        d.estimatedTimeLocal || d.timetabledTimeLocal,
                      )}
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
