import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import PopupElement from './HandicapPopupElement';
import './HandicapPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function HandicapPopup({ feature }) {
  const language = useSelector(state => state.app.language);
  const properties = feature.getProperties();
  return (
    <>
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
      <PopupElement properties={properties} propertyName="faltrampe" />
      <PopupElement
        properties={properties}
        propertyName="rampe"
        ausnahme={`ausnahme_zu_rampe_${language}`}
      />
      <PopupElement
        properties={properties}
        propertyName="lift_zu_perron"
        label="Lift zu Perron"
        ausnahme={`ausnahme_zu_lift_${language}`}
      />
      <PopupElement
        properties={properties}
        propertyName="perronhoehe_P55"
        label="Perronhöhe"
        ausnahme={`ausnahme_zu_P55_${language}`}
      />
      <PopupElement
        properties={properties}
        propertyName="taktile_sicherheitslinien"
      />
      <PopupElement
        properties={properties}
        propertyName="induktionsverstaerker"
      />
      <PopupElement properties={properties} propertyName="sbb_rollstuhl" />
      <PopupElement properties={properties} propertyName="rollstuhl_billet" />
      <PopupElement properties={properties} propertyName="rollstuhl_wc" />
      <PopupElement properties={properties} propertyName="eurok_wc" />
      <PopupElement
        label="Dienstleistungen dritter"
        properties={properties}
        propertyName={`beschreibung_zur_dritte_dienstleistung_${language}`}
      />
      <PopupElement
        properties={properties}
        propertyName={`zusaetzliche_informationen_${language}`}
      />
    </>
  );
}

HandicapPopup.propTypes = propTypes;

export default React.memo(HandicapPopup);
