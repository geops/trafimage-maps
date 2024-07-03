import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Feature } from "ol";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import RailplusLayer from "../../layers/RailplusLayer";
import PhotoCarusel from "../../components/PhotoCarusel";

function useZoomOnFeature(bbox, layer) {
  useEffect(() => {
    if (bbox && layer) {
      layer.zoomOnBbox(bbox);
    }
  }, [bbox, layer]);
}

function RailplusPopup({ feature, layer }) {
  const { t } = useTranslation();
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
    bbox,
  } = layer.railplusProviders[feature.get("isb_tu_nummer")] || {};

  useZoomOnFeature(bbox, layer);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {logo && (
        <div
          style={{
            marginTop: 15,
            display: "flex",
          }}
          data-testid="railplus-logo"
        >
          <img src={logo} alt={`${name}_logo`} />
        </div>
      )}
      {longName && (
        <Typography
          component="b"
          variant="body2"
          data-testid="railplus-longname"
        >
          {longName}
        </Typography>
      )}
      {address && (
        <div data-testid="railplus-address">
          <Typography sx={{ paddingBottom: 0.5 }}>
            <b>{t(`${layer.key}.headquarters`)}:</b>
          </Typography>
          <Typography>{address}</Typography>
        </div>
      )}
      {cantons?.length ? (
        <div data-testid="railplus-cantons">
          <Typography>
            <b>{t(`${layer.key}.cantons`)}</b>:
          </Typography>
          <List data-testid="railplus-cantons-list" dense>
            {cantons
              .map((canton) => ({
                abr: canton,
                trans: t(`kantone.${canton.toLowerCase()}`),
              }))
              .sort((a, b) => a.trans.localeCompare(b.trans)) // We sort the translated cantons
              .map(({ abr, trans }) => (
                <ListItem
                  key={abr}
                  dense
                  data-testid={`railplus-cantons-listitem-${abr.toLowerCase()}`}
                >
                  <ListItemIcon>
                    <FaCircle size={7} />
                  </ListItemIcon>
                  <ListItemText sx={{ margin: 0 }}>{trans}</ListItemText>
                </ListItem>
              ))}
          </List>
        </div>
      ) : null}
      {numberOfEmployees && (
        <Typography data-testid="railplus-employees">
          <b>{t(`${layer.key}.number_of_employees`)}</b>: {numberOfEmployees}
        </Typography>
      )}
      {yearlyNumberOfPassengers && (
        <Typography data-testid="railplus-passengers">
          <b>{t(`${layer.key}.yearly_number_of_passengers`)}</b>:{" "}
          {yearlyNumberOfPassengers}
        </Typography>
      )}
      {routeLength && (
        <Typography data-testid="railplus-route">
          <b>{t(`${layer.key}.length`)}</b>: {routeLength}
        </Typography>
      )}
      {highestPoint && (
        <Typography data-testid="railplus-highest">
          <b>{t(`${layer.key}.highest_point`)}</b>: {highestPoint}
        </Typography>
      )}
      {lowestPoint && (
        <Typography data-testid="railplus-lowest">
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
