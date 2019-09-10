import PropTypes from 'prop-types';

import ContactDE from './contact/ContactDE';
import ContactFR from './contact/ContactFR';
import ContactIT from './contact/ContactIT';
import ContactEN from './contact/ContactEN';

import LegalDE from './legal/LegalDE';
import LegalFR from './legal/LegalFR';
import LegalIT from './legal/LegalIT';
import LegalEN from './legal/LegalEN';

import ImprintDE from './impressum/ImprintDE';
import ImprintEN from './impressum/ImprintEN';
import ImprintFR from './impressum/ImprintFR';
import ImprintIT from './impressum/ImprintIT';

const kontakt = {
  de: ContactDE,
  fr: ContactFR,
  it: ContactIT,
  en: ContactEN,
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

const LegalLines = ({ language, doc }) => {
  return docs[doc][language];
};

LegalLines.propTypes = propTypes;
LegalLines.defaultProps = defaultProps;

export default LegalLines;
