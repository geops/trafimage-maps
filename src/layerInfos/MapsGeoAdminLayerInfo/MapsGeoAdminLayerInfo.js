import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import './MapsGeoAdminLayerInfo.scss';

const propTypes = {
  language: PropTypes.string.isRequired,
  properties: PropTypes.object.isRequired,
};

const MapsGeoAdminLayerInfo = ({ language, properties }) => {
  const [legendHtml, setLegendHtml] = useState(null);

  useEffect(() => {
    const fetchLegend = () => {
      const legendKey = properties.get('legendKey');
      fetch(
        `https://api3.geo.admin.ch/rest/services/all/MapServer/${legendKey}/legend?lang=${language}`,
      )
        .then((res) => res.text())
        .then((text) => setLegendHtml(text));
    };
    fetchLegend();
  }, [language, properties]);

  return (
    <div
      className="wkp-maps-geo-admin-layer-info"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: legendHtml }}
    />
  );
};

MapsGeoAdminLayerInfo.propTypes = propTypes;

export default withTranslation()(MapsGeoAdminLayerInfo);
