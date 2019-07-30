import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TiVideo } from 'react-icons/ti';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import LayerService from 'react-spatial/LayerService';
import TrackerLayer from 'react-public-transport/components/Tracker/TrackerLayer';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

const TrackerMenu = ({ layerService }) => {
  const trackerLayer = layerService
    .getLayersAsFlatArray()
    .find(l => l instanceof TrackerLayer);

  const vis = trackerLayer && trackerLayer.getVisible();
  const [closed, setClosed] = useState(false);
  const [visible, setVisible] = useState(vis);
  const [trajectory, setTrajectory] = useState(null);

  if (trackerLayer) {
    trackerLayer.olLayer.on('change:visible', () =>
      setVisible(trackerLayer.getVisible()),
    );

    trackerLayer.onClick(traj => setTrajectory(traj));
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="wkp-menu">
      <div
        className="wkp-menu-title"
        role="button"
        tabIndex={0}
        onClick={() => setClosed(!closed)}
        onKeyPress={e => e.which === 13 && setClosed(!closed)}
      >
        <div className="wkp-menu-title-left">
          <TiVideo className="wkp-menu-title-icon" />
          Zugtracker
        </div>

        <div className="wkp-menu-title-toggler">
          {closed ? <FaAngleDown /> : <FaAngleUp />}
        </div>
      </div>
      <div className={`wkp-menu-body ${closed ? 'closed' : ''}`}>
        Content
      </div>
    </div>
  );
};

TrackerMenu.propTypes = propTypes;

export default TrackerMenu;
