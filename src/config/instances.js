import defaultTopics, { netzkarte, netzkarteStelen } from './topics';

let topics = defaultTopics;

switch (process.env.REACT_APP_ENV) {
  case 'wkp_prod':
    topics = [netzkarte],
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
