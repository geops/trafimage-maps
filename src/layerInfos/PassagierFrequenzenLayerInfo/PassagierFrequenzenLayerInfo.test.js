import React from 'react';
import { render } from '@testing-library/react';
import { passagierfrequenzen } from '../../config/ch.sbb.netzkarte';
import PassagierFrequenzenLayerInfo from '.';

describe('PassagierFrequenzenLayerInfo', () => {
  test('should display link to data', () => {
    const { container } = render(
      <PassagierFrequenzenLayerInfo properties={passagierfrequenzen} />,
    );
    const link = container.querySelector('a.wkp-link');
    expect(link.href).toBe(
      'https://reporting.sbb.ch/verkehr?highlighted=row-243',
    );
  });
});
