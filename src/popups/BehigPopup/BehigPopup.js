import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Link from '../../components/Link';

import './BehigPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

/**
 * Replace substring by component
 * @private
 */
const replace = (text, substr, replacement) => {
  const array = text
    .split(substr)
    .map(str => {
      return [str, replacement];
    })
    .flat();
  array.pop();
  return array;
};

const BehigPopup = ({ feature, language, t }) => {
  let textArray = [];

  // Link Handicap
  const url = t('www.sbb.ch/handicap');
  const link = (
    <Link href={`https://${url}`} key={url}>
      {url}
    </Link>
  );

  // Link ViaStaziun
  const viaStaziun = 'Via Staziun:';
  const linkViaStaziun = (
    <Link
      href={feature.get('via_staziun_link')}
      key={feature.get('via_staziun_link')}
    >
      ViaStaziun
    </Link>
  );

  const text = feature.get(`text_popup_${language}`);
  if (text) {
    // Set prognosis and split in sentences (for formatting)
    textArray = text
      .replace(/JJJJ|YYYY/, feature.get('prognose'))
      .split(/(?:\.\s|\.$)/);

    if (textArray[textArray.length - 1] === '') {
      textArray.pop();
    }

    textArray = textArray
      .map(str => {
        // Link Handicap
        let array = replace(str, url, link);

        // Link ViaStaziun
        if (feature.get('via_staziun_link')) {
          array = array.map(elem => {
            return typeof elem === 'string'
              ? replace(elem, viaStaziun, linkViaStaziun)
              : elem;
          });
        }
        return array;
      })
      // Format sentences
      // eslint-disable-next-line react/no-array-index-key
      .map((sentence, idx) => <div key={idx}>{sentence}</div>);
  }

  return <div className="wkp-behig-popup">{textArray}</div>;
};

const mapStateToProps = state => ({
  language: state.app.language,
});

BehigPopup.propTypes = propTypes;
BehigPopup.defaultProps = defaultProps;

const composed = compose(
  withTranslation(),
  connect(mapStateToProps),
)(BehigPopup);

composed.renderTitle = feat => feat.get('name');
export default composed;
