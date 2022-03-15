import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Autocomplete from '../../components/Autocomplete';

import { ReactComponent as SearchIcon } from '../../img/search.svg';

import './DestinationInput.scss';

const propTypes = {
  destination: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  uic: PropTypes.number.isRequired,

  // mapStateToProps
  destinationUrl: PropTypes.string.isRequired,

  // react-i18next
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  destination: '',
};

class DestinationInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destinations: [],
      destinationInputValue: props.destination ? props.destination.label : null,
    };

    // Abort fetch requests
    this.abortController = new AbortController();

    this.loadDestinations(props.destination);
  }

  componentDidUpdate(prevProps) {
    const { destination } = this.props;

    if (destination !== prevProps.destination) {
      this.updateInputValue(destination.label);
    }
  }

  componentWillUnmount() {
    const { onSelect } = this.props;

    onSelect(undefined);
  }

  /**
   * Fired if user selects a destination from the input
   * @param {string} value Selected value.
   * @private
   */
  onInputChange(value) {
    const { onSelect } = this.props;
    this.setState({ destinationInputValue: value });
    if (value) {
      this.loadDestinations(value);
    } else {
      this.setState({ destinations: [] });
      onSelect(undefined);
    }
  }

  updateInputValue(val) {
    this.setState({ destinationInputValue: val });
  }

  /**
   * Selection is selected by click or key event.
   * @private
   */
  selectDestination(item) {
    const { onSelect } = this.props;
    onSelect(item);
    this.setState({
      destinations: [],
      destinationInputValue: item.label,
    });
  }

  /**
   * Load destinations.
   * @param {string} destination Selected destination.
   * @private
   */
  loadDestinations(value) {
    const { uic, destinationUrl } = this.props;

    if (!value) {
      return;
    }
    const url = `${destinationUrl}/${uic}?&destination=${value}`;

    this.abortController.abort();
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    fetch(url, { signal })
      .then((response) => response.json())
      .then((data) => {
        const destinations = data.map(({ dest, stop }) => ({
          id: stop,
          label: dest,
        }));

        this.setState({ destinations });
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          // eslint-disable-next-line no-console
          // console.warn(`Abort ${url}`);
          return;
        }
        // It's important to rethrow all other errors so you don't silence them!
        // For example, any error thrown by setState(), will pass through here.
        throw err;
      });
  }

  render() {
    const { destinations, destinationInputValue } = this.state;
    const { t } = this.props;

    return (
      <div className="tm-departure-input">
        <Autocomplete
          button={<SearchIcon />}
          value={destinationInputValue || ''}
          items={destinations}
          placeholder={t('Direkt erreichbares Ziel auswählen')}
          renderItem={(item) => item.label}
          getItemKey={(item) => item.id}
          onChange={(value) => {
            this.onInputChange(value);
          }}
          onSelect={(item) => {
            if (!item) {
              return;
            }
            this.selectDestination(item);
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  destinationUrl: state.app.destinationUrl,
});

DestinationInput.propTypes = propTypes;
DestinationInput.defaultProps = defaultProps;

export default compose(
  withTranslation(),
  connect(mapStateToProps, null),
)(DestinationInput);
