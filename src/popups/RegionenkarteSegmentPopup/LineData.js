import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";

const useStyles = makeStyles((theme) => ({
  otherLines: {
    flex: "1 1",
    overflow: "auto",
    border: "1px solid #dddddd",
    borderRadius: 2,
    padding: theme.spacing(1),
    minHeight: 100,
  },
}));

function LineData({ lineData = [], ...props }) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <fieldset className={classes.otherLines} {...props}>
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

export default LineData;
