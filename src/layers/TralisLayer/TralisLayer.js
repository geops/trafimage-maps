import { TralisLayer as MBTTralisLayer } from 'mobility-toolbox-js/ol';

class TralisLayer extends MBTTralisLayer {
  constructor(options) {
    // TODO this url should be set like others url
    super({
      url: 'wss://tralis-tracker-api.geops.io/ws',
      tenant: 'sbb',
      ...options,
    });
  }
}

export default TralisLayer;
