import React from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import Link from '../../components/Link';

const comps = {
  de: (
    <>
      <p>
        Angezeigt wird die Anzahl Ein- und Aussteigende an den Bahnhöfen und
        Haltestellen der MGB, RhB, SBB, SOB, Thurbo und Zentralbahn. Die Zahlen
        beziehen sich auf den durchschnittlichen werktäglichen Verkehr (Mo-Fr)
        und enthalten die Ein- resp. Aussteigenden folgender
        Transportunternehmen: BLS, MGB, MOB, Oensingen-Balsthal-Bahn,
        RegionAlps, RhB, SBB, SBB GmbH, SOB, SZU, Thurbo, TILO, TRAVYS und
        Zentralbahn. Ein- und Aussteigende anderer Transportunternehmen und
        anderer öffentlicher Verkehrsmittel sowie Passanten werden nicht
        berücksichtigt.
        <br />
        Die Angaben beziehen sich auf das Fahrplanjahr 2018.
      </p>
      <p>
        Daten: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
  fr: (
    <>
      <p>
        L’affluence des voyageurs dans les gares et les arrêts CFF, MGB, RhB,
        SOB, Thurbo et Zentralbahn est affiché. Les chiffres se rapportent au
        trafic moyen pendant les jours ouvrés (lu-ve) et recensent les montées
        et descentes de personnes pour les entreprises de transport suivantes:
        BLS, CFF, MGB, MOB, Oensingen-Balsthal-Bahn, RegionAlps, RhB, SBB GmbH,
        SOB, SZU, Thurbo, TILO, TRAVYS et Zentralbahn. Les passagers d’autres
        entreprises de transport/d’autres moyens de transport publics et les
        passants ne sont pas pris en compte.
        <br />
        Les données se réfèrent à l’année d’horaire 2018.
      </p>
      <p>
        Données: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
  en: (
    <>
      <p>
        This layer depicts the number of passengers boarding and alighting at
        stations and stops of MGB, RhB, SBB, SOB, Thurbo and Zentralbahn. The
        figures refer to normal service on working days (Mon–Fri) and include
        passengers who get on and off trains operated by the following transport
        companies: BLS, MGB, MOB, Oensingen-Balsthal-Bahn, RegionAlps, RhB, SBB,
        SBB GmbH, SOB, SZU, Thurbo, TILO, TRAVYS and Zentralbahn. Users of other
        transport companies and other means of public transport and passers-by
        are not taken into account.
        <br />
        The information refers to the timetable year 2018.
      </p>
      <p>
        Data: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
  it: (
    <>
      <p>
        Vengono visualizzate le affluenze dei passeggeri delle stazioni e
        fermate delle FFS, MGB, RhB, SOB, Thurbo e Zentralbahn. I dati si
        riferiscono al traffico feriale medio (lun.-ven.) e contengono
        informazioni sui viaggiatori saliti e scesi delle seguenti imprese di
        trasporto: BLS, FFS, MGB, MOB, Oensingen-Balsthal-Bahn, RegionAlps, RhB,
        SBB GmbH, SOB, SZU, Thurbo, TILO, TRAVYS e Zentralbahn. Gli utenti di
        altre imprese di trasporto e di altri trasporti pubblici, nonché i
        passanti, non vengono presi in considerazione.
        <br />I dati si riferiscono all’anno d’orario 2018.
      </p>
      <p>
        Dati: <a href="mailto:stat@sbb.ch">stat@sbb.ch</a>.
      </p>
    </>
  ),
};

const PassagierFrequenzenLayerInfo = ({ properties: layer }) => {
  const { t, i18n } = useTranslation();
  const dataLink = layer.get('dataLink');
  return (
    <div>
      {comps[i18n.language]}
      {dataLink && (
        <>
          <hr />
          <p>
            <Link href={dataLink}>{t('Diesen Datensatz einbinden')}</Link>
          </p>
        </>
      )}
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
