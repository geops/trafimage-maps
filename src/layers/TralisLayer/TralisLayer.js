import {
  RealtimeLayer,
  fullTrajectoryDelayStyle,
  createRealtimeFilters,
  realtimeDelayStyle,
  sortByDelay,
} from 'mobility-toolbox-js/ol';

class TralisLayer extends RealtimeLayer {
  constructor(options) {
    // You can filter the trains displayed using the following properties:
    // operator: 'vbz',
    // tripNumber: '5712,6553',
    // publishedLineName: 'RE,IC5,S3,17',
    // regexPublishedLineName: '^S[0-5]$'
    const urlParams = new URLSearchParams(window.location.search);
    const operator = options.operator || urlParams.get('operator');
    const tripNumber = options.tripNumber || urlParams.get('tripnumber');
    const publishedLineName =
      options.operator || urlParams.get('publishedlinename');
    const { regexPublishedLineName } = options;

    if (
      (operator || tripNumber || publishedLineName || regexPublishedLineName) &&
      !options.filter
    ) {
      // eslint-disable-next-line no-param-reassign
      options.filter = createRealtimeFilters(
        publishedLineName,
        tripNumber,
        operator,
        regexPublishedLineName,
      );
    }
    // TODO this url should be set like others url
    super({
      url: 'wss://tralis-tracker-api.geops.io/ws',
      tenant: 'sbb',
      style: realtimeDelayStyle,
      sort: sortByDelay,
      fullTrajectoryStyle: fullTrajectoryDelayStyle,
      ...options,
    });
  }
}

export default TralisLayer;
