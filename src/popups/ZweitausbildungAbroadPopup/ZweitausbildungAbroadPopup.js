import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { setFeatureInfo } from '../../model/app/actions';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,

  // mapDispatchToProps
  dispatchSetFeatureInfo: PropTypes.func.isRequired,
};

class ZweitausbildungAbroadPopup extends PureComponent {
  componentDidMount() {
    const { feature, dispatchSetFeatureInfo } = this.props;
    window.open(feature.get('url'), '_blank');
    dispatchSetFeatureInfo();
  }

  render() {
    return null;
  }
}

ZweitausbildungAbroadPopup.propTypes = propTypes;

const mapDispatchToProps = {
  dispatchSetFeatureInfo: setFeatureInfo,
};

export default compose(connect(null, mapDispatchToProps))(
  ZweitausbildungAbroadPopup,
);
