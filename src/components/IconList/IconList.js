import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from '@geops/react-ui/components/List';
import Button from '@geops/react-ui/components/Button';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './IconList.scss';

const propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.array.isRequired,
  selected: PropTypes.string,
  icons: PropTypes.object.isRequired,

  /**
   * Icon size in pixels
   */
  iconSize: PropTypes.shape({
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),

  onSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  disabled: false,
  selected: null,
  iconSize: {
    height: 16,
    width: 42,
  },
};

class IconList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: props.selected,
      iconListVis: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { selected } = this.props;

    if (selected !== prevProps.selected) {
      this.select(selected);
    }
  }

  select(option) {
    this.setState({
      selectedOption: option,
    });
  }

  renderOption(option) {
    const { icons, t, options, iconSize } = this.props;

    const opt = option || (options.length ? options[0] : null);

    const label = <div className="wkp-image-dropdown-label">{t(opt)}</div>;

    return opt && icons[opt] ? (
      <>
        <div className="wkp-image-dropdown-icon">
          <img
            src={icons[option]}
            height={iconSize.height}
            width={iconSize.width}
            draggable="false"
            alt={t('Kein Bildtext')}
          />
        </div>
        {label}
      </>
    ) : (
      label
    );
  }

  render() {
    const { disabled, options, onSelect } = this.props;
    const { iconListVis, selectedOption } = this.state;

    return (
      <div>
        <Button
          className="wkp-image-dropdown-button"
          onClick={() => {
            if (disabled) {
              return;
            }
            this.setState({ iconListVis: !iconListVis });
          }}
        >
          <div className="wkp-image-dropdown-current">
            {this.renderOption(selectedOption)}
          </div>
          <div className="pe-caret">
            {iconListVis ? (
              <FaCaretUp focusable={false} />
            ) : (
              <FaCaretDown focusable={false} />
            )}
          </div>
        </Button>
        {iconListVis && !disabled ? (
          <List
            items={options}
            className="tm-list wkp-image-dropdown-list"
            renderItem={option => this.renderOption(option)}
            getItemKey={option => option}
            onSelect={(e, option) => {
              onSelect(option);
              this.setState({
                iconListVis: false,
                selectedOption: option,
              });
            }}
          />
        ) : null}
      </div>
    );
  }
}

IconList.propTypes = propTypes;
IconList.defaultProps = defaultProps;

export default compose(withTranslation())(IconList);
