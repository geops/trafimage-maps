import Betriebspunkte from '../searches/Betriebspunkte';
import Lines from '../searches/Lines';
import Locations from '../searches/Locations';
import Municipalities from '../searches/Municipalities';
import StationFinder from '../searches/StationFinder';
import HandicapStationFinder from '../searches/HandicapStationFinder';

export const betriebspunkte = new Betriebspunkte();

export const lines = new Lines();

export const locations = new Locations();

export const municipalities = new Municipalities();

export const stationFinder = new StationFinder();

export const handicapStationFinder = new HandicapStationFinder();

export default {
  Betriebspunkte: betriebspunkte,
  Stationen: stationFinder,
  Verbindungen: lines,
  Orte: locations,
  Gemeinden: municipalities,
};
