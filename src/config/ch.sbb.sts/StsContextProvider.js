import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const StsContext = createContext();

function StsContextProvider({ children }) {
  const [showSearch, setShowSearch] = useState(false);
  const context = useMemo(
    () => ({
      showSearch,
      setShowSearch,
    }),
    [showSearch, setShowSearch],
  );
  return <StsContext.Provider value={context}>{children}</StsContext.Provider>;
}

StsContextProvider.propTypes = { children: PropTypes.node };

export default StsContextProvider;
