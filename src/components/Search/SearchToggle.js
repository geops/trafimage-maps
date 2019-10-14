import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { ReactComponent as SearchIcon } from './Search.svg';

import './SearchToggle.scss';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

function SearchToggle({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="wkp-search-toggle">
      <div>{open ? children : null}</div>
      <button type="button" onClick={() => setOpen(!open)}>
        <SearchIcon />
      </button>
    </div>
  );
}

SearchToggle.propTypes = propTypes;
SearchToggle.defaultProps = defaultProps;

export default SearchToggle;
