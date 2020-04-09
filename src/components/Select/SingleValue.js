import React from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';

import './SingleValue.scss';

const propTypes = {
  selectProps: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  selectLabel: PropTypes.object,
  singleValueClassName: PropTypes.string,
};

const defaultProps = {
  selectLabel: null,
  singleValueClassName: null,
};

const SingleValue = (props) => {
  const { selectLabel, selectProps, data, singleValueClassName } = props;
  return (
    <div
      className={`wkp-single-value-wrapper${
        selectProps.menuIsOpen ? ' wkp-select-menu-opened' : ''
      }${singleValueClassName ? ` ${singleValueClassName}` : ''}`}
    >
      {selectLabel}
      <div className="wkp-single-value-selected">
        {selectProps.getOptionLabel(data)}
      </div>
      <MdKeyboardArrowDown
        focusable={false}
        className={`wkp-select-toggle${
          selectProps.menuIsOpen ? ' wkp-select-toggle-rotate' : ''
        }`}
      />
    </div>
  );
};

SingleValue.propTypes = propTypes;
SingleValue.defaultProps = defaultProps;

export default SingleValue;
