import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchOpen } from '../../model/app/actions';
import { ReactComponent as SearchIcon } from './Search.svg';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

function SearchToggle({ children }) {
  const searchOpen = useSelector(state => state.app.searchOpen);
  const dispatch = useDispatch();

  return (
    <div>
      <div
        className={`wkp-search-toggle-container${searchOpen ? '--open' : ''}`}
      >
        {children}
      </div>
      {!searchOpen && (
        <button
          className="wkp-search-toggle-button"
          type="button"
          onClick={() => dispatch(setSearchOpen(true))}
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
