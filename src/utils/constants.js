/* eslint-disable import/prefer-default-export */

import getIsMobileDevice from "./getIsMobileDevice";

export const SWISS_EXTENT = [656409.5, 5740863.4, 1200512.3, 6077033.16];
export const SWISS_CENTER = [903000, 5899500];

export const DRAW_PARAM = "draw.id";
export const DRAW_REDIRECT_PARAM = "draw.redirect";
export const MAPSET_PARENT_PARAM = "parent";
export const DRAW_OLD_PARAM = "wkp.draw";

// matomo tracking variables
export const LS_MATOMO_USER_SESSION_TIMER = "matomo_user_session_timer";
export const LS_MATOMO_TOPIC_VISITED = "matomo_topic_visited";
export const MATOMO_TOPIC_CHANGE_ACTION = "load";
export const MATOMO_TOPIC_CHANGE_TIMER = 30 * 60 * 1000;
export const TRACK_NEW_DRAW_ACTION = "clickNewDraw";
export const TRACK_SHARE_PERMALINK_ACTION = "clickSharePermalink";
export const TRACK_SHARE_MAIL_ACTION = "clickShareMail";
export const TRACK_SHARE_DL_ACTION = "clickShareDownload";
export const TRACK_SHARE_FB_ACTION = "clickShareFacebook";
export const TRACK_SHARE_TW_ACTION = "clickShareTwitter";

// Layer names
export const DATA_LAYER_NAME = "ch.sbb.netzkarte.data";
export const NETZKARTE_LAYER_NAME = "ch.sbb.netzkarte.layer";
export const NETZKARTE_AERIAL_LAYER_NAME = "ch.sbb.netzkarte.luftbild.group";
export const STATIONS_LAYER_NAME = "ch.sbb.netzkarte.stationen";
export const PLATFORMS_LAYER_NAME = "ch.sbb.netzkarte.platforms";
export const STOPO_LANDESKARTE_LAYER_NAME = "ch.sbb.netzkarte.landeskarte";
export const STOPO_LANDESKARTE_GRAU_LAYER_NAME =
  "ch.sbb.netzkarte.landeskarte.grau";
export const NETZKARTE_DARK_LAYER_NAME = "ch.sbb.netzkarte.dark";
export const BAHNHOFPLAENE_LAYER_NAME = "ch.sbb.bahnhofplaene";
export const GESCHOSSE_LAYER_NAME = "ch.sbb.geschosse";
export const INFRASTRUKTUR_LAYER_NAME = "ch.sbb.infrastruktur";
export const STS_OTHER_ROUTES_LAYER_NAME = "Other routes";
export const STS_HIGHLIGHT_ROUTES_LAYER_NAME = "Highlight routes";

// Direktverbindungen
export const DV_KEY = "ch.sbb.direktverbindungen";
export const DV_DAY_NIGHT_REGEX = new RegExp(`^${DV_KEY}.(day|night)$`);
export const DV_HIT_TOLERANCE = getIsMobileDevice() ? 8 : 2;

// STS
export const STS_KEY = "ch.sbb.sts";
export const STS_HIT_TOLERANCE = 15;

// Energieleitungen
export const energieleitungenColorMapping = {
  los1: "#12919a",
  los2: "#da1720",
  los3: "#71c520",
  los4: "#f057b3",
  los5: "#f27211",
  los6: "#1486da",
  los7: "#7346bc",
  los8: "#1abebc",
  los9: "#f9b914",
  los10: "#128939",
  los11: "#a3005b",
  ausserhalb: "black",
};

// Handicap
export const HANDICAP_SOURCE = "stop_places";

// UI
export const OVERLAY_MIN_HEIGHT = 55;

// PDF export
export const FORCE_EXPORT_PROPERTY = "forceVisibilityOnPdf";
export const RAILPLUS_EXPORTBTN_ID = "railplus-export-button";
export const PDF_DOWNLOAD_EVENT_TYPE = "pdf-download-event";
export const LS_SIZE_KEY = "tm.max.canvas.size";

