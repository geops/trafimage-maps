import React from 'react';
import { render, screen } from '@testing-library/react';
import { infrastrukturBetreiberTVS } from '../../config/layers';
import InfrastrukturBetreiberTVSLayerInfo from '.';

describe('InfrastrukturBetreiberTVSLayerInfo', () => {
  test('render something', () => {
    render(
      <InfrastrukturBetreiberTVSLayerInfo
        t={(a) => a}
        language="de"
        properties={infrastrukturBetreiberTVS}
      />,
    );
    // Test important operator
    expect(screen.getByText('SBB')).toBeInTheDocument();
    expect(screen.getByText('SBB Infrastruktur')).toBeInTheDocument();
    // Test one of the other operators
    expect(screen.getByText(/TMR, /)).toBeInTheDocument();
    expect(screen.getByText('www.tvs.ch')).toBeInTheDocument();
  });
});
