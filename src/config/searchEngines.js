import Betriebspunkte from '../components/Search/engines/Betriebspunkte';
import Lines from '../components/Search/engines/Lines';
import Locations from '../components/Search/engines/Locations';
import Municipalities from '../components/Search/engines/Municipalities';
import StopFinder from '../components/Search/engines/StopFinder';
import HandicapNoInfoFinder from '../components/Search/engines/HandicapNoInfoFinder';
import HandicapStopFinder from '../components/Search/engines/HandicapStopFinder';

export const betriebspunkte = new Betriebspunkte();

export const lines = new Lines();

export const locations = new Locations();

export const municipalities = new Municipalities();

export const stopFinder = new StopFinder();

export const handicapNoInfoFinder = new HandicapNoInfoFinder();

export const handicapStopFinder = new HandicapStopFinder();

export default {
  Stationen: stopFinder,
  Gemeinden: municipalities,
  Orte: locations,
  Betriebspunkte: betriebspunkte,
  Linien: lines,
};
