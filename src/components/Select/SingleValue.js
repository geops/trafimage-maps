import React, { useMemo } from 'react';
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

const SingleValue = ({
  selectLabel,
  selectProps,
  data,
  singleValueClassName,
}) => {
  const classNameWrapper = useMemo(() => {
    return `wkp-single-value-wrapper${
      selectProps.menuIsOpen ? ' wkp-select-menu-opened' : ''
    }${singleValueClassName ? ` ${singleValueClassName}` : ''}`;
  }, [selectProps, singleValueClassName]);

  const classNameArrow = useMemo(() => {
    return `wkp-select-toggle${
      selectProps.menuIsOpen ? ' wkp-select-toggle-rotate' : ''
    }`;
  }, [selectProps]);

  return (
    <div
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex="0"
      className={classNameWrapper}
    >
      {selectLabel}
      <div className="wkp-single-value-selected">
        {selectProps.getOptionLabel(data)}
      </div>
      <MdKeyboardArrowDown focusable={false} className={classNameArrow} />
    </div>
  );
};

SingleValue.propTypes = propTypes;
SingleValue.defaultProps = defaultProps;

export default React.memo(SingleValue);
