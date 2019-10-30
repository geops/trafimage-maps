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
    <div className="wkp-handicap-popup-element">{equipment.join(', ')}</div>
  ) : null;

  const elementsList = [
    {
      label: 'Treffpunkt',
      element: (
        <PopupElement
          properties={properties}
          propertyName={`treffpunkt_${language}`}
        />
      ),
    },
    {
      label: 'Voranmeldefrist',
      element: (
        <PopupElement
          properties={properties}
          propertyName={`voranmeldefrist_${language}`}
        />
      ),
    },
    {
      label: 'Bedienungszeiten',
      element: (
        <PopupElement
          properties={properties}
          propertyName={`bedienungszeiten_${language}`}
        />
      ),
    },
    {
      label: 'Ausstattung',
      element: equipmentStr,
    },
    {
      label: 'Dienstleistungen Dritter',
      element: (
        <PopupElement
          properties={properties}
          propertyName={`beschreibung_zur_dritte_dienstleistung_${language}`}
        />
      ),
    },
    {
      label: 'Zusätzliche Informationen',
      element: (
        <PopupElement
          properties={properties}
          propertyName={`zusaetzliche_informationen_${language}`}
        />
      ),
    },
  ];

  return (
    <div className="wkp-handicap-popup">
      <div className="wkp-handicap-popup-title">
        {feature.get('stationsbezeichnung')}
      </div>
      <table>
        {elementsList.map(field => (
          <tr>
            <td className="wkp-handicap-popup-field-title">{field.label}</td>
            <td>{field.element}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

HandicapPopup.propTypes = propTypes;

export default React.memo(HandicapPopup);
