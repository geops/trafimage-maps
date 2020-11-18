import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import PermalinkInput from '../PermalinkInput';
import PermalinkButton from '../PermalinkButton';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(2),
  },
}));

function SharePermalinkButton({ buttonProps }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <PermalinkButton buttonProps={buttonProps}>
      <PermalinkInput value={window.location.href} />
      <Typography className={classes.margin}>
        {t(
          'Sie können auch den Link aus der Adresszeile des Browsers kopieren.',
        )}
      </Typography>
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
