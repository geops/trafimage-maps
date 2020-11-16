import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { FaLink } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '@geops/react-ui/components/Button';
import IconButton from '@material-ui/core/IconButton';
import PermalinkInput from '../PermalinkInput';

const propTypes = { buttonProps: PropTypes.object };

const defaultProps = {
  buttonProps: null,
};

function SharePermalinkButton({ buttonProps }) {
  const [showTooltip, setShowTooltip] = useState(null);
  const [positionTooltip, setPositionTooltip] = useState();
  const { t } = useTranslation();
  const ref = useRef();

  // Close the tooltip when clicking outside the tooltip
  useEffect(() => {
    const onDocClick = (e) => {
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
    <div className="wkp-share-permalink-button" ref={ref}>
      <IconButton
        title={t('Permalink generieren')}
        onClick={(e) => {
          setPositionTooltip(e.currentTarget.getBoundingClientRect());
          setShowTooltip(!showTooltip);
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonProps}
      >
        <FaLink focusable={false} />
      </IconButton>
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
          <div className="wkp-permalink-field">
            <PermalinkInput value={window.location.href} />
          </div>
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
