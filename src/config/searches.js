import Betriebspunkte from "../searches/Betriebspunkte";
import Lines from "../searches/Lines";
import Locations from "../searches/Locations";
import Municipalities from "../searches/Municipalities";
import StopFinder from "../searches/StopFinder";
import HandicapStopFinder from "../searches/HandicapStopFinder";

export const betriebspunkte = new Betriebspunkte();

export const lines = new Lines();

export const locations = new Locations();

export const municipalities = new Municipalities();

export const stopFinder = new StopFinder();

export const handicapStopFinder = new HandicapStopFinder();

export default {
  Stationen: stopFinder,
  Gemeinden: municipalities,
  Orte: locations,
  Betriebspunkte: betriebspunkte,
  Linien: lines,
};
