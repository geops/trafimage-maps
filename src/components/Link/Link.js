import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as LinkIcon } from './Link.svg';

import './Link.scss';

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const Link = ({ href, children }) => {
  return (
    <a
      className="wkp-link"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <LinkIcon />
      {children}
    </a>
  );
};

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;
