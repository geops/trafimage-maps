import React from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { ReactComponent as SBBGlobe } from '../../img/sbb/globe_210_large.svg';

import './SingleValue.scss';

const propTypes = {
  selectProps: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const SingleValue = (props) => {
  const { selectProps, data } = props;
  return (
    <div
      className={`wkp-single-value-wrapper${
        selectProps.menuIsOpen ? ' wkp-menu-opened' : ''
      }`}
    >
      <SBBGlobe focusable={false} className="wkp-single-value-globe" />
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
export default SingleValue;
