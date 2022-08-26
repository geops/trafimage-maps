import React from 'react';
import PropTypes from 'prop-types';

const dashArray = '1 7';
const lineWidth = 3.5;
const colorYellow = 'rgba(255, 242, 0, 1)';
const colorRed = 'rgba(235, 0, 0, 1)';
const colorBlue = 'rgba(42, 102, 152, 1)';
const colorBlack = 'rgba(0, 0, 0, 1)';
const colorGray = 'rgba(180,180,180, 1)';

// Be aware that order is important here!
export const legends = [
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
        value: 50,
        paint: [
          {
            'line-color': colorRed,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
      {
        value: 25,
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
        value: 50,
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
      {
        value: 25,
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
        value: 50,
        paint: [
          {
            'line-color': colorBlack,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
      {
        value: 25,
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
        value: 50,
        paint: [
          {
            'line-color': colorBlue,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
      {
        value: 25,
        paint: [
          {
            'line-color': colorBlue,
            'line-width': lineWidth,
            'line-dasharray': dashArray,
          },
        ],
      },
      {
        value: -1,
        paint: [
          {
            'line-color': colorGray,
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
            'line-color': colorGray,
            'line-width': lineWidth,
          },
        ],
      },
    ],
  },
];

// eslint-disable-next-line react/prop-types
const GeltungsbereicheLegend = ({ mot, valid, background }) => {
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

  if (!legend) {
    // eslint-disable-next-line no-console
    console.warn(
      'No legend found! Check feature data and extend legend options if necessary',
    );
  }

  return (
    <svg
      viewBox={`0 0 50 ${background ? '50' : '10'}`}
      width="50"
      height={background ? '50' : '10'}
      xmlns="http://www.w3.org/2000/svg"
    >
      {background ? <circle cx="25" cy="25" r="25" fill="#f5f5f5" /> : null}
      {legend?.paint.map((paint) => {
        return (
          <line
            key={paint['line-dasharray'] + paint['line-color']}
            x1="0"
            y1={background ? '25' : '5'}
            x2="50"
            y2={background ? '25' : '5'}
            stroke={paint['line-color']}
            strokeWidth={paint['line-width']}
            strokeDasharray={paint['line-dasharray']}
            strokeLinecap={paint['line-dasharray'] && 'round'}
          />
        );
      })}
    </svg>
  );
};

GeltungsbereicheLegend.propTypes = {
  mot: PropTypes.string,
  valid: PropTypes.number,
  background: PropTypes.bool,
};

GeltungsbereicheLegend.defaultProps = {
  mot: null,
  valid: null,
  background: false,
};

export default GeltungsbereicheLegend;
