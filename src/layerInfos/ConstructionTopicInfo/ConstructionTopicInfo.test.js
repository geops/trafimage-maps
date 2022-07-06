import React from 'react';
import { render } from '@testing-library/react';
import ConstructionTopicInfo from '.';

describe('ConstructionTopicInfo', () => {
  test('should display link to data', () => {
    const { container } = render(<ConstructionTopicInfo />);
    const link = container.querySelector('a.wkp-link');
    expect(link.href).toBe(
      'https://data.sbb.ch/explore/dataset/construction-projects/information/',
    );
  });
});
