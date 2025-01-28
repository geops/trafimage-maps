import React, { useRef } from "react";
import SearchInput from "./SearchInput";
import SearchToggle from "./SearchToggle";

import "./Search.scss";

function Search() {
  const searchContainerRef = useRef();

  return (
    <div className="wkp-search" ref={searchContainerRef}>
      <SearchToggle popupAnchor={searchContainerRef?.current}>
        <SearchInput />
      </SearchToggle>
    </div>
  );
}

export default React.memo(Search);
