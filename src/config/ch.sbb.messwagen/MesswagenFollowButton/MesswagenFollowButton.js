import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MapButton from "../../../components/MapButton";
import { ReactComponent as Gps } from "../../../img/sbb/gps-medium.svg";

function MesswagenFollowButton() {
  const topic = useSelector((state) => state.app.activeTopic);
  const [follow, setFollow] = useState(true);

  useEffect(() => {
    topic.layers.forEach((layer) => {
      layer.set("follow", follow);
    });
  }, [follow, topic]);

  return (
    <MapButton
      style={{ padding: 5, color: "#444" }}
      onClick={() => {
        setFollow(!follow);
      }}
    >
      <Gps
        className={follow ? "pulse" : null}
        style={
          follow
            ? {
                color: "#c60018",
              }
            : null
        }
      />
    </MapButton>
  );
}

export default React.memo(MesswagenFollowButton);
