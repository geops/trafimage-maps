import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as LinkIcon } from './Link.svg';

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const defaultProps = {};

function Link({ href, children }) {
  return (
    <a
      className="wkp-link"
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
