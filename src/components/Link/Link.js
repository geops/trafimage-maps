import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as LinkIcon } from './Link.svg';

import './Link.scss';

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const defaultProps = {};

const Link = ({ href, children }) => (
  <a className="wkp-link" href={href} rel="noopener noreferrer" target="_blank">
    {children}
    <LinkIcon />
  </a>
);

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;
