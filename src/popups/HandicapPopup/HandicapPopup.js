import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { useTranslation } from 'react-i18next';
import PopupElement from './HandicapPopupElement';
import './HandicapPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function HandicapPopup({ feature }) {
  const language = useSelector(state => state.app.language);
  const properties = feature.getProperties();
  const { t } = useTranslation();

  // mapping of all boolean values properties and their exceptions
  const bfEquipmentExceptions = {
    lift_zu_perron: `ausnahme_zu_lift_${language}`,
    perronhoehe_P55: `ausnahme_zu_P55_${language}`,
    taktile_sicherheitslinien: null,
    induktionsverstaerker: null,
    rampe: `ausnahme_zu_rampe_${language}`,
    faltrampe: null,
    sbb_rollstuhl: null,
    rollstuhl_billet: null,
    rollstuhl_wc: null,
    eurok_wc: null,
  };

  // build string for equipment
  const equipment = [];
  Object.keys(bfEquipmentExceptions).forEach(key => {
    if (properties[key]) {
      let str = t(key);

      if (bfEquipmentExceptions[key]) {
        // handle exception texts
        const exception = properties[bfEquipmentExceptions[key]];
        str += exception ? ` (${exception})` : '';
      }

      equipment.push(str);
    }
  });

  const equipmentStr = equipment.length ? (
    <div className="wkp-handicap-popup-element">
      <u>Ausstattung</u>
      <br />
      {equipment.join(', ')}
    </div>
  ) : null;

  return (
    <div className="wkp-handicap-popup">
      <div style={{ fontWeight: 'bold', marginBottom: 10 }}>
        {feature.get('stationsbezeichnung')}
      </div>
      <PopupElement
        properties={properties}
        propertyName={`treffpunkt_${language}`}
        label="Treffpunkt"
      />
      <PopupElement
        properties={properties}
        propertyName={`voranmeldefrist_${language}`}
        label="Voranmeldefrist"
      />
      <PopupElement
        properties={properties}
        propertyName={`bedienungszeiten_${language}`}
        label="Bedienungszeiten"
      />
      {equipmentStr}
      <PopupElement
        label="Dienstleistungen Dritter"
        properties={properties}
        propertyName={`beschreibung_zur_dritte_dienstleistung_${language}`}
      />
      <PopupElement
        label="Zusätzliche Informationen"
        properties={properties}
        propertyName={`zusaetzliche_informationen_${language}`}
      />
    </div>
  );
}

HandicapPopup.propTypes = propTypes;

export default React.memo(HandicapPopup);
