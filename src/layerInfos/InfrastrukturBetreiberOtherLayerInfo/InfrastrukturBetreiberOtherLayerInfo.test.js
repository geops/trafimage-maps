import React from 'react';
import { render, screen } from '@testing-library/react';
import { isbOther } from '../../config/layers';
import InfrastrukturBetreiberOtherLayerInfo from '.';

describe('InfrastrukturBetreiberOtherLayerInfo', () => {
  test('render something', () => {
    render(<InfrastrukturBetreiberOtherLayerInfo properties={isbOther} />);
    // Test important operator
    expect(screen.getByText(/DB, /)).toBeInTheDocument();
  });
});
