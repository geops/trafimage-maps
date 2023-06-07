import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import DataLink from '../../components/DataLink';

const comps = {
  de: (
    <>
      <p>
        Die Karte stellt die Anzahl der Ein- und Aussteigenden an den Bahnhöfen
        und Haltestellen der Eisenbahn dar. Die Zahlen beziehen sich auf den
        durchschnittlichen werktäglichen Verkehr (Montag bis Freitag) und die
        für den jeweiligen Bahnhof angegebenen Eisenbahnverkehrs­unternehmen.
        Ein- und Aussteigende anderer öffentlicher Verkehrsmittel sowie
        Passanten werden nicht berücksichtigt. Umsteigende zählen sowohl als
        Aus- wie als Einsteigende, also zweifach.
      </p>
      <p>
        Daten: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
  fr: (
    <>
      <p>
        La carte représente le nombre de personnes montant et descendant des
        trains dans les gares et aux arrêts. Les chiffres se réfèrent au trafic
        journalier moyen des jours ouvrés (lundi à vendredi) et aux entreprises
        de transport ferroviaire indiquées pour chaque gare. Ni les personnes
        montant et descendant d’autres modes de transports publics, ni les
        passant·e·s ne sont pris en compte. Les voyageuses et voyageurs qui
        changent de train sont comptés deux fois, à savoir comme personnes
        descendant du train et comme personnes montant à bord.
      </p>
      <p>
        Données: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
  en: (
    <>
      <p>
        The map depicts the number of passengers boarding and alighting at
        railway stations and stops. The figures refer to average weekday traffic
        (Monday to Friday) and the railway undertakings indicated for the
        respective station. Passengers boarding and alighting other public
        transport as well as passers-by are not taken into account. Passengers
        changing trains are counted twice, as both alighting and boarding.
      </p>
      <p>
        Data: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
  it: (
    <>
      <p>
        La mappa rappresenta il numero di persone che salgono e scendono dal
        treno nelle stazioni e alle fermate ferroviarie. I dati si riferiscono
        al traffico feriale medio (dal lunedì al venerdì) e alle imprese di
        trasporto ferroviario indicate per la rispettiva stazione. Le persone
        che salgono e scendono da altri mezzi pubblici e i passanti non vengono
        presi in considerazione. I viaggiatori in coincidenza sono conteggiati
        due volte, sia quando salgono, sia quando scendono.
      </p>
      <p>
        Dati: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
};

const PassagierFrequenzenLayerInfo = ({ properties: layer }) => {
  const { i18n, t } = useTranslation();
  const statisticsLink = useMemo(() => {
    const { language: lang } = i18n;
    return `https://reporting.sbb.ch${lang === 'de' ? '' : `/${lang}`}/${t(
      'verkehr',
    )}?highlighted=row-243`;
  }, [i18n, t]);
  return (
    <div>
      {comps[i18n.language]}
      <hr />
      <p>
        <DataLink href={statisticsLink} layer={layer} />
      </p>
      <p>
        <DataLink href="https://geo.sbb.ch/site/rest/services/Trafimage_PUBLIC/">
          {t('Diesen Datensatz als Service einbinden (SBB-intern)')}
        </DataLink>
      </p>
    </div>
  );
};

PassagierFrequenzenLayerInfo.propTypes = {
  properties: PropTypes.instanceOf(Layer),
};
PassagierFrequenzenLayerInfo.defaultProps = {
  properties: { get: () => {} },
};

export default React.memo(PassagierFrequenzenLayerInfo);
