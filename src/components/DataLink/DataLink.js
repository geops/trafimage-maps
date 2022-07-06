import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Link from '../Link';

function DataLink({ layer, href }) {
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
        {`${t('Diesen Datensatz einbinden')} (${
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
};

DataLink.defaultProps = {
  layer: null,
  href: null,
};

export default DataLink;
