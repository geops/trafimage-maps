import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchOpen } from '../../model/app/actions';
import { ReactComponent as SearchBigIcon } from '../../img/searchbig.svg';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

function SearchToggle({ children }) {
  const searchOpen = useSelector((state) => state.app.searchOpen);
  const { t } = useTranslation();
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
          <SearchBigIcon />
          <span>{t('Suchen')}</span>
        </button>
      )}
    </div>
  );
}

SearchToggle.propTypes = propTypes;
SearchToggle.defaultProps = defaultProps;

export default SearchToggle;
