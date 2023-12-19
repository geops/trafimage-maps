import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import InfosButton from "../InfosButton";

function TopicInfosButton({ topic }) {
  const activeTopic = useSelector((state) => state.app.activeTopic);

  const className = useMemo(() => {
    const classes = ["wkp-info-bt"];

    if (activeTopic?.key === topic.key) {
      classes.push("wkp-active");
    }
    return classes.join(" ");
  }, [activeTopic.key, topic]);

  if (!topic) {
    return null;
  }

  return <InfosButton className={className} selectedInfo={topic} />;
}

TopicInfosButton.propTypes = {
  topic: PropTypes.object.isRequired,
};

export default React.memo(TopicInfosButton);
