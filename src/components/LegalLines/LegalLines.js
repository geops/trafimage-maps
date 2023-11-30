import React from "react";
import PropTypes from "prop-types";
import Contact from "./Contact";
import Legal from "./Legal";
import Imprint from "./Imprint";

const kontakt = Contact;
const rechtliches = Legal;
const impressum = Imprint;

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
  language: "de",
};

function LegalLines({ language, doc }) {
  const Comp = docs[doc];
  return <Comp language={language} />;
}

LegalLines.propTypes = propTypes;
LegalLines.defaultProps = defaultProps;

export default LegalLines;