// hideInLayerTree values
export const ONLY_WHEN_NOT_LOGGED_IN = "onlyWhenNotLoggedIn";

// Level layers
export const FLOOR_LEVELS = [-6, -5, -4, -3, -2, -1, 0, "2D", 1, 2, 3, 4, 5, 6];

// Maplibre Source and Layers ids
export const PLATFORMS_POLYGON_HIGHLIGHT_LAYER_ID =
  "platforms_polygon_highlight";
export const PLATFORMS_SOURCE_ID = "platforms";
export const STATIONS_SOURCE_ID = "stations";

// MD_FILTER
export const MapsGeneralClass = "general.class";
export const MapsGeneralSubClass = "general.subclass";
export const MapsGeneralMot = "general.mot";
export const MapsGeneralFloor = "general.floor";
export const MapsGeneralFilter = "general.filter";
export const MapsInfraFilter = "infra.filter";
export const MapsMapsetFilter = "mapset.filter";
export const MapsTrafimageFilter = "trafimage.filter";
export const MapsRoutingFilter = "routing.filter";
export const MapsGeltungsbereicheFilter = "geltungsbereiche.filter";
export const MapsStsFilter = "sts.filter";
export const MapsHandicapFilter = "handicap.filter";
export const MapsEnergieFilter = "energie.filter";
export const MapsRteKlasse = "rte_klasse";
export const MapsIsbFilter = "isb.filter";
export const MapsFeatureFilter = "feature.filter";

// ENum for each class
export const MapsGeneralClassValues = Object.freeze({
  RELIEF: "relief",
  PUBLIC_TRANSPORT: "public_transport",
  PERIMETER_MASK: "perimeter_mask",
  LABEL: "label",
  LANDCOVER: "landcover",
  BORDERS: "borders",
  WATER: "water",
  BUILDINGS: "buildings",
  STREETS: "streets",
  RAILWAYS: "railways",
  ANCILLARY: "ancillary",
  STATION_PLAN: "station_plan",
  POI: "poi",
  STATIONS: "stations",
  LEVEL_GREYOUT: "level_greyout",
  SLOT: "slot",
});

// General subclass types
export const MapsGeneralSubClassValues = Object.freeze({
  GREENS: "greens",
  BUILTUP: "builtup",
  NATIONAL: "national",
  AREAS: "areas",
  TUNNEL: "tunnel",
  BRIDGE: "bridge",
  ROOMS: "rooms",
  PLATFORMS: "platforms",
  ACCESS: "access",
  STEPS: "steps",
  TRACK_NUMBERS: "track_numbers",
  STOP_POSITION: "stop_position",
  PARKS: "parks",
  PLACE_NAMES: "place_names",
  WATER: "water",
  ANCILLARY: "ancillary",
  STATIONS: "stations",
  ROUTING_EUROPE: "routing_europe",
  ROUTING_DACH: "routing_dach",
  JOURNEY: "journey",
  EU: "eu",
  CONSTRUCTION: "construction",
  CORRIDORS: "corridors",
  SECTORS: "sectors",
  BORDER: "border",
  MUNICIPAL: "municipal",
  GRAVEL: "gravel",
  STREETS: "streets",
});

// General mot (mode of transport)
export const MapsGeneralMotValues = Object.freeze({
  RAIL: "rail",
  TRAM: "tram",
  SUBWAY: "subway",
  BUS: "bus",
  FERRY: "ferry",
  CABLEWAY: "cableway",
  MIXED: "mixed",
});

// General floor
export const MapsGeneralFloorValues = Object.freeze({
  "2D": "2D",
  LEVEL: "level",
  LEVEL_GREYOUT: "level_greyout",
});

