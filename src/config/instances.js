import defaultTopics, { netzkarteStelen } from './topics';

let topics = defaultTopics;

switch (process.env.REACT_APP_ENV) {
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
