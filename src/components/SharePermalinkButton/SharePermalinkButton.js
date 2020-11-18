import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import PermalinkInput from '../PermalinkInput';
import PermalinkButton from '../PernmalinkButton';

function SharePermalinkButton({ buttonProps }) {
  const { t } = useTranslation();

  return (
    <PermalinkButton buttonProps={buttonProps}>
      <div className="wkp-permalink-field">
        <PermalinkInput value={window.location.href} />
      </div>
      <p>
        <Typography>
          {t(
            'Sie können auch den Link aus der Adresszeile des Browsers kopieren.',
          )}
        </Typography>
      </p>
    </PermalinkButton>
  );
}

SharePermalinkButton.propTypes = {
  buttonProps: PropTypes.object,
};

SharePermalinkButton.defaultProps = {
  buttonProps: {},
};

export default React.memo(SharePermalinkButton);
