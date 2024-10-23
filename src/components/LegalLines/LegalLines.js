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

function LegalLines({ language = "de", doc = Object.keys(docs)[0] }) {
  const Comp = docs[doc];
  return <Comp language={language} />;
}

LegalLines.propTypes = propTypes;

export default LegalLines;
