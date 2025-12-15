import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";
import PersonCard from "../../components/PersonCard";
import formatPhone from "../../utils/formatPhone";

const useStyles = makeStyles({
  personCard: {
    "& a": {
      textDecoration: "none !important",
    },
  },
});

function Person({ isIntern, person = {} }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { name, phone, email, division, unterrolle, kommentar } = person;

  return name ? (
    <PersonCard
      title={unterrolle && `${unterrolle}${kommentar ? ` ${kommentar}` : ""}`}
      name={name}
      division={division}
      phone={formatPhone(phone)}
      email={isIntern ? email : undefined}
      className={classes.personCard}
    />
  ) : (
    <i>{t("Information nicht verfügbar")}</i>
  );
}

Person.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    division: PropTypes.string,
    unterrolle: PropTypes.string,
    kommentar: PropTypes.string,
  }),
  isIntern: PropTypes.bool.isRequired,
};

export default Person;
