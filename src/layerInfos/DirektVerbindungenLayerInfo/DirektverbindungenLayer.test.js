import React from 'react';
import { render } from '@testing-library/react';
import { direktverbindungenLayer } from '../../config/ch.sbb.netzkarte';
import DirektVerbindungenLayerInfo from '.';

describe('direktverbindungenLayer', () => {
  test('should display link to data', () => {
    const { container } = render(
      <DirektVerbindungenLayerInfo properties={direktverbindungenLayer} />,
    );
    const link = container.querySelector('a.wkp-link');
    expect(link.href).toBe(
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
    );
  });
});
