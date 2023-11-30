import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import Dialog from "../Dialog";
import layerInfos from "../../layerInfos";
import DataLink from "../DataLink/DataLink";

const propTypes = {
  style: PropTypes.object,
  isDraggable: PropTypes.bool,
  selectedForInfos: PropTypes.object,
};

const defaultProps = {
  style: undefined,
  isDraggable: true,
  selectedForInfos: null,
};

export const NAME = "infoDialog";

function LayerInfosDialog(props) {
  const language = useSelector((state) => state.app.language);
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);
  const { t } = useTranslation();
  const { style, isDraggable, selectedForInfos } = props;
  if (!selectedForInfos) {
    return null;
  }

  let component = null;
  let description = null;
  let dataLink = null;
  let dataService = null;

  // test if get function exist instead of `instanceof` since the layer may be created
  // outside this bundle.
  if (selectedForInfos.get) {
    component = selectedForInfos.get("layerInfoComponent");
    description = selectedForInfos.get("description");
    dataLink = selectedForInfos.get("dataLink");
    dataService = selectedForInfos.get("dataService");
  } else {
    component = selectedForInfos.layerInfoComponent;
    description = selectedForInfos.description;
  }

  let body;

  const LayerInfoComponent =
    typeof component === "string" ? layerInfos[component] : component;

  if (component) {
    body = (
      <LayerInfoComponent
        language={language}
        properties={selectedForInfos}
        staticFilesUrl={staticFilesUrl}
        t={t}
      />
    );
  } else if (description) {
    const translated = t(description);
    body = (
      <div>
        {/* We use trans component when description contains html tags */}
        {/<.*>/.test(translated) ? (
          <Trans i18nKey={description} />
        ) : (
          <p>{translated}</p>
        )}
        {dataLink && (
          <>
            <hr />
            <p>
              <DataLink layer={selectedForInfos} />
            </p>
          </>
        )}
        {dataService && (
          <p>
            <DataLink href="https://geo.sbb.ch/site/rest/services/Trafimage_PUBLIC/">
              {t("Diesen Datensatz als Service einbinden (SBB-intern)")}
            </DataLink>
          </p>
        )}
      </div>
    );
  }

  return (
    <Dialog
      isDraggable={isDraggable}
      cancelDraggable=".tm-dialog-body"
      name={NAME}
      title={
        LayerInfoComponent?.renderTitle ? (
          LayerInfoComponent.renderTitle(selectedForInfos, t)
        ) : (
          <span>{t(`${selectedForInfos.name || selectedForInfos.key}`)}</span>
        )
      }
      body={body}
      style={style}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

LayerInfosDialog.propTypes = propTypes;
LayerInfosDialog.defaultProps = defaultProps;

export default LayerInfosDialog;
