import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapButton from "../../../components/MapButton";
import { ReactComponent as Gps } from "../../../img/sbb/gps-medium.svg";
import { setFollowing } from "../../../model/app/actions";

function MesswagenFollowButton() {
  const topic = useSelector((state) => state.app.activeTopic);
  const isFollowing = useSelector((state) => state.app.isFollowing);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFollowing(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    topic.layers.forEach((layer) => {
      layer.set("follow", isFollowing);
    });
  }, [isFollowing, topic]);

  return (
    <MapButton
      style={{ padding: 5, color: "#444" }}
      onClick={() => {
        dispatch(setFollowing(!isFollowing));
      }}
    >
      <Gps
        className={isFollowing ? "pulse" : null}
        style={
          isFollowing
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
