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
    treppenfrei: null,
    perronhoehe_P55: `ausnahme_zu_P55_${language}`,
    rampe: `ausnahme_zu_rampe_und_treppe_${language}`,
    lift_zu_perron: `standort_zu_lift_${language}`,
    taktile_sicherheitslinien: null,
    rollstuhl_billet: null,
    induktionsverstaerker: null,
    rollstuhl_wc: null,
    eurokey_wc: null,
    sbb_rollstuhl: null,
    mobilift: `sektor_${language}`,
    faltrampe: null,
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
    {
      label: 'Aktuell',
      propertyName: `aktuell_${language}`,
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
            label={t('Zusätzliche Informationen')}
            properties={props}
            propertyName={`zusaetzliche_informationen_${language}`}
          />
          <PopupElement
            key={`beschreibung_zur_dritte_dienstleistung_${language}`}
            label={t('Dritte Dienstleistung')}
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
          label={t('Zusätzliche Informationen')}
          properties={props}
          propertyName={`zusaetzliche_informationen_${language}`}
        />
      );
    }
    return (
      <PopupElement
        key="beschreibung_zur_dritte_dienstleistung"
        label={t('Dritte Dienstleistung')}
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
                label={t(field.label)}
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