// General filter
export const MapsGeneralFilterValues = Object.freeze({
  BORDER_CANTON_GREEN: "border.canton.green",
  BORDER_CANTON_GREY: "border.canton.grey",
  BORDER_MUNICIPALITY_GREEN: "border.municipality.green",
  BORDER_MUNICIPALITY_GREY: "border.municipality.grey",
  BORDER_NATIONAL: "border.national",
  OPERATIONAL_REGIONS: "operational_regions",
  STATION: "station",
  STATIONS: "stations",
  TRACK: "track",
  WATERS: "waters",
});

// Infra filter
export const MapsInfraFilterValues = Object.freeze({
  KTU: "ktu",
  SBB: "sbb",
});

// Energie filter
export const MapsEnergieFilterValues = Object.freeze({
  ANLAGEN_UW_ICON: "anlagen.uw.icon",
  ANLAGEN_UW_LABEL: "anlagen.uw.label",
  LEITUNG: "leitung",
  LEITUNG_HOVER: "leitung.hover",
  LEITUNG_LABEL: "leitung.label",
  LEITUNG_LABEL_LC: "leitung.label.lc",
  LEITUNG_SELECT: "leitung.select",
});

// RTE Klasse
export const MapsRteKlasseValues = Object.freeze({
  KLASSE_1: "1",
  KLASSE_2A: "2a",
  KLASSE_2B: "2b",
  KLASSE_3: "3",
  KLASSE_4: "4",
});

// ISB filter
export const MapsIsbFilterValues = Object.freeze({
  OTHER: "other",
  OTHER_HIGHLIGHT: "other.highlight",
  OTHER_SELECT: "other.select",
  OTHER_FLAG: "other_flag",
  SCHMALSPUR_FLAG: "schmalspur_flag",
  SCHMALSPUR_LINE: "schmalspur_line",
  SCHMALSPUR_LINE_HIGHLIGHT: "schmalspur_line.highlight",
  SCHMALSPUR_STATIONEN: "schmalspur_stationen",
  TVS: "tvs",
  TVS_HIGHLIGHT: "tvs.highlight",
  TVS_SELECT: "tvs.select",
  TVS_FLAG: "tvs_flag",
});

// Feature filter
export const MapsFeatureFilterValues = Object.freeze({
  STATIONS: "stations",
});

// Mapset filter
export const MapsMapsetFilterValues = Object.freeze({
  MAPSET_GREENAREAS: "mapset_greenareas",
  MAPSET_STREET_NAMES: "mapset_street_names",
  MAPSET_WATER: "mapset_water",
  MAPSET_PLACE: "mapset_place",
  MAPSET_STATION_PLAN: "mapset_station_plan",
  MAPSET_POI: "mapset_poi",
  MAPSET_STOP_POSITION: "mapset_stop_position",
  MAPSET_HIGHLIGHT_BUS: "mapset_highlight_bus",
  MAPSET_STATIONS: "mapset_stations",
  MAPSET_UNDERGROUND: "mapset_underground",
  MAPSET_TUNNEL_LABELS: "mapset_tunnel_labels",
  NORMAL_STREETS: "normal_streets",
  PATH: "path",
  MAPSET_STATION_PANELS: "mapset_station_panels",
});

