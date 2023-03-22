import React from 'react';
import { render } from '@testing-library/react';
import { ipvMainLayer } from '../../config/ch.sbb.ipv';
import DirektVerbindungenLayerInfo from '.';

describe('direktverbindungenLayer', () => {
  test('should display link to data', () => {
    const { container } = render(
      <DirektVerbindungenLayerInfo properties={ipvMainLayer} />,
    );
    const link = container.querySelector('a.wkp-link');
    expect(link.href).toBe(
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
    );
  });
});
