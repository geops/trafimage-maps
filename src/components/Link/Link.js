import React from "react";
import PropTypes from "prop-types";
import { Link as MuiLink } from "@mui/material";
import { ReactComponent as LinkIcon } from "./Link.svg";

import "./Link.scss";

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function Link({ href, children, className = "" }) {
  return (
    <MuiLink
      className={`wkp-link ${className}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{children}</span>
      <LinkIcon />
    </MuiLink>
  );
}

Link.propTypes = propTypes;

export default Link;
