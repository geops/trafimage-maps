import React from 'react';
import { render, screen } from '@testing-library/react';
import { infrastrukturBetreiberOther } from '../../config/layers';
import InfrastrukturBetreiberOtherLayerInfo from '.';

describe('InfrastrukturBetreiberOtherLayerInfo', () => {
  test('render something', () => {
    render(
      <InfrastrukturBetreiberOtherLayerInfo
        properties={infrastrukturBetreiberOther}
      />,
    );
    // Test important operator
    expect(screen.getByText(/DB, /)).toBeInTheDocument();
  });
});
