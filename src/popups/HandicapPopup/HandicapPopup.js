import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Feature from 'ol/Feature';
import PopupElement from './HandicapPopupElement';
import './HandicapPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
};

function HandicapPopup({ language, feature }) {
  const properties = feature.getProperties();
  const lng = language;

  return (
    <>
      <PopupElement
        properties={properties}
        key={`treffpunkt_${lng}`}
        name="Treffpunkt"
      />
      <PopupElement
        properties={properties}
        key={`voranmeldefrist_${lng}`}
        name="Voranmeldefrist"
      />
      <PopupElement
        properties={properties}
        key={`bedienungszeiten_${lng}`}
        name="Bedienungszeiten"
      />
      <PopupElement properties={properties} k="faltrampe" />
      <PopupElement
        properties={properties}
        key="rampe"
        ausnahme={`ausnahme_zu_rampe_${lng}`}
      />
      <PopupElement
        properties={properties}
        key="lift_zu_perron"
        name="Lift zu Perron"
        ausnahme={`ausnahme_zu_lift_${lng}`}
      />
      <PopupElement
        properties={properties}
        key="perronhoehe_P55"
        name="Perronhöhe"
        ausnahme={`ausnahme_zu_P55_${lng}`}
      />
      <PopupElement properties={properties} key="taktile_sicherheitslinien" />
      <PopupElement properties={properties} key="induktionsverstaerker" />
      <PopupElement properties={properties} key="sbb_rollstuhl" />
      <PopupElement properties={properties} key="rollstuhl_billet" />
      <PopupElement properties={properties} key="rollstuhl_wc" />
      <PopupElement properties={properties} key="eurok_wc" />
      <PopupElement
        name="Dienstleistungen dritter"
        properties={properties}
        key={`beschreibung_zur_dritte_dienstleistung_${lng}`}
      />
      <PopupElement
        properties={properties}
        key={`zusaetzliche_informationen_${lng}`}
      />
    </>
  );
}

const mapStateToProps = state => ({
  language: state.app.language,
});

const mapDispatchToProps = {};

HandicapPopup.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HandicapPopup);
