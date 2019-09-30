import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Map from 'ol/Map';
import { MdDone, MdClear } from 'react-icons/md';
import FeatureMenu from '../../components/FeatureMenu';
import './HandicapMenu.scss';

const propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,

  // mapStateToProps
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

function HandicapMenu({ t, map, language }) {
  const unselectedLanguages = ['de', 'fr', 'it', 'en']
    .filter(l => l !== language)
    .map(l => `_${l}`)
    .join('|');

  const unselectedLanguagesRegex = new RegExp(`${unselectedLanguages}$`);

  const renderField = (key, val) => {
    if (typeof val === 'boolean') {
      return (
        <>
          <span>{key}: </span>
          {key ? <MdDone /> : <MdClear />}
        </>
      );
    }
    if (unselectedLanguagesRegex.test(key)) {
      return null;
    }
    return (
      <>
        <div>{key}: </div>
        <div className="wkp-handicap-menu-value">{val}</div>
      </>
    );
  };

  return (
    <FeatureMenu
      className="wkp-handicap-menu"
      title={t('ch.sbb.handicap')}
      map={map}
      renderBody={(idx, features) => {
        const feat = features[idx];
        const fields = feat
          .getKeys()
          .filter(
            key => !['stationsbezeichnung', 'didok', 'geometry'].includes(key),
          );
        return (
          <div className="wkp-handicap-menu-wrapper">
            <div className="wkp-handicap-menu-title">
              {feat.get('stationsbezeichnung')}
            </div>
            <div className="wkp-handicap-menu-body">
              {fields.map(key => (
                <div key={key} className="wkp-handicap-menu-field">
                  {renderField(key, features[idx].get(key))}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

const mapStateToProps = state => ({
  language: state.app.language,
});

const mapDispatchToProps = {};

HandicapMenu.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HandicapMenu);
