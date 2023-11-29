import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PermalinkInput from '../PermalinkInput';
import DrawEditLinkInput from '../DrawEditLinkInput';
import PermalinkButton from '../PermalinkButton';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(2),
  },
}));

function DrawPermalinkButton({ buttonProps }) {
  const classes = useStyles();
  const drawIds = useSelector((state) => state.app.drawIds);
  const { t } = useTranslation();

  return (
    <PermalinkButton buttonProps={buttonProps}>
      {/* We use a function to be able to get the proper window.location value. */}
      {(locationHref) => {
        return (
          <>
            {drawIds && drawIds.file_id && (
              <>
                <Typography variant="h4" gutterBottom>{`${t(
                  'Link zum Teilen',
                )}: `}</Typography>
                <PermalinkInput
                  value={
                    drawIds.admin_id
                      ? locationHref.replace(drawIds.admin_id, drawIds.file_id)
                      : locationHref
                  }
                />
              </>
            )}
            {drawIds && drawIds.admin_id && (
              <div className={classes.margin}>
                <Typography variant="h4" gutterBottom>{`${t(
                  'Link zum Editieren',
                )}: `}</Typography>
                <Typography gutterBottom>
                  {t(
                    'Damit sie ihre Zeichnung erneut bearbeiten können, müssen sie diesen Link speichern.',
                  )}
                </Typography>
                <DrawEditLinkInput />
              </div>
            )}
          </>
        );
      }}
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
