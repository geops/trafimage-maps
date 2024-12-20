import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setSearchOpen } from "../../model/app/actions";
import { ReactComponent as SearchIcon } from "./Search.svg";
import SearchInfo from "./SearchInfo";

const propTypes = {
  children: PropTypes.node,
  popupAnchor: PropTypes.instanceOf(Element),
};

function SearchToggle({ popupAnchor, children }) {
  const searchOpen = useSelector((state) => state.app.searchOpen);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <div>
      <div
        className={`wkp-search-toggle-container${searchOpen ? "--open" : ""}`}
      >
        {children}
        <SearchInfo anchorEl={popupAnchor} />
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

SearchToggle.propTypes = propTypes;

export default SearchToggle;
