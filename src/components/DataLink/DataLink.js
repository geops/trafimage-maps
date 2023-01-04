import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Link from '../Link';

const useStyles = makeStyles(() => {
  return {
    fullWidth: {
      justifyContent: 'space-between',
    },
  };
});

function DataLink({ children, layer, href, fullWidth }) {
  const { t } = useTranslation();
  const classes = useStyles();

  if (!layer && !href) {
    return null;
  }

  const dataLink = href || layer.get('dataLink');
  const dataLinkPortalName = layer?.get('dataLinkPortalName');

  if (!dataLink) {
    return null;
  }

  return (
    dataLink && (
      <Link href={dataLink} className={fullWidth ? classes.fullWidth : ''}>
        {children ||
          `${t('Diesen Datensatz einbinden')} (${
            t(dataLinkPortalName) || dataLinkPortalName || 'Open Data'
          })`}
      </Link>
    )
  );
}

DataLink.propTypes = {
  layer: PropTypes.shape({
    get: PropTypes.func,
  }),
  href: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  fullWidth: PropTypes.bool,
};

DataLink.defaultProps = {
  layer: null,
  href: null,
  fullWidth: true,
  children: null,
};

export default DataLink;
