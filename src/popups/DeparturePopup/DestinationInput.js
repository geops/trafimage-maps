import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Autocomplete from 'react-spatial/components/Autocomplete';

import { ReactComponent as SearchIcon } from '../../img/search.svg';

import './DestinationInput.scss';

const propTypes = {
  destination: PropTypes.string,
  platforms: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  uic: PropTypes.number.isRequired,

  // react-i18next
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  destination: '',
  platforms: null,
};

class DestinationInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destinations: [],
      destinationInputValue: props.destination,
    };

    // Abort fetch requests
    this.abortController = new AbortController();

    this.loadDestinations(props.destination);
  }

  /**
   * Fired if user selects a destination from the input
   * @param {string} value Selected value.
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

  /**
   * Selection is selected by click or key event.
   */
  selectDestination(item) {
    const { onSelect } = this.props;
    onSelect(item.label);
    this.setState({
      destinations: [],
      destinationInputValue: item.label,
    });
  }

  /**
   * Load destinations.
   * @param {string} destination Selected destination.
   */
  loadDestinations(value) {
    const { uic, platforms } = this.props;

    const url =
      `${process.env.REACT_APP_DEPARTURE_URL}/destinations/${uic}` +
      `?platforms=${platforms || ''}&destination=${value}`;

    this.abortController.abort();
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    fetch(url, { signal })
      .then(response => response.json())
      .then(data => {
        const destinations = data.map((d, i) => ({
          id: i,
          label: d,
        }));

        this.setState({ destinations });
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          // eslint-disable-next-line no-console
          console.warn(`Abort ${url}`);
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
          value={destinationInputValue}
          items={destinations}
          placeholder={t('Direkt erreichbares Ziel auswählen')}
          renderItem={item => item.label}
          getItemKey={item => item.id}
          onChange={value => {
            this.onInputChange(value);
          }}
          onSelect={item => {
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

DestinationInput.propTypes = propTypes;
DestinationInput.defaultProps = defaultProps;

export default withTranslation()(DestinationInput);
