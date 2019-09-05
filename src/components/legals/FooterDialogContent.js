import PropTypes from 'prop-types';

import KontaktDE from './kontakt/KontaktDE';
import KontaktFR from './kontakt/KontaktFR';
import KontaktIT from './kontakt/KontaktIT';
import KontaktEN from './kontakt/KontaktEN';

import LegalDE from './rechtliches/LegalDE';
import LegalFR from './rechtliches/LegalFR';
import LegalIT from './rechtliches/LegalIT';
import LegalEN from './rechtliches/LegalEN';

import ImprintDE from './impressum/ImprintDE';
import ImprintEN from './impressum/ImprintEN';
import ImprintFR from './impressum/ImprintFR';
import ImprintIT from './impressum/ImprintIT';

const kontakt = {
  de: KontaktDE,
  fr: KontaktFR,
  it: KontaktIT,
  en: KontaktEN,
};

const rechtliches = {
  de: LegalDE,
  fr: LegalFR,
  it: LegalIT,
  en: LegalEN,
};

const impressum = {
  de: ImprintDE,
  fr: ImprintFR,
  it: ImprintIT,
  en: ImprintEN,
};

const docs = {
  kontakt,
  rechtliches,
  impressum,
};

const propTypes = {
  language: PropTypes.string,
  doc: PropTypes.oneOf(Object.keys(docs)),
};

const defaultProps = {
  doc: Object.keys(docs)[0],
  language: 'de',
};

const FooterDialogContent = ({ language, doc }) => {
  return docs[doc][language];
};

FooterDialogContent.propTypes = propTypes;
FooterDialogContent.defaultProps = defaultProps;

export default FooterDialogContent;
