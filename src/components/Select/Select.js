import { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import SingleValue from './SingleValue';

const propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  styles: PropTypes.object.isRequired,
  singleValueClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  selectLabel: PropTypes.element,
};

const defaultProps = {
  selectLabel: null,
  singleValueClassName: null,
};

const Select = ({
  options,
  value,
  styles,
  onChange,
  singleValueClassName,
  selectLabel,
}) => {
  const ref = useRef();
  return (
    <ReactSelect
      ref={ref}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter' && !ref.current.state.menuIsOpen) {
          ref.current.onMenuOpen();
        }
      }}
      options={options}
      isSearchable={false}
      value={value}
      styles={styles}
      components={{
        SingleValue: (singleValueProps) => (
          <SingleValue
            selectLabel={selectLabel}
            singleValueClassName={singleValueClassName}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...singleValueProps}
          />
        ),
      }}
      onChange={onChange}
    />
  );
};

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default memo(Select);
