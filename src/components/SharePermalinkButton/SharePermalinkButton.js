import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { FaLink } from 'react-icons/fa';
import PropTypes from 'prop-types';
import PermalinkInput from '@geops/react-ui/components/PermalinkInput';
import Button from '@geops/react-ui/components/Button';

const propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  title: 'Permalink generieren',
  icon: <FaLink focusable={false} />,
  className: 'wkp-share-permalink-button',
};

function SharePermalinkButton({ icon, title, className }) {
  const [showTooltip, setShowTooltip] = useState(null);
  const [positionTooltip, setPositionTooltip] = useState();
  const { t } = useTranslation();
  const ref = useRef();

  // Close the tooltip when clicking outside the tooltip
  useEffect(() => {
    const onDocClick = e => {
      // If the click comes from an element of Autocomplete, don't close the list.
      if (ref && ref.current && ref.current.contains(e.target)) {
        return;
      }
      setShowTooltip(false);
    };
    if (showTooltip) {
      document.addEventListener('click', onDocClick);
    }
    return function cleanup() {
      document.removeEventListener('click', onDocClick);
    };
  }, [showTooltip]);

  return (
    <div className={className} ref={ref}>
      <Button
        title={t(title)}
        onClick={e => {
          setPositionTooltip(e.currentTarget.getBoundingClientRect());
          setShowTooltip(!showTooltip);
        }}
      >
        {icon}
      </Button>
      {showTooltip && positionTooltip && (
        <div
          className="wkp-tooltip"
          style={{
            left: positionTooltip.left + 30,
            top: positionTooltip.top,
          }}
        >
          <div className="wkp-arrow-left" />
          <Button
            className="wkp-close-bt"
            onClick={() => {
              setShowTooltip(false);
            }}
          >
            <MdClose focusable={false} />
          </Button>
          <PermalinkInput value={window.location.href} />
          <p>
            {t(
              'Sie können auch den Link aus der Adresszeile des Browsers kopieren.',
            )}
          </p>
        </div>
      )}
    </div>
  );
}

SharePermalinkButton.propTypes = propTypes;
SharePermalinkButton.defaultProps = defaultProps;

export default React.memo(SharePermalinkButton);
