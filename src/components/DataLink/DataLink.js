import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Link from '../Link';

function DataLink({ children, layer, href }) {
  const { t } = useTranslation();

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
      <Link href={dataLink}>
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
};

DataLink.defaultProps = {
  layer: null,
  href: null,
  children: null,
};

export default DataLink;
