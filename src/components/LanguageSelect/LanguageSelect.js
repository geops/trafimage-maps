import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";
import Select from "../Select";
import { setLanguage } from "../../model/app/actions";
import { ReactComponent as SBBGlobe } from "../../img/sbb/globe_210_large.svg";
import useHasScreenSize from "../../utils/useHasScreenSize";
import { trackEvent, trackTopic } from "../../utils/trackingUtils";

const optionsDesktop = [
  { label: "Deutsch", value: "de" },
  { label: "Français", value: "fr" },
  { label: "Italiano", value: "it" },
  { label: "English", value: "en" },
];

const optionsMobile = [
  { label: "DE", value: "de" },
  { label: "FR", value: "fr" },
  { label: "IT", value: "it" },
  { label: "EN", value: "en" },
];

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 2,
    width: (props) => (props.isMobileWidth ? 64 : 120),
  },
  icon: {
    color: "inherit",
    width: (props) => (props.isMobileWidth ? 25 : 28),
    minWidth: (props) => (props.isMobileWidth ? 25 : 28),
    height: (props) => (props.isMobileWidth ? 25 : 28),
    marginLeft: -2, // align with menu item
  },
  currentValue: {
    display: "flex",
    alignItems: "center",
  },
  select: {
    color: theme.palette.text.secondary,
    "& svg:not(.MuiSelect-iconOpen) + .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover": {
      color: theme.palette.secondary.dark,
    },
  },
}));

function LanguageSelect() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const language = useSelector((state) => state.app.language);
  const isMobileWidth = useHasScreenSize();
  const classes = useStyles({ isMobileWidth });
  const options = isMobileWidth ? optionsMobile : optionsDesktop;
  const inputValue = useMemo(
    () => options.find((opt) => opt.value === language),
    [language, options],
  );

  const onSelectChange = useCallback(
    (opt) => {
      trackTopic(activeTopic, opt.target.value);
      trackEvent(
        {
          eventType: "action",
          componentName: "select menu item",
          label: opt.target.value,
          location: t(activeTopic?.name, { lng: "de" }),
          variant: "Sprache wählen",
        },
        activeTopic,
      );
      dispatch(setLanguage(opt.target.value));
    },
    [t, activeTopic, dispatch],
  );

  const langOptions = useMemo(() => {
    return options.map((opt) => {
      return (
        <MenuItem
          key={opt.value}
          value={opt.value}
          data-cy={`lang-select-option-${opt.value}`}
          data-testid={`lang-select-option-${opt.value}`}
        >
          {opt.label}
        </MenuItem>
      );
    });
  }, [options]);

  return (
    <div className={classes.wrapper}>
      <Select
        fullWidth
        data-cy="lang-select"
        data-testid="lang-select"
        value={inputValue.value}
        renderValue={(opt) => (
          <span className={classes.currentValue}>
            <SBBGlobe
              focusable={false}
              className={`${classes.icon} wkp-single-value-globe`}
            />
            {!isMobileWidth && (
              <span style={{ paddingTop: 1 }}>
                {options.find((lang) => lang.value === opt).label}
              </span>
            )}
          </span>
        )}
        onChange={onSelectChange}
        className={classes.select}
        MenuProps={{ "data-cy": "lang-select-options" }}
      >
        {langOptions}
      </Select>
    </div>
  );
}

export default React.memo(LanguageSelect);
