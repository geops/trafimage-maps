import React from 'react';
import PropTypes from 'prop-types';

function LightIcon({ color, label, fontColor, size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={`${color}`}
        stroke="black"
        strokeWidth="8"
      />
      <text
        x="50%"
        y="68%"
        textAnchor="middle"
        fontSize={45}
        fontWeight="bold"
        fill={fontColor}
      >
        {label}
      </text>
    </svg>
  );
}

LightIcon.propTypes = {
  color: PropTypes.string,
  fontColor: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.number,
};

LightIcon.defaultProps = {
  color: 'none',
  label: undefined,
  fontColor: 'black',
  size: 30,
};

export default LightIcon;
