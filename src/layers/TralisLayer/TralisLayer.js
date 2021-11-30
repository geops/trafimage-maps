import { TralisLayer as MBTTralisLayer } from 'mobility-toolbox-js/ol';

class TralisLayer extends MBTTralisLayer {
  constructor(options) {
    // TODO this url should be set like others url
    super({
      url: 'wss://tralis-tracker-api.geops.io/ws?key=5cc87b12d7c5370001c1d655112ec5c21e0f441792cfc2fafe3e7a1e',
      ...options,
    });
  }
}

export default TralisLayer;
