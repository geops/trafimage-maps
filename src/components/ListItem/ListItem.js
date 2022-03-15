import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Css class of the li tag.
   * @ignore
   */
  className: PropTypes.string,

  /**
   * Item of the list.
   * @ignore
   */
  item: PropTypes.any.isRequired,

  /**
   * Children content of the button.
   * @ignore
   */
  children: PropTypes.node.isRequired,

  /**
   * Function triggered when you select the item.
   * @ignore
   */
  onSelect: PropTypes.func,

  /**
   * Function triggered when you press a key.
   * @ignore
   */
  onKeyDown: PropTypes.func,
};

const defaultProps = {
  className: 'tm-list-item',
  onSelect: () => {},
  onKeyDown: () => {},
};

/**
 * This component displays a `<li>` tag.
 * @ignore
 */
class ListItem extends PureComponent {
  render() {
    const { className, children, item, onSelect, onKeyDown } = this.props;
    return (
      <li
        className={className}
        role="menuitem"
        tabIndex="0"
        onClick={(e) => {
          onSelect(e, item);
        }}
        onKeyPress={(e) => e.which === 13 && onSelect(e, item)}
        onKeyDown={(e) => {
          onKeyDown(e);
        }}
      >
        {children}
      </li>
    );
  }
}

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;
