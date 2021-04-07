import PropTypes from 'prop-types';
import { ReactComponent as LinkSvg } from '../../img/link.svg';

import './Link.scss';

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const defaultProps = {};

const Link = ({ href, children }) => (
  <a className="wkp-link" href={href} rel="noopener noreferrer" target="_blank">
    <span>{children}</span>&nbsp;
    <LinkSvg />
  </a>
);

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;
