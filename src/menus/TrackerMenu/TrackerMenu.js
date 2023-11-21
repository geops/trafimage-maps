import React from 'react';
import { useTranslation } from 'react-i18next';
import { TiVideo } from 'react-icons/ti';
import FeatureMenu from '../../components/FeatureMenu';

/**
 * Menu use to display feature info from punctuality layers.
 */
function TrackerMenu(props) {
  const { t } = useTranslation();

  return (
    <FeatureMenu
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      property="useTrackerMenu"
      menuItemProps={{
        className: 'wkp-tracker-menu',
        title: t('ch.sbb.puenktlichkeit'),
        icon: <TiVideo />,
      }}
    />
  );
}

export default React.memo(TrackerMenu);
