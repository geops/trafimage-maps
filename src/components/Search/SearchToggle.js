import PropTypes from "prop-types";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useTranslation from "../../utils/useTranslation";
import { setSearchOpen } from "../../model/app/actions";
import { ReactComponent as SearchIcon } from "./Search.svg";
import SearchInfo from "./SearchInfo";

function SearchToggle({ children }) {
  const searchOpen = useSelector((state) => state.app.searchOpen);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <div>
      <div
        className={`wkp-search-toggle-container${searchOpen ? "--open" : ""}`}
      >
        {children}
        <SearchInfo />
      </div>
      {!searchOpen && (
        <button
          className="wkp-search-toggle-button"
          type="button"
          onClick={() => dispatch(setSearchOpen(true))}
        >
          <SearchIcon />
          <span>{t("Suchen")}</span>
        </button>
      )}
    </div>
  );
}

SearchToggle.propTypes = {
  children: PropTypes.node,
};

export default SearchToggle;
