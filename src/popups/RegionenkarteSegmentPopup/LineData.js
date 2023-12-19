import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  otherLines: {
    flex: "1 1",
    overflow: "auto",
    border: "1px solid #dddddd",
    borderRadius: 2,
    margin: 0,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    minHeight: 100,
  },
}));

function LineData({ lineData }) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <fieldset className={classes.otherLines}>
      <legend>{t("Linien")}</legend>
      {lineData && lineData.length ? (
        <div>
          {lineData
            .sort(
              (
                { line_number: lineNumberA, km_start: kmStartA },
                { line_number: lineNumberB, km_start: kmStartB },
              ) => {
                if (lineNumberA === lineNumberB) {
                  return kmStartA < kmStartB ? -1 : 1;
                }
                return parseFloat(lineNumberA) < parseFloat(lineNumberB)
                  ? -1
                  : 1;
              },
            )
            .map((data) => {
              const {
                line_number: lineNumber,
                km_start: kmStart,
                km_end: kmEnd,
              } = data;
              return (
                <div
                  key={`${lineNumber}-${kmStart}
                }-${kmEnd}`}
                >{`${
                  lineNumber ? `${lineNumber}, ` : ""
                }km ${kmStart} - ${kmEnd}`}</div>
              );
            })}
        </div>
      ) : (
        <div>{t("Information nicht verfügbar")}</div>
      )}
    </fieldset>
  );
}

LineData.propTypes = {
  lineData: PropTypes.arrayOf(
    PropTypes.shape({
      line_number: PropTypes.string,
      km_start: PropTypes.number,
      km_end: PropTypes.number,
    }),
  ),
};

LineData.defaultProps = {
  lineData: [],
};
export default LineData;
