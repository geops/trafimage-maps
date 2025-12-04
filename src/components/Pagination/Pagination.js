import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import WestOutlinedIcon from "@mui/icons-material/WestOutlined";

function CycleButton({
  onClick,
  children,
  "data-testid": dataTestId,
  ...props
}) {
  const { t } = useTranslation();
  return (
    <IconButton
      sx={(theme) => ({
        padding: 0,
        height: 25,
        width: 25,
        "&:hover": { color: theme.palette.secondary.main },
      })}
      className="wkp-pagination-button"
      title={t("zurück")}
      aria-label={t("zurück")}
      onClick={onClick}
      tabIndex={0}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </IconButton>
  );
}

CycleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  "data-testid": PropTypes.string,
};

const buttonWrapperSx = {
  padding: "0 10px",
  height: 25,
  width: 25,
};

function Pagination({ onNext, onPrevious, index, count }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 35,
      }}
      className="wkp-pagination-wrapper"
    >
      <Box
        component="span"
        sx={buttonWrapperSx}
        className="wkp-pagination-button-wrapper"
      >
        {index > 0 && (
          <CycleButton
            onClick={onPrevious}
            data-testid="pagination-previous-button"
          >
            <WestOutlinedIcon sx={{ height: 16, width: 16 }} />
          </CycleButton>
        )}
      </Box>
      {index + 1} {t("von")} {count}
      <Box
        component="span"
        sx={buttonWrapperSx}
        className="wkp-pagination-button-wrapper"
      >
        {index < count - 1 && (
          <CycleButton onClick={onNext} data-testid="pagination-next-button">
            <EastOutlinedIcon sx={{ height: 16, width: 16 }} />
          </CycleButton>
        )}
      </Box>
    </Box>
  );
}

Pagination.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

export default Pagination;
