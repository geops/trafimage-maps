import { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { useTranslation } from 'react-i18next';
import PopupElement from './HandicapPopupElement';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function HandicapPopup({ feature }) {
  const language = useSelector((state) => state.app.language);
  const properties = feature.getProperties();
  const { t } = useTranslation();
  const refBody = useRef();

  useEffect(() => {
    // focus first element to trigger screenreader to read its content:
    // https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
    if (refBody && refBody.current) {
      refBody.current.focus();
    }
  }, []);

  // mapping of all boolean values properties and their exceptions
  const bfEquipmentExceptions = {
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

  equipment.unshift(
    properties.treppenfrei ? t('treppenfrei') : t('nicht treppenfrei'),
  );

  Object.keys(bfEquipmentExceptions).forEach((key) => {
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

  const behigInfo = () => {
    const status = properties.status_bahnhof;
    if (status === 'OK') {
      return t('Dieser Bahnhof ist barrierefrei.');
    }
    if (status === 'NOCH NICHT OK') {
      const prognose =
        properties.prognose === 'nach 2026'
          ? `${t('behig_nach')} 2026`
          : properties.prognose;
      return `${t(
        `Dieser Bahnhof wird vollständig angepasst`,
      )}: ${prognose} (${t('Prognose')}).`;
    }
    if (status === 'BLEIBEN NICHT OK') {
      return t('Dieser Bahnhof wird nicht baulich angepasst.');
    }
    return t('Keine Information vorhanden.');
  };

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
      element: (
        <div className="wkp-handicap-popup-element" key="BehigInfo">
          <div className="wkp-handicap-popup-field-title">
            {t('ch.sbb.behig')}
          </div>
          <span>{behigInfo()}</span>
        </div>
      ),
    },
    {
      label: 'Aktuell',
      propertyName: `aktuell_${language}`,
    },
  ];

  const renderBottom = (props) => {
    if (
      [
        `zusaetzliche_informationen_${language}`,
        `beschreibung_zur_dritte_dienstleistung_${language}`,
      ].every((val) => Object.keys(props).includes(val) && props[val] !== '')
    ) {
      return (
        <div className="wkp-handicap-popup-bottom">
          <PopupElement
            key={`beschreibung_zur_dritte_dienstleistung_${language}`}
            label={t('Dritte Dienstleistung')}
            properties={props}
            propertyName={`beschreibung_zur_dritte_dienstleistung_${language}`}
          />
          <PopupElement
            key="Zusätzliche Informationen"
            label={t('Zusätzliche Informationen')}
            properties={props}
            propertyName={`zusaetzliche_informationen_${language}`}
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

  const titles = properties.stuetzpunktbahnhof
    ? [`${t('Stützpunktbahnhof')}`]
    : [];

  if (properties.barrierefreier_bahnhof !== null) {
    titles.push(
      properties.barrierefreier_bahnhof
        ? t('Barrierefreier Bahnhof')
        : t('Nicht barrierefreier Bahnhof'),
    );
  }

  const renderBody = () => {
    if (properties.noInfo) {
      return (
        <span tabIndex={-1} ref={refBody}>
          {t('Keine Information vorhanden.')}
        </span>
      );
    }
    return (
      <>
        <p className="wkp-handicap-popup-title" ref={refBody} tabIndex={-1}>
          {titles.join(' / ')}
        </p>
        {elementsList.map((field) => {
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
      </>
    );
  };

  return (
    <div
      className="wkp-handicap-popup"
      style={{
        minWidth: properties.noInfo ? '250px' : '350px',
      }}
    >
      <div className="wkp-handicap-popup-body" id="wkp-popup-desc">
        {renderBody()}
      </div>
    </div>
  );
}

HandicapPopup.propTypes = propTypes;

const memoized = memo(HandicapPopup);
memoized.renderTitle = (feat) => feat.get('stationsbezeichnung');

export default memoized;
