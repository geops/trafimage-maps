import React from "react";
import PropTypes from "prop-types";
import { Link as MuiLink } from "@mui/material";
import { ReactComponent as LinkIcon } from "./Link.svg";

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
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none !important",
        "& span": {
          textOverflow: "ellipsis",
          maxWidth: 380,
          overflow: "hidden",
          display: "inline-block",
        },
        "& svg": { minHeight: 16, minWidth: 16, marginLeft: "5px" },
      }}
    >
      <span>{children}</span>
      <LinkIcon />
    </MuiLink>
  );
}

Link.propTypes = propTypes;

export default Link;
