import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { useTranslation } from 'react-i18next';
import PopupElement from './HandicapPopupElement';

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
    <div className="wkp-handicap-popup-element" key="Ausstattung">
      <div className="wkp-handicap-popup-field-title">{t('Ausstattung')}</div>
      <div className="wkp-handicap-popup-field-body">
        {equipment.join(', ')}
      </div>
    </div>
  ) : null;

  const elementsList = [
    {
      label: 'Treffpunkt',
      propertyName: `treffpunkt_${language}`,
    },
    {
      label: 'Voranmeldefrist',
      propertyName: `voranmeldefrist_${language}`,
    },
    {
      label: 'Bedienungszeiten',
      propertyName: `bedienungszeiten_${language}`,
    },
    {
      label: 'Ausstattung',
      element: equipmentStr,
    },
  ];

  const renderBottom = props => {
    if (
      [
        `zusaetzliche_informationen_${language}`,
        `beschreibung_zur_dritte_dienstleistung_${language}`,
      ].every(val => Object.keys(props).includes(val) && props[val] !== '')
    ) {
      return (
        <div className="wkp-handicap-popup-bottom">
          <PopupElement
            key="Zusätzliche Informationen"
            label="Zusätzliche Informationen"
            properties={props}
            propertyName={`zusaetzliche_informationen_${language}`}
          />
          <PopupElement
            key="Dienstleistungen Dritter"
            label="Dienstleistungen Dritter"
            properties={props}
            propertyName={`beschreibung_zur_dritte_dienstleistung_${language}`}
          />
        </div>
      );
    }
    if (
      Object.keys(props).includes(`zusaetzliche_informationen_${language}`) &&
      // eslint-disable-next-line react/destructuring-assignment
      props[`zusaetzliche_informationen_${language}`] !== ''
    ) {
      return (
        <PopupElement
          key="Zusätzliche Informationen"
          label="Zusätzliche Informationen"
          properties={props}
          propertyName={`zusaetzliche_informationen_${language}`}
        />
      );
    }
    return (
      <PopupElement
        key="Dienstleistungen Dritter"
        label="Dienstleistungen Dritter"
        properties={props}
        propertyName={`beschreibung_zur_dritte_dienstleistung_${language}`}
      />
    );
  };

  return (
    <div className="wkp-handicap-popup">
      <div className="wkp-handicap-popup-body">
        {elementsList.map(field => {
          if (!properties[field.propertyName] && !field.element) {
            return null;
          }
          return (
            field.element || (
              <PopupElement
                key={field.label}
                label={field.label}
                properties={properties}
                propertyName={field.propertyName.replace(
                  `{language}`,
                  language,
                )}
              />
            )
          );
        })}
        {renderBottom(properties)}
      </div>
    </div>
  );
}

HandicapPopup.propTypes = propTypes;

const memoized = React.memo(HandicapPopup);
memoized.renderTitle = feat => feat.get('stationsbezeichnung');

export default memoized;
