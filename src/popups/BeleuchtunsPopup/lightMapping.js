import React from 'react';
import { ReactComponent as Light1 } from '../../img/light_1.svg';
import { ReactComponent as Light2a } from '../../img/light_2a.svg';
import { ReactComponent as Light2b } from '../../img/light_2b.svg';
import { ReactComponent as Light3 } from '../../img/light_3.svg';
import { ReactComponent as Light4 } from '../../img/light_4.svg';

export const lightMapping = [
  {
    key: '1',
    info: ['>= 20000 Passagiere/Tag', 'Hohes Personenaufkommen'],
    icon: <Light1 />,
  },
  {
    key: '2a',
    info: ['10000 - 19999 Passagiere/Tag', 'Mittleres Personenaufkommen'],
    icon: <Light2a />,
  },
  {
    key: '2b',
    info: ['1500 - 9999 Passagiere/Tag', 'Mittleres Personenaufkommen'],
    icon: <Light2b />,
  },
  {
    key: '3',
    info: ['50 - 1499 Passagiere/Tag', 'Geringes Personenaufkommen'],
    icon: <Light3 />,
  },
  {
    key: '2',
    info: ['< 50 Passagiere/Tag', 'Sehr geringes Personenaufkommen'],
    icon: <Light4 />,
  },
];

export default lightMapping;
