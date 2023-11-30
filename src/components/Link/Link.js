import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as LinkIcon } from "./Link.svg";

import "./Link.scss";

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: "",
};

function Link({ href, children, className }) {
  return (
    <a
      className={`wkp-link ${className}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{children}</span>
      <LinkIcon />
    </a>
  );
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;
