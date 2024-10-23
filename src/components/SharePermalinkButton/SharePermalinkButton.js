import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import PermalinkInput from "../PermalinkInput";
import PermalinkButton from "../PermalinkButton";

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(2),
  },
}));

function SharePermalinkButton({ buttonProps }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <PermalinkButton buttonProps={buttonProps || {}}>
      {/* We use a function to be able to get the proper window.location value. */}
      {(locationHref) => {
        return (
          <>
            <PermalinkInput value={locationHref} />
            <Typography className={classes.margin}>
              {t(
                "Sie können auch den Link aus der Adresszeile des Browsers kopieren.",
              )}
            </Typography>
          </>
        );
      }}
    </PermalinkButton>
  );
}

SharePermalinkButton.propTypes = {
  buttonProps: PropTypes.object,
};

export default React.memo(SharePermalinkButton);
