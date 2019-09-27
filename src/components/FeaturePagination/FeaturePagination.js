import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import Button from 'react-spatial/components/Button';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import './FeaturePagination.scss';

const propTypes = {
  features: PropTypes.array.isRequired,
  featureIndex: PropTypes.number.isRequired,
  setFeatureIndex: PropTypes.func.isRequired,

  t: PropTypes.func.isRequired,
};

function FeaturePagination({ t, features, featureIndex, setFeatureIndex }) {
  return (
    <div className="wkp-pagination-wrapper">
      <span className="wkp-pagination-button-wrapper">
        {featureIndex > 0 ? (
          <Button
            className="wkp-pagination-button"
            onClick={() => setFeatureIndex(featureIndex - 1)}
          >
            <IoIosArrowRoundBack />
          </Button>
        ) : null}
      </span>
      {featureIndex + 1} {t('von')} {features.length}
      <span className="wkp-pagination-button-wrapper">
        {featureIndex + 1 < features.length ? (
          <Button
            className="wkp-pagination-button"
            onClick={() => setFeatureIndex(featureIndex + 1)}
          >
            <IoIosArrowRoundForward />
          </Button>
        ) : null}
      </span>
    </div>
  );
}

FeaturePagination.propTypes = propTypes;

export default compose(withTranslation())(FeaturePagination);
