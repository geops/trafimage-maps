import {
  realtimeConfig,
  RealtimeLayer,
  fullTrajectoryDelayStyle,
  createRealtimeFilters,
  realtimeDelayStyle,
  sortByDelay,
} from 'mobility-toolbox-js/ol';

/**
 * Trajserv value: 'Tram',  'Subway / Metro / S-Bahn',  'Train', 'Bus', 'Ferry', 'Cable Car', 'Gondola', 'Funicular', 'Long distance bus', 'Rail',
 * New endpoint use Rail instead of Train.
 * New tracker values:  null, "tram", "subway", "rail", "bus", "ferry", "cablecar", "gondola", "funicular", "coach".
 *
 * @ignore
 */
export const types = [
  /^Tram/i,
  /^Subway( \/ Metro \/ S-Bahn)?/i,
  /^Train/i,
  /^Bus/i,
  /^Ferry/i,
  /^Cable ?Car/i,
  /^Gondola/i,
  /^Funicular/i,
  /^(Long distance bus|coach)/i,
  /^Rail/i, // New endpoint use Rail instead of Train.
];

const radiusMapping = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 7, 7, 15], // tram
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 7, 7, 15], // subway
  [2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 15, 15, 15, 15, 15, 15], // rail
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 7, 7, 15], // bus
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 7, 7, 7, 15, 15, 15], // ferry
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 7, 7, 7], // funicular
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 7, 7, 7], // gondola
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 7, 7, 7], // funicular
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 7, 7, 7, 15], // coach
  [2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 15, 15, 15, 15, 15, 15], // rail
];

/**
 * @ignore
 */
const getRadius = (type, zoom) => {
  try {
    const typeIdx = realtimeConfig.getTypeIndex(type || 0);
    return radiusMapping[typeIdx][zoom];
  } catch (e) {
    return 1;
  }
};

class TralisLayer extends RealtimeLayer {
  constructor(options) {
    // You can filter the trains displayed using the following properties:
    // tripNumber: '007383.003849.001:3',
    // publishedLineName: 'RE,IC5,S3,17',
    // regexPublishedLineName: '^S[0-5]$'
    const urlParams = new URLSearchParams(window.location.search);
    const tripNumber = options.tripNumber || urlParams.get('tripnumber');
    const publishedLineName =
      options.operator || urlParams.get('publishedlinename');
    const { regexPublishedLineName } = options;

    if (
      (tripNumber || publishedLineName || regexPublishedLineName) &&
      !options.filter
    ) {
      // eslint-disable-next-line no-param-reassign
      options.filter = createRealtimeFilters(
        publishedLineName,
        tripNumber,
        regexPublishedLineName,
      );
    }
    // TODO this url should be set like others url
    super({
      isUpdateBboxOnMoveEnd: true,
      minZoomNonTrain: 14,
      tenant: 'sbb',
      style: realtimeDelayStyle,
      styleOptions: {
        getRadius,
      },
      sort: sortByDelay,
      fullTrajectoryStyle: fullTrajectoryDelayStyle,
      generalizationLevelByZoom: [
        5, 5, 5, 5, 5, 5, 5, 5, 10, 30, 30, 100, 100, 150,
      ],
      getMotsByZoom: (zoom) => {
        if (zoom < 8) {
          return ['rail'];
        }

        if (zoom < 11) {
          return ['rail', 'ferry'];
        }

        if (zoom < 12) {
          return ['rail', 'ferry', 'tram', 'subway', 'rail', 'bus'];
        }

        return [
          'rail',
          'tram',
          'subway',
          'bus',
          'ferry',
          'cablecar',
          'gondola',
          'funicular',
          'coach',
        ];
      },
      ...options,
      properties: {
        isQueryable: true,
        popupComponent: 'PunctualityPopup',
        useTrackerMenu: true,
        ...(options.properties || {}),
      },
    });

    if (options.filter) {
      this.permalinkFilter = options.filter;
    }
  }

  getFeatureInfoAtCoordinate(...props) {
    // We return only one trajectory
    return super.getFeatureInfoAtCoordinate(...props).then((featureInfo) => {
      return {
        ...featureInfo,
        features: featureInfo?.features?.length
          ? [featureInfo.features[0]]
          : [],
      };
    });
  }
}

export default TralisLayer;
