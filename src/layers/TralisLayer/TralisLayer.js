import { RealtimeLayer } from 'mobility-toolbox-js/ol';

import { realtimeDelayStyle, sortByDelay } from 'mobility-toolbox-js/common';

class TralisLayer extends RealtimeLayer {
  constructor(options) {
    // TODO this url should be set like others url
    super({
      url: 'wss://tralis-tracker-api.geops.io/ws',
      tenant: 'sbb',
      style: realtimeDelayStyle,
      sort: sortByDelay,
      ...options,
    });
  }
}

export default TralisLayer;
