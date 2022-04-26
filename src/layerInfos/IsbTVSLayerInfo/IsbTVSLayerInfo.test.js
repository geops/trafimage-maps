import React from 'react';
import { render, screen } from '@testing-library/react';
import { isbTVS } from '../../config/layers';
import IsbTVSLayerInfo from '.';

describe('IsbTVSLayerInfo', () => {
  test('render something', () => {
    render(<IsbTVSLayerInfo t={(a) => a} language="de" properties={isbTVS} />);
    // Test important operator
    expect(screen.getByText('SBB')).toBeInTheDocument();
    expect(screen.getByText('SBB Infrastruktur')).toBeInTheDocument();
    // Test one of the other operators
    expect(screen.getByText(/TMR, /)).toBeInTheDocument();
    expect(screen.getByText('www.tvs.ch')).toBeInTheDocument();
  });
});
