import React from "react";
import PropTypes from "prop-types";
import { Feature } from "ol";
import { makeStyles } from "@mui/styles";
import { List, ListItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import RailplusLayer from "../../layers/RailplusLayer";
import PhotoCarusel from "../../components/PhotoCarusel";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  logo: {
    marginTop: 15,
    display: "flex",
  },
}));

function RailplusPopup({ feature, layer }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    long_name: longName,
    location_headquarter: address,
    logo,
    picture,
    name,
    cantons,
    highest_point: highestPoint,
    lowest_point: lowestPoint,
    number_of_employees: numberOfEmployees,
    yearly_number_of_passengers: yearlyNumberOfPassengers,
    route_length: routeLength,
  } = layer.railplusProviders[feature.get("isb_tu_nummer")] || {};

  return (
    <div className={classes.root}>
      {logo && (
        <div className={classes.logo}>
          <img src={logo} alt={`${name}_logo`} />
        </div>
      )}
      {longName && (
        <Typography component="b" variant="body2">
          {longName}
        </Typography>
      )}
      {address && <Typography paragraph>{address}</Typography>}
      {cantons?.length ? (
        <div>
          <Typography>
            <b>{t(`${layer.key}.cantons`)}</b>:
          </Typography>
          <List sx={{ listStyleType: "disc", listStylePosition: "inside" }}>
            {cantons.map((canton) => (
              <ListItem key={canton} sx={{ display: "list-item" }} dense>
                {t(`kantone.${canton.toLowerCase()}`)}
              </ListItem>
            ))}
          </List>
        </div>
      ) : null}
      {numberOfEmployees && (
        <Typography>
          <b>{t(`${layer.key}.number_of_employees`)}</b>: {numberOfEmployees}
        </Typography>
      )}
      {yearlyNumberOfPassengers && (
        <Typography>
          <b>{t(`${layer.key}.yearly_number_of_passengers`)}</b>:{" "}
          {yearlyNumberOfPassengers}
        </Typography>
      )}
      {routeLength && (
        <Typography>
          <b>{t(`${layer.key}.length`)}</b>: {routeLength}
        </Typography>
      )}
      {highestPoint && (
        <Typography>
          <b>{t(`${layer.key}.highest_point`)}</b>: {highestPoint}
        </Typography>
      )}
      {lowestPoint && (
        <Typography>
          <b>{t(`${layer.key}.lowest_point`)}</b>: {lowestPoint}
        </Typography>
      )}
      {picture && <PhotoCarusel photos={[picture]} />}
    </div>
  );
}

RailplusPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(RailplusLayer).isRequired,
};

export default React.memo(RailplusPopup);
