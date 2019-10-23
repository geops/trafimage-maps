import defaultTopics, { netzkarte, netzkarteStelen } from './topics';

const env = process && process.env && process.env.REACT_APP_ENV;
let topics = defaultTopics;

switch (env) {
  case 'wkp_prod':
    topics = [netzkarte];
    break;
  case 'stele': {
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
