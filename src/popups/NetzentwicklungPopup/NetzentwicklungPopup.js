import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Feature from 'ol/Feature';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import PersonCard from '../../components/PersonCard';

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
    <PersonCard
      key={`${t(rolle.bezeichnung || rolle.typ)}: ${rolle.person.name}`}
      name={`${t(rolle.bezeichnung || rolle.typ)}: ${rolle.person.name}`}
      phone={rolle.person.phone || '-'}
      email={rolle.person.email || '-'}
    />
  );
};

function NetzentwicklungPopup({ feature, layer, t }) {
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
}

NetzentwicklungPopup.renderTitle = (feat, layer, t) =>
  renderTitle(feat, t, false);
NetzentwicklungPopup.propTypes = propTypes;
export default NetzentwicklungPopup;
