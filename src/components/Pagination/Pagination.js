import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import WestOutlinedIcon from "@mui/icons-material/WestOutlined";
import useTranslation from "../../utils/useTranslation";

function CycleButton({ onClick, children, ...props }) {
  const { t } = useTranslation();
  return (
    <IconButton
      sx={{
        padding: 0,
        height: 25,
        width: 25,
      }}
      className="wkp-pagination-button"
      title={t("zurück")}
      aria-label={t("zurück")}
      onClick={onClick}
      {...props}
    >
      {children}
    </IconButton>
  );
}

CycleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function CycleButtonWrapper({ children }) {
  return (
    <span
      style={{
        padding: "0 10px",
        height: 25,
        width: 25,
      }}
      className="wkp-pagination-button-wrapper"
    >
      {children}
    </span>
  );
}

CycleButtonWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

function Pagination({ onNext, onPrevious, index, count }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 35,
      }}
      className="wkp-pagination-wrapper"
    >
      <CycleButtonWrapper>
        {index > 0 && (
          <CycleButton
            onClick={onPrevious}
            data-testid="pagination-previous-button"
          >
            <WestOutlinedIcon sx={{ height: 16, width: 16 }} />
          </CycleButton>
        )}
      </CycleButtonWrapper>
      {index + 1} {t("von")} {count}
      <CycleButtonWrapper>
        {index < count - 1 && (
          <CycleButton onClick={onNext} data-testid="pagination-next-button">
            <EastOutlinedIcon sx={{ height: 16, width: 16 }} />
          </CycleButton>
        )}
      </CycleButtonWrapper>
    </div>
  );
}

Pagination.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

export default Pagination;
