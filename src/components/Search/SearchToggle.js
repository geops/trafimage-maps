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
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className={`wkp-search-toggle-container${open ? '--open' : ''}`}>
        {children}
      </div>
      {!open && (
        <button
          className="wkp-search-toggle-button"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <SearchIcon />
        </button>
      )}
    </div>
  );
}

SearchToggle.propTypes = propTypes;
SearchToggle.defaultProps = defaultProps;

export default SearchToggle;
