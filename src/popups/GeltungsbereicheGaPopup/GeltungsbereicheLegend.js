import React from 'react';
import PropTypes from 'prop-types';

const dashArray = '6 4';
const lineWidth = 3.5;
const colorYellow = 'rgba(255, 242, 0, 1)';
const colorRed = 'rgba(235, 0, 0, 1)';
const colorBlue = 'rgba(42, 102, 152, 1)';
const colorBlack = 'rgba(0, 0, 0, 1)';
export const legends = [
  {
    mots: ['bus'],
    validity: [
      {
        value: 100,
        paint: [
          {
            'line-color': 'rgba(74, 74, 74, 1)',
            'line-width': lineWidth + 0.5,
          },
          {
            'line-color': colorYellow,
            'line-width': lineWidth,
          },
        ],
      },
      {
        value: [50, 25],
        paint: [
          {
            'line-color': 'rgba(74, 74, 74, 1)',
            'line-width': lineWidth + 0.5,
            'line-dasharray': dashArray,
          },
          {
            'line-color': colorYellow,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
    ],
  },
  {
    mots: ['rail', 'tram'],
    validity: [
      {
        value: 100,
        paint: [
          {
            'line-color': colorRed,
            'line-width': lineWidth,
          },
        ],
      },
      {
        value: [50, 25],
        paint: [
          {
            'line-color': colorRed,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
    ],
  },
  {
    mots: ['ferry'],
    validity: [
      {
        value: 100,
        paint: [
          {
            'line-color': colorBlue,
            'line-width': lineWidth,
          },
        ],
      },
      {
        value: [50, 25],
        paint: [
          {
            'line-color': colorBlue,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
    ],
  },
  {
    mots: ['gondola', 'funicular'],
    validity: [
      {
        value: 100,
        paint: [
          {
            'line-color': colorBlack,
            'line-width': lineWidth,
          },
        ],
      },
      {
        value: [50, 25],
        paint: [
          {
            'line-color': colorBlack,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
    ],
  },
  {
    mots: [null],
    validity: [
      {
        value: null,
        paint: [
          {
            'line-color': 'rgba(180,180,180, 1)',
            'line-width': lineWidth,
          },
        ],
      },
    ],
  },
];

// eslint-disable-next-line react/prop-types
const GeltungsbereicheLegend = ({ mot, valid }) => {
  // const mapboxFeature = feature.get('mapboxFeature');
  const legend = legends
    .find(({ mots }) => {
      return mots.includes(mot);
    })
    .validity.find(({ value }) => {
      if (Array.isArray(value) && !Array.isArray(valid)) {
        return value.includes(valid);
      }
      if (Array.isArray(value) && !Array.isArray(valid)) {
        return value.toString() === valid.toString();
      }
      return value === valid;
    });

  return (
    <svg
      viewBox="0 0 80 10"
      width="80"
      height="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      {legend.paint.map((paint) => {
        return (
          <line
            key={paint['line-dasharray'] + paint['line-color']}
            x1="0"
            y1="5"
            x2="50"
            y2="5"
            stroke={paint['line-color']}
            strokeWidth={paint['line-width']}
            strokeDasharray={paint['line-dasharray']}
          />
        );
      })}
    </svg>
  );
};

GeltungsbereicheLegend.propTypes = {
  mot: PropTypes.string,
  valid: PropTypes.number,
};

GeltungsbereicheLegend.defaultProps = {
  mot: null,
  valid: null,
};

export default GeltungsbereicheLegend;
