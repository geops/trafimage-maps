import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Feature from 'ol/Feature';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import personIcon from '../../img/popups/NetzentwicklungPopup/person.svg';
import mailIcon from '../../img/popups/NetzentwicklungPopup/mail.svg';
import phoneIcon from '../../img/popups/NetzentwicklungPopup/phone.svg';

const useStyles = makeStyles({
  row: {
    minWidth: 250,
    alignItems: 'center',
    display: 'flex',

    '& img': {
      height: 24,
      width: 24,
      marginRight: 5,
    },
  },
  title: {
    padding: 8,
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    border: '1px solid #ddd',
    padding: 8,
    margin: 8,
    borderRadius: 2,
  },
});

const propTypes = {
  layer: PropTypes.instanceOf(MapboxStyleLayer).isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const renderTitle = (feat, t, includeLineInfo) => {
  let title = '';
  if (feat.get('bezeichnung')) {
    title = feat.get('bezeichnung');
  }

  if (!title || includeLineInfo) {
    const {
      km_start: kmStart,
      km_end: kmEnd,
      line_number: line,
    } = feat.getProperties();
    const lineInfo = `${t('Linie')} ${line} (km. ${kmStart} - km. ${kmEnd})`;
    title = title ? `${title}, ${lineInfo}` : lineInfo;
  }
  return title;
};

const renderRoleCard = (rolle, classes, t) => {
  return (
    <div key={rolle.typ + rolle.person.name} className={classes.card}>
      <div>{t(rolle.name)}</div>
      <div className={classes.row}>
        <img src={personIcon} alt="Person" />
        <div>
          {t(rolle.bezeichnung || rolle.typ)}: {rolle.person.name} (
          {rolle.person.division})
        </div>
      </div>
      <div className={classes.row}>
        <img src={phoneIcon} alt="Phone" />
        <a href={`tel:${rolle.person.phone}`}>{rolle.person.phone || '-'}</a>
      </div>
      <div className={classes.row}>
        <img src={mailIcon} alt="Mail" />
        <a href={`mailto:${rolle.person.email}`}>
          {(rolle.person.email || '-').toLowerCase()}
        </a>
      </div>
    </div>
  );
};

const NetzentwicklungPopup = ({ feature, layer, t }) => {
  const classes = useStyles();
  const rollen = JSON.parse(feature.get('rollen') || '[]').filter((r) =>
    ['Alle', layer.properties.netzentwicklungRoleType].includes(r.typ),
  );
  const regionRollen = JSON.parse(feature.get('region_rollen') || '[]').filter(
    (r) => ['Alle', layer.properties.netzentwicklungRoleType].includes(r.typ),
  );
  const mbFeature = feature.get('mapboxFeature');
  let regionColor = 'transparent';
  if (mbFeature) {
    const { r, g, b, a } = mbFeature.layer.paint['line-color'] || {
      r: 1,
      g: 1,
      b: 1,
      a: 1,
    };
    regionColor = `rgba(${r * 255},${g * 255},${b * 255},${a})`;
  }
  return (
    <div>
      <div className={classes.title}>
        <div
          style={{
            backgroundColor: regionColor,
            width: 19,
            height: 19,
            borderRadius: '50%',
            marginRight: 9,
          }}
        />
        {`${t('Region')} ${t(feature.get('region'))}`}
      </div>
      <div className={classes.title}>{renderTitle(feature, t, true)}</div>
      <div>
        {rollen.map((rolle) => renderRoleCard(rolle, classes, t))}
        {regionRollen.map((rolle) => renderRoleCard(rolle, classes, t))}
      </div>
    </div>
  );
};

NetzentwicklungPopup.renderTitle = (feat, layer, t) =>
  renderTitle(feat, t, false);
NetzentwicklungPopup.propTypes = propTypes;
export default NetzentwicklungPopup;
