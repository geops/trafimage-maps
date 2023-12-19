import React, { PureComponent, createRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import Button from "../Button";
import List from "../List";

import "./IconList.scss";

const propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.array.isRequired,
  selected: PropTypes.string,
  icons: PropTypes.object.isRequired,

  /**
   * Icon size in pixels
   * @private
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

    this.hideList = this.hideList.bind(this);
    this.evtTypes = ["wheel", "click", "touchstart"];
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.evtTypes.forEach((type) => {
      document.body.addEventListener(type, this.hideList);
    });
  }

  componentDidUpdate(prevProps) {
    const { selected } = this.props;

    if (selected !== prevProps.selected) {
      this.select(selected);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.evtTypes.forEach((type) => {
      document.body.removeEventListener(type, this.hideList);
    });
  }

  select(option) {
    this.setState({
      selectedOption: option,
    });
  }

  hideList(evt) {
    if (!this.mounted) {
      return;
    }
    const { iconListVis } = this.state;
    if (iconListVis) {
      if (!this.ref.current) {
        return;
      }

      const isInsideList = !!(
        evt.target && this.ref.current.contains(evt.target)
      );
      if (isInsideList) {
        // Don't hide the list if the event comes form inside the IconList.
        return;
      }
      this.setState({
        iconListVis: false,
      });
    }
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
            alt={t("Kein Bildtext")}
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
        renderItem={(option) => this.renderOption(option)}
        getItemKey={(option) => option}
        onSelect={(e, option) => {
          onSelect(option);
          this.setState({
            iconListVis: false,
            selectedOption: option,
          });
        }}
      />
    );
    const rect = this.ref.current.getBoundingClientRect();
    const listStyles = {
      top: `${rect.top + rect.height}px`,
      left: `${rect.left}px`,
    };

    if (displayOnTop) {
      const targetElements =
        document.getElementsByClassName("tm-trafimage-maps");

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

    return (
      <div className="wkp-icon-list-non-modal" style={listStyles}>
        {list}
      </div>
    );
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
            if (!this.mounted) {
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

// Don't use HOC components here, it will breaks the app in handicap branch.
// This component is only used by a Layer class.
export default IconList;
