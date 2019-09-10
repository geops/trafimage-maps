import React, { useState } from 'react';
import { compose } from 'lodash/fp';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import MenuHeader from './MenuHeader';

const propTypes = {
  t: PropTypes.func,
  map: PropTypes.instanceOf(Map).isRequired,
};

const defaultProps = {
  t: p => p,
};

const socialShareConfig = [
  {
    url: '//www.facebook.com/sharer.php?u={url}',
    title: 'Auf Facebook teilen.',
    icon: <TiSocialFacebook focusable={false} />,
  },
  {
    url: '//twitter.com/intent/tweet?url={url}',
    title: 'Twittern.',
    icon: <TiSocialTwitter focusable={false} />,
  },
  {
    url: 'mailto:?body={url}',
    title: 'Per Email teilen.',
    icon: <FiMail focusable={false} />,
    className: 'ta-mail-icon',
  },
];

const ShareMenu = ({ t, map }) => {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const config = [...socialShareConfig];

  return (
    <>
      <MenuHeader
        title={t('Teilen')}
        className="wkp-share-header"
        headerLayerNames={t('Teilen')}
        isOpen={shareMenuOpen}
        onToggle={() => setShareMenuOpen(!shareMenuOpen)}
      />
      <div className={`wkp-share-wrapper ${shareMenuOpen ? '' : 'closed'}`}>
        {config.map(conf => (
          <div
            className={`tm-share-menu-icon ${conf.className || ''}`}
            key={conf.title}
          >
            {conf.icon}
          </div>
        ))}
        <CanvasSaveButton title={t('Karte als Bild speichern')} map={map}>
          <TiImage focusable={false} />
        </CanvasSaveButton>
      </div>
    </>
  );
};

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default compose(withTranslation())(ShareMenu);
