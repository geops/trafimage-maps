import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import PermalinkInput from '../PermalinkInput';
import DrawEditLinkInput from '../DrawEditLinkInput';
import PermalinkButton from '../PermalinkButton';

function DrawPermalinkButton({ buttonProps }) {
  const drawIds = useSelector((state) => state.app.drawIds);
  const { t } = useTranslation();

  return (
    <PermalinkButton buttonProps={buttonProps}>
      {drawIds && drawIds.file_id && (
        <>
          <p>
            <Typography variant="h4">{`${t('Link zum Teilen')}: `}</Typography>
          </p>
          <p>
            <PermalinkInput
              value={
                drawIds.admin_id
                  ? window.location.href.replace(
                      drawIds.admin_id,
                      drawIds.file_id,
                    )
                  : window.location.href
              }
            />
          </p>
        </>
      )}
      {drawIds && drawIds.admin_id && (
        <>
          <p>
            <Typography variant="h4">{`${t(
              'Link zum Editieren',
            )}: `}</Typography>
          </p>
          <p>
            <Typography>
              {t(
                'Damit Sie Ihre Zeichnung erneut bearbeiten können Sie diese Link speichern.',
              )}
            </Typography>
          </p>
          <DrawEditLinkInput />
        </>
      )}
    </PermalinkButton>
  );
}

DrawPermalinkButton.propTypes = {
  buttonProps: PropTypes.object,
};

DrawPermalinkButton.defaultProps = {
  buttonProps: {},
};

export default React.memo(DrawPermalinkButton);
