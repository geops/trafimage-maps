/* eslint-disable no-param-reassign */
import { Feature } from 'ol';
import PropTypes from 'prop-types';
import GeometryType from 'ol/geom/GeometryType';
import React, { useMemo, useEffect, useState } from 'react';

const EnergiePopup = ({ feature }) => {
  // eslint-disable-next-line no-unused-vars
  const [persons, setPersons] = useState([]);
  const personsData = useMemo(() => {
    const personMap = new Map();
    personMap.set('anlageeigner', feature.get('anlageeigner'));
    personMap.set(
      'betriebInstandhaltung',
      feature.get('betrieb_instandhaltung'),
    );
    personMap.set('lifeCycleManager', feature.get('life_cycle_manager'));
    return personMap;
  }, [feature]);

  useEffect(() => {
    async function fetchPerson(uri) {
      const person = await fetch(uri);
      return person;
    }
    if (personsData && personsData.size) {
      const finalPersons = [];
      personsData.forEach((person) => {
        if (person) {
          finalPersons.push(fetchPerson(`${person.uri}?format=json`));
        }
      });
      setPersons(finalPersons);
    }
  }, [personsData]);

  return <p>This is the EnergiePopup</p>;
};

EnergiePopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

EnergiePopup.renderTitle = (feat) =>
  feat.get(
    feat.getGeometry().getType() === GeometryType.POINT
      ? 'anlage_id'
      : 'trassennummer',
  );
export default EnergiePopup;
