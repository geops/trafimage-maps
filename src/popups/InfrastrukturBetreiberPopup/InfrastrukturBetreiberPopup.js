import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
// import { Layer } from 'mobility-toolbox-js/ol';
import { useTranslation } from 'react-i18next';
import Link from '../../components/Link';
// import { makeStyles } from '@material-ui/core';

// const useStyles = makeStyles((theme) => {
//   return {
//     container
//   }
// })

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  // layer: PropTypes.oneOfType([
  //   PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
  //   PropTypes.instanceOf(Layer),
  // ]).isRequired,
  // coordinate: PropTypes.oneOfType([
  //   PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  //   PropTypes.arrayOf(PropTypes.number),
  // ]).isRequired,
};

const InfrastrukturBetreiberPopup = ({ feature }) => {
  const properties = feature.getProperties();
  const { i18n, t } = useTranslation();
  const linkUrl = properties[`url_isb_${i18n.language}`];
  // console.log(properties);
  return (
    <div>
      <Link href={linkUrl}>{t('Mehr erfahren')}</Link>
    </div>
  );
};

InfrastrukturBetreiberPopup.propTypes = propTypes;

export default InfrastrukturBetreiberPopup;