// Trafimage filter
export const MapsTrafimageFilterValues = Object.freeze({
  MUNICIPALITY_BORDERS: "municipality_borders",
  BUS: "bus",
  INTERAKTIV: "interaktiv",
  PRINTPRODUKTE: "printprodukte",
  STATIONS: "stations",
  PLATFORMS: "platforms",
  PASSAGIER_FREQ: "passagier_freq",
  SWISSIMAGE: "swissimage",
  PIXELKARTE_GRAU: "pixelkarte_grau",
  PIXELKARTE_FARBE: "pixelkarte_farbe",

  // From geltungsbereiche style
  TRACKS: "tracks",
  IPV_ALL: "ipv_all",
  IPV_CALL_ALL: "ipv_call_all",
  IPV_CALL_EDGE_ALL: "ipv_call_edge_all",
  IPV_CALL_FULL_ALL: "ipv_call_full_all",
  IPV_SELECTED_STATION_ALL: "ipv_selected_station_all",
  IPV_NIGHT: "ipv_night",
  IPV_CALL_NIGHT: "ipv_call_night",
  IPV_CALL_EDGE_NIGHT: "ipv_call_edge_night",
  IPV_CALL_FULL_NIGHT: "ipv_call_full_night",
  IPV_SELECTED_STATION_NIGHT: "ipv_selected_station_night",
  IPV_DAY: "ipv_day",
  IPV_CALL_DAY: "ipv_call_day",
  IPV_CALL_EDGE_DAY: "ipv_call_edge_day",
  IPV_CALL_FULL_DAY: "ipv_call_full_day",
  IPV_SELECTED_STATION_DAY: "ipv_selected_station_day",

  // From zweitausbildung style
  STATIONS_AUFBAU_NOT_BORDER: "stations.aufbau.not.border",
  STATIONS_AUFBAU_BORDER: "stations.aufbau.border",
  STATIONS_BASIS_NOT_BORDER: "stations.basis.not.border",
  STATIONS_BASIS_BORDER: "stations.basis.border",
  CLUSTERS_NO_RAILAWAY: "clusters.no_railaway",
  CLUSTERS_NO_RAILAWAY_NUMBER: "clusters.no_railaway.number",
  NOCLUSTERS_NO_RAILAWAY: "noclusters.no_railaway",
  CLUSTERS_RAILAWAY: "clusters.railaway",
  CLUSTERS_RAILAWAY_NUMBER: "clusters.railaway.number",
  NOCLUSTERS_RAILAWAY: "noclusters.railaway",
  CLUSTERS: "clusters",
  CLUSTERS_NUMBER: "clusters.number",
  NOCLUSTERS: "noclusters",
  POIS: "pois",

  // From funkmesswagen style
  FUNKMESSWAGEN_PHOTOS: "funkmesswagen.photos",
});

// Routing filter
export const MapsRoutingFilterValues = Object.freeze({
  PERIMETER_MASK_ROUTING_EUROPE: "perimeter_mask_routing_europe",
  PERIMETER_MASK_ROUTING_DACH: "perimeter_mask_routing_dach",
});

// Handicap filters
export const MapsHandicapFilterValues = Object.freeze({
  SYMBOL_STATUSUNBEKANNT: "symbol.statusunbekannt",
  SYMBOL_SHUTTLE: "symbol.shuttle",
  SYMBOL_NICHTBARRIEREFREI: "symbol.nichtbarrierefrei",
  SYMBOL_TEILBARRIEREFREI: "symbol.teilbarrierefrei",
  SYMBOL_BARRIEREFREI: "symbol.barrierefrei",
  SYMBOL_STATUSUNBEKANNT_LABEL: "symbol.statusunbekannt.label",
  SYMBOL_SHUTTLE_LABEL: "symbol.shuttle.label",
  SYMBOL_NICHTBARRIEREFREI_LABEL: "symbol.nichtbarrierefrei.label",
  SYMBOL_TEILBARRIEREFREI_LABEL: "symbol.teilbarrierefrei.label",
  SYMBOL_BARRIEREFREI_LABEL: "symbol.barrierefrei.label",
});

// Geltungsbereiche filters
export const MapsGeltungsbereicheFilterValues = Object.freeze({
  STS_LINE: "sts.line",
  AT_LINE: "at.line",
  HTA_LINE: "hta.line",
  TK_LINE: "tk.line",
  GA_LINE: "ga.line",
});

// Sts  filters
export const MapsStsFilterValues = Object.freeze({
  STS_HIGHLIGHT: "sts_highlight",
  STS_GTTOS: "sts_gttos",
  STS_OTHERS: "sts_others",
  STS_PREMIUM: "sts_premium",
});
