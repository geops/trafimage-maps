import Betriebspunkte from "../searches/Betriebspunkte";
import Lines from "../searches/Lines";
import Locations from "../searches/Locations";
import Municipalities from "../searches/Municipalities";
import StopFinder from "../searches/StopFinder";
import HandicapStopFinder from "../searches/HandicapStopFinder";

export const SearchName = {
  Stationen: "Stationen",
  Gemeinden: "Gemeinden",
  Orte: "Orte",
  Betriebspunkte: "Betriebspunkte",
  Linien: "Linien",
  HandicapStopFinder: "HandicapStopFinder",
};

export function getDefaultSearches() {
  return {
    [SearchName.Stationen]: new StopFinder(),
    [SearchName.Gemeinden]: new Municipalities(),
    [SearchName.Orte]: new Locations(),
    [SearchName.Betriebspunkte]: new Betriebspunkte(),
    [SearchName.Linien]: new Lines(),
  };
}

export function getSearchByName(name) {
  if (name === SearchName.Stationen) return new StopFinder();
  if (name === SearchName.Gemeinden) return new Municipalities();
  if (name === SearchName.Orte) return new Locations();
  if (name === SearchName.Betriebspunkte) return new Betriebspunkte();
  if (name === SearchName.Linien) return new Lines();
  if (name === SearchName.HandicapStopFinder) return new HandicapStopFinder();
  return null;
}
