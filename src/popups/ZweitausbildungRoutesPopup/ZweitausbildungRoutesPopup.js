import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './ZweitausbildungRoutesPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

class ZweitausbildungRoutesPopup extends PureComponent {
  constructor(props) {
    super(props);

    // Sorted unique features by bezeichnung
    const singleFeatures = props.feature
      .get('features')
      .filter((feat, pos, arr) => {
        return (
          arr
            .map((f) => f.get('bezeichnung'))
            .indexOf(feat.get('bezeichnung')) === pos
        );
      })
      .sort((a, b) => (a.get('bezeichnung') > b.get('bezeichnung') ? 1 : -1));

    this.state = {
      features: singleFeatures,
    };
  }

  componentDidMount() {
    const { features } = this.state;

    // Highlight the first feature
    this.highlight(features[0]);
  }

  componentWillUnmount() {
    const { feature } = this.props;
    const highlightFeatures = feature.get('highlightFeatures');

    // Update the features in the map
    for (let i = 0; i < highlightFeatures.length; i += 1) {
      highlightFeatures[i].set('highlight', false);
    }
  }

  highlight(singleFeature) {
    const { feature } = this.props;
    const { features } = this.state;
    const highlightFeatures = feature.get('highlightFeatures');

    // Update the features in the popup
    const singleFeatures = features;
    for (let j = 0; j < singleFeatures.length; j += 1) {
      singleFeatures[j].set('highlight', singleFeatures[j] === singleFeature);
    }

    // Update the features in the map
    for (let i = 0; i < highlightFeatures.length; i += 1) {
      highlightFeatures[i].set(
        'highlight',
        highlightFeatures[i].get('bezeichnung') ===
          singleFeature.get('bezeichnung'),
      );
      highlightFeatures[i].changed();
    }

    this.setState({ features: [...singleFeatures] });
  }

  render() {
    const { t, staticFilesUrl } = this.props;
    const { features } = this.state;

    return (
      <div className="wkp-zweitausbildung-routes-popup">
        {features.map((singleFeature) => (
          <div
            className={`wkp-zweitausbildung-routes-popup-row${
              singleFeature.get('highlight') ? ' highlight' : ''
            }`}
            key={singleFeature.get('bezeichnung')}
            onMouseEnter={() => this.highlight(singleFeature)}
          >
            {singleFeature.get('line_number') ? (
              <span className="wkp-zweitausbildung-routes-popup-image">
                <img
                  src={`${staticFilesUrl}/img/layers/zweitausbildung/${singleFeature.get(
                    'line_number',
                  )}.png`}
                  height="16"
                  width="42"
                  draggable="false"
                  alt={t('Kein Bildtext')}
                />
              </span>
            ) : null}
            <b>{singleFeature.get('bezeichnung')}</b>
            <div className="wkp-zweitausbildung-routes-popup-desc">
              {singleFeature.get('viadescription')
                ? singleFeature.get('viadescription')
                : singleFeature.get('description')}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ZweitausbildungRoutesPopup.propTypes = propTypes;

const composed = compose(withTranslation())(ZweitausbildungRoutesPopup);

composed.renderTitle = (feature, t) => t('Detailinformationen');
export default composed;
