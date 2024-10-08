import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { MenuItem as MuiMenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { unByKey } from "ol/Observable";
import MenuItem from "../../components/Menu/MenuItem";
import Select from "../../components/Select";
import InfosButton from "../../components/InfosButton";
import {
  setDialogPosition,
  setSelectedForInfos,
  setFeatureInfo,
} from "../../model/app/actions";

const useStyles = makeStyles(() => {
  const boxShadow = "7px 7px 10px -6px rgb(0 0 0 / 40%)";
  return {
    root: {
      // Hide the MenuItem css, display only the select box.
      border: "none !important",
      boxShadow,
      "& .MuiInputBase-root": {
        minHeight: 50,
      },
      "& .MuiPaper-root[style]": {
        boxShadow,
        // The trafimage menu item is automatically resized so we need this to be able to scroll on small height screen
        overflow: "auto",
      },
      "& .MuiSelect-select": {
        paddingRight: 62,
      },

      // Allow multiline display
      "& .MuiSelect-select, & .MuiMenuItem-root ": {
        textOverflow: "unset",
        whiteSpace: "unset",
        fontSize: "15px", // css that fits https://www.sbb.ch/de/abos-billette/abonnemente/ga/ga-geltungsbereich.html
        lineHeight: 1.5,
      },

      "& li": {
        paddingTop: "14px",
        paddingBottom: "14px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      },
      "& li:last-child": {
        borderBottom: "none",
      },
    },
    responsiveLeft: {
      // We hardcode left because the menu is too close from the window's border, mui calculate a bad left value.
      left: "10px !important",
    },
    currentValue: {
      display: "flex",
      paddingRight: 24,
    },
    infoButton: {
      position: "absolute",
      right: 33,
      margin: "auto",
      bottom: 0,
      padding: 0,
      width: 18,
      top: 0,
      height: 18,
      paddingTop: 5, // needed because the MenuItem has an 5px margin top
      // marginLeft: 10,
    },
  };
});

function GeltungsbereicheTopicMenu() {
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.map.layers);
  const drawLayer = useSelector((state) => state.map.drawLayer);
  const ref = useRef();
  const [node, setNode] = useState();
  const tmMapsEl = document.getElementsByClassName("tm-trafimage-maps")[0];
  const isEmbedded = tmMapsEl && window.innerWidth !== tmMapsEl?.offsetWidth;
  const classes = useStyles();
  const [value, setValue] = useState(null);

  useEffect(() => {
    dispatch(setDialogPosition({ x: 425, y: 17 }));
  }, [dispatch]);

  const nonBaseLayers = useMemo(() => {
    return (
      layers
        ?.filter((layer) => layer !== drawLayer && !layer.get("isBaseLayer"))
        .reverse() || []
    );
  }, [drawLayer, layers]);

  useEffect(() => {
    const val = (nonBaseLayers?.find((layer) => layer.visible) || {}).name;
    if (val && val !== value) {
      setValue(val);
    }

    // In case visiblity is changed by another component
    const olKeys = nonBaseLayers.map((layer) => {
      return layer.on("change:visible", () => {
        if (layer.visible) {
          setValue(layer.name);
        }
      });
    });
    return () => {
      unByKey(olKeys);
    };
  }, [value, nonBaseLayers]);

  const onChange = useCallback(
    (opt) => {
      dispatch(setFeatureInfo());
      dispatch(setSelectedForInfos());
      setValue(opt.target.value);
      nonBaseLayers.forEach((layer) => {
        // eslint-disable-next-line no-param-reassign
        layer.visible = layer.name === opt.target.value;
      });
    },
    [dispatch, nonBaseLayers],
  );

  return (
    <MenuItem
      open
      className={`wkp-gb-topic-menu ${classes.root}`}
      collapsed={false}
      ref={ref}
    >
      {value && (
        <Select
          fullWidth
          data-cy="gb-select"
          value={value}
          renderValue={() => (
            <span
              className={`wkp-gb-menu-current-value ${classes.currentValue}`}
            >
              <span style={{ flex: 2 }} ref={(textNode) => setNode(textNode)}>
                <Trans i18nKey={value} />
              </span>
            </span>
          )}
          onChange={onChange}
          MenuProps={{
            PopoverClasses: {
              // When embedded as web component (not iFrame) left: 10px will move the menu outside trafimage, so we omit it
              paper: !isEmbedded ? classes.responsiveLeft : undefined,
            },
            disablePortal: true,
            TransitionProps: {
              onEnter: (el) => {
                // Show all the text of the current value
                node.style.display = "inline-block";

                /**
                 * Apply css of the current element
                 * @ignore
                 */
                const menuEl = el;
                const parentStyle = window.getComputedStyle(
                  ref.current.parentElement,
                );

                menuEl.style.maxWidth = parentStyle.maxWidth;
                menuEl.style.right = parentStyle.right;
              },
              onExit: () => {
                // Apply text overflow
                node.style.display = "-webkit-box";
              },
            },
          }}
        >
          {nonBaseLayers.map((layer) => {
            if (layer.name === value) {
              return null;
            }

            return (
              <MuiMenuItem key={layer.key} value={layer.name}>
                <span>
                  <Trans i18nKey={layer.name} />
                </span>
              </MuiMenuItem>
            );
          })}
        </Select>
      )}
      {value && (
        <InfosButton
          className={`wkp-info-bt ${classes.infoButton}`}
          selectedInfo={layers.find((l) => l.name === value)}
        />
      )}
    </MenuItem>
  );
}

export default React.memo(GeltungsbereicheTopicMenu);
