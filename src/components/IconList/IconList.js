import React, { PureComponent, createRef } from 'react';
import ReactDOM from 'react-dom';
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
  displayOnTop: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  disabled: false,
  selected: null,
  iconSize: {
    height: 16,
    width: 42,
  },
  displayOnTop: false,
};

class IconList extends PureComponent {
  constructor(props) {
    super(props);

    this.ref = createRef();

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

    const label = <div className="wkp-icon-list-label">{t(opt)}</div>;

    return opt && icons[opt] ? (
      <>
        <div className="wkp-icon-list-icon">
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

  renderList() {
    const { displayOnTop, options, onSelect } = this.props;

    const list = (
      <List
        items={options}
        className="tm-list wkp-icon-list-list"
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
    );

    if (displayOnTop) {
      const rect = this.ref.current.getBoundingClientRect();
      const listStyles = {
        top: `${rect.top + rect.height}px`,
        left: `${rect.left}px`,
      };

      const targetElements = document.getElementsByClassName(
        'tm-trafimage-maps',
      );

      if (!targetElements || !targetElements.length) {
        return null;
      }

      return ReactDOM.createPortal(
        <div
          role="button"
          tabIndex={0}
          className="wkp-icon-list-modal"
          onClick={() => {
            this.setState({
              iconListVis: false,
            });
          }}
          onKeyPress={() => {}}
        >
          <div className="wkp-icon-list-modal-pos" style={listStyles}>
            {list}
          </div>
        </div>,
        targetElements[0],
      );
    }

    return <div className="wkp-icon-list-non-modal">{list}</div>;
  }

  render() {
    const { disabled } = this.props;
    const { iconListVis, selectedOption } = this.state;

    return (
      <div ref={this.ref}>
        <Button
          className="wkp-icon-list-button"
          onClick={() => {
            if (disabled) {
              return;
            }
            this.setState({ iconListVis: !iconListVis });
          }}
        >
          <div className="wkp-icon-list-current">
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
        {iconListVis && !disabled ? this.renderList() : null}
      </div>
    );
  }
}

IconList.propTypes = propTypes;
IconList.defaultProps = defaultProps;

export default compose(withTranslation())(IconList);
