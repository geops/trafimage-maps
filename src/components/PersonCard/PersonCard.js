import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as PhoneIcon } from "../../img/phone.svg";
import { ReactComponent as MailIcon } from "../../img/mail.svg";
import { ReactComponent as PersonIcon } from "../../img/person.svg";
import formatPhone from "../../utils/formatPhone";

const useStyles = makeStyles((theme) => {
  return {
    row: {
      minWidth: 250,
      alignItems: "center",
      display: "grid",
      gridTemplateColumns: "1fr 11fr",
      gap: 4,
    },
    icon: {
      height: 24,
      width: 24,
      "& svg": {
        height: "100%",
        width: "100%",
      },
    },
    card: {
      flex: 1,
      border: "1px solid #ddd",
      padding: theme.spacing(1),
      margin: `${theme.spacing(1)} 0`,
      borderRadius: 2,
    },
  };
});

const validatePhone = (string) =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(string);

function PersonCard({
  title,
  name,
  email,
  phone,
  division,
  otherDetails = [],
  className = "",
}) {
  const classes = useStyles();
  const formattedPhone = useMemo(() => formatPhone(phone), [phone]);
  return (
    <div
      key={`${title}-${name}`}
      className={`wkp-person-card ${classes.card}${` ${className}`}`}
    >
      {title && <Typography paragraph>{title}</Typography>}
      {name && (
        <div className={classes.row}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            <PersonIcon />
          </div>
          <Typography>{`${name} ${
            division ? ` (${division})` : ""
          }`}</Typography>
        </div>
      )}
      {phone && (
        <div className={classes.row}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            <PhoneIcon />
          </div>
          <Typography>
            {validatePhone(formattedPhone.replace(/\s/g, "")) ? (
              <a href={`tel:${formattedPhone}`}>{formattedPhone}</a>
            ) : (
              <span>{formattedPhone}</span>
            )}
          </Typography>
        </div>
      )}
      {email && (
        <div className={classes.row}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            <MailIcon />
          </div>
          <Typography>
            <a href={`mailto:${email}`}>{(email || "-").toLowerCase()}</a>
          </Typography>
        </div>
      )}
      {(otherDetails || []).map((detail) => (
        <div className={classes.row} key={detail.id}>
          <div className={`wkp-person-card-icon ${classes.icon}`}>
            {detail.icon}
          </div>
          <Typography>{detail.label}</Typography>
        </div>
      ))}
    </div>
  );
}

PersonCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.node,
  email: PropTypes.string,
  phone: PropTypes.string,
  division: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  otherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.element.isRequired,
      label: PropTypes.node.isRequired,
    }),
  ),
  className: PropTypes.string,
};

export default PersonCard;
