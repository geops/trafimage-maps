import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import RailplusLayer from '../../layers/RailplusLayer';
import Link from '../../components/Link';

const providers = {
  109: {},
  136: {},
  171: {},
  115: {
    urls: {
      de: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
      fr: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
      it: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
      en: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
    },
  },
  122: {
    urls: {
      de: 'https://www.blt.ch/unternehmen/portraet',
      fr: 'https://www.blt.ch/unternehmen/portraet',
      it: 'https://www.blt.ch/unternehmen/portraet',
      en: 'https://www.blt.ch/unternehmen/portraet',
    },
  },
  132: {
    urls: {
      de: 'https://www.dfb.ch/de/',
      fr: 'https://www.dfb.ch/fr/',
      it: 'https://www.dfb.ch/it/',
      en: 'https://www.dfb.ch/en/',
    },
  },
  212: {
    urls: {
      de: 'https://journey.mob.ch/de/',
      fr: 'https://journey.mob.ch/fr/',
      it: 'https://journey.mob.ch/de/',
      en: 'https://journey.mob.ch/en/',
    },
  },
  183: {
    urls: {
      de: 'https://www.aargauverkehr.ch/ava/partnerangebote/netzzugang',
      fr: 'https://www.aargauverkehr.ch/ava/partnerangebote/netzzugang',
      it: 'https://www.aargauverkehr.ch/ava/partnerangebote/netzzugang',
      en: 'https://www.aargauverkehr.ch/ava/partnerangebote/netzzugang',
    },
  },
  114: {
    urls: {
      de: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
      fr: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
      it: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
      en: 'https://www.jungfrau.ch/de-ch/unternehmen/netzzugang-zum-schienennetz/',
    },
  },
  40: {},
  142: {
    urls: {
      de: 'https://fartiamo.ch/de/die-firma-ueber-uns/',
      fr: 'https://fartiamo.ch/fr/entreprise-a-propos-de-nous/',
      it: 'https://fartiamo.ch/azienda-chi-siamo/',
      en: 'https://fartiamo.ch/en/the-company-about-us/',
    },
  },
  129: {
    urls: {
      de: 'https://www.forchbahn.ch/ueber-uns/netzzugang',
      fr: 'https://www.forchbahn.ch/ueber-uns/netzzugang',
      it: 'https://www.forchbahn.ch/ueber-uns/netzzugang',
      en: 'https://www.forchbahn.ch/ueber-uns/netzzugang',
    },
  },
  146: {
    urls: {
      de: 'https://flpsa.ch/index/de/',
      fr: 'https://flpsa.ch/index/fr/',
      it: 'https://flpsa.ch/index/',
      en: 'https://flpsa.ch/index/en/',
    },
  },
  139: {
    urls: {
      de: 'https://www.t-l.ch/entreprises/ordonnance-sur-lacces-au-reseau-ferroviaire/',
      fr: 'https://www.t-l.ch/entreprises/ordonnance-sur-lacces-au-reseau-ferroviaire/',
      it: 'https://www.t-l.ch/entreprises/ordonnance-sur-lacces-au-reseau-ferroviaire/',
      en: 'https://www.t-l.ch/entreprises/ordonnance-sur-lacces-au-reseau-ferroviaire/',
    },
  },
  120: {
    urls: {
      de: 'https://www.mbc.ch/R%C3%A9seau%20ferr%C3%A9',
      fr: 'https://www.mbc.ch/R%C3%A9seau%20ferr%C3%A9',
      it: 'https://www.mbc.ch/R%C3%A9seau%20ferr%C3%A9',
      en: 'https://www.mbc.ch/R%C3%A9seau%20ferr%C3%A9',
    },
  },
  180: {
    urls: {
      de: 'https://www.matterhorngotthardbahn.ch/de/stories/sicher-unterwegs',
      fr: 'https://www.matterhorngotthardbahn.ch/de/stories/sicher-unterwegs',
      it: 'https://www.matterhorngotthardbahn.ch/de/stories/sicher-unterwegs',
      en: 'https://www.matterhorngotthardbahn.ch/de/stories/sicher-unterwegs',
    },
  },
  151: {
    urls: {
      de: 'https://journey.mob.ch/de/',
      fr: 'https://journey.mob.ch/de/',
      it: 'https://journey.mob.ch/de/',
      en: 'https://journey.mob.ch/de/',
    },
  },
  152: {
    urls: {
      de: 'https://www.nstcm.ch/fr/N1804/frinformations-reseau.html',
      fr: 'https://www.nstcm.ch/fr/N1804/frinformations-reseau.html',
      it: 'https://www.nstcm.ch/fr/N1804/frinformations-reseau.html',
      en: 'https://www.nstcm.ch/fr/N1804/frinformations-reseau.html',
    },
  },
  170: {},
  32: {},
  105: {
    urls: {
      de: 'https://tpc.ch/societe/infrastructure/',
      fr: 'https://tpc.ch/societe/infrastructure/',
      it: 'https://tpc.ch/societe/infrastructure/',
      en: 'https://tpc.ch/societe/infrastructure/',
    },
  },
  37: {},
  47: {},
  154: {},
  25: {},
  316: {
    urls: {
      de: 'https://www.tpg.ch/fr',
      fr: 'https://www.tpg.ch/fr',
      it: 'https://www.tpg.ch/fr',
      en: 'https://www.tpg.ch/en',
    },
  },
  491: {
    urls: {
      de: 'https://www.verticalp-emosson.ch/',
      fr: 'https://www.verticalp-emosson.ch/',
      it: 'https://www.verticalp-emosson.ch/',
      en: 'https://www.verticalp-emosson.ch/',
    },
  },
};

function SchmalspurPopup({ feature, layer }) {
  const { i18n } = useTranslation();
  const tuNummer = feature.get('isb_tu_nummer');
  const tuDetails = layer.railplusProviders[feature.get('isb_tu_nummer')];
  const href = providers[tuNummer]?.urls?.[i18n.language];

  return (
    <div>
      {href ? (
        <Link href={href}>{tuDetails.long_name}</Link>
      ) : (
        <Typography variant="body2">{tuDetails.long_name}</Typography>
      )}
    </div>
  );
}

SchmalspurPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(RailplusLayer).isRequired,
};

export default React.memo(SchmalspurPopup);
