import { netzkarte, netzkarteStelen } from './topics';

let topics = [netzkarte];

switch (process.env.REACT_APP_ENV) {
  case 'stelen': {
    topics = [netzkarteStelen];
    break;
  }
  default: {
    break;
  }
}

export default {
  topics,
};
