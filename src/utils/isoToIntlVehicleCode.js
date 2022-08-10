// This file contains the logic to get an international vehicle registration code (D) from an ISO country code (DE)
// List comes from https://de.wikipedia.org/wiki/Liste_der_Kfz-Nationalit%C3%A4tszeichen
const isoCountryCode = [
  'AT',
  'AF',
  'AG',
  'AL',
  'AD',
  'AO',
  'AM',
  'AW',
  'AU',
  'AX',
  'AI',
  'AZ',
  'BE',
  'BD',
  'BB',
  'BF',
  'BG',
  'BT',
  'BA',
  'BJ',
  'BO',
  'BR',
  'BH',
  'BN',
  'BS',
  'VG',
  'BW',
  'BY',
  'BZ',
  'CU',
  'CM',
  'CA',
  'CD',
  'CH',
  'CN',
  'CI',
  'LK',
  'CO',
  'KM',
  'CR',
  'CV',
  'CY',
  'CZ',
  'DE',
  'DJ',
  'DK',
  'DO',
  'DZ',
  'ES',
  'KE',
  'TZ',
  'UG',
  'EC',
  'ER',
  'SV',
  'EE',
  'EG',
  'ET',
  'FR',
  'FI',
  'FJ',
  'LI',
  'FO',
  'FM',
  'GA',
  'GG',
  'GG',
  'JE',
  'IM',
  'GI',
  'GT',
  'GE',
  'GH',
  'GQ',
  'GR',
  'GW',
  'GN',
  'GY',
  'HU',
  'HK',
  'HN',
  'HR',
  'IT',
  'IL',
  'IN',
  'IR',
  'IE',
  'IQ',
  'IS',
  'JP',
  'JM',
  'JO',
  'KH',
  'KN',
  'KG',
  'KI',
  'GL',
  'KP',
  'SA',
  'KW',
  'KZ',
  'LU',
  'LA',
  'LY',
  'LR',
  'LS',
  'LT',
  'LV',
  'MT',
  'MA',
  'MY',
  'MC',
  'MD',
  'MX',
  'MN',
  'MH',
  'ME',
  'MZ',
  'MU',
  'MV',
  'MW',
  'MM',
  'NO',
  'AN',
  'NA',
  'NR',
  'NC',
  'NP',
  'NG',
  'NI',
  'NL',
  'MK',
  'NZ',
  'OM',
  'PT',
  'PA',
  'PW',
  'PE',
  'PK',
  'PL',
  'PG',
  'PR',
  'PY',
  'QA',
  'AR',
  'BW',
  'TW',
  'CF',
  'CG',
  'CL',
  'GN',
  'HT',
  'ID',
  'MR',
  'XK',
  'LB',
  'MG',
  'ML',
  'NE',
  'RO',
  'KR',
  'UY',
  'PH',
  'SM',
  'TG',
  'BI',
  'RU',
  'RW',
  'SE',
  'SZ',
  'SG',
  'SK',
  'SL',
  'SI',
  'SR',
  'MT',
  'SN',
  'SO',
  'SB',
  'RS',
  'SS',
  'ST',
  'SD',
  'SC',
  'SY',
  'TH',
  'TD',
  'TG',
  'TJ',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'UA',
  'AE',
  'GB',
  'US',
  'UZ',
  'VA',
  'VU',
  'VG',
  'VN',
  'GM',
  'SL',
  'PS',
  'DM',
  'GD',
  'LC',
  'WS',
  'EH',
  'VC',
  'YE',
  'VE',
  'ZM',
  'ZA',
  'ZW',
];

const intlVehicleCode = [
  'A',
  'AFG',
  'AG',
  'AL',
  'AND',
  'ANG',
  'AM',
  'ARU',
  'AUS',
  'AX',
  'AXA',
  'AZ',
  'B',
  'BD',
  'BDS',
  'BF',
  'BG',
  'BHT',
  'BIH',
  'BJ',
  'BOL',
  'BR',
  'BRN',
  'BRU',
  'BS',
  'BVI',
  'BW',
  'BY',
  'BZ',
  'C',
  'CAM',
  'CDN',
  'CGO',
  'CH',
  'CHN',
  'CI',
  'CL',
  'CO',
  'COM',
  'CR',
  'CV',
  'CY',
  'CZ',
  'D',
  'DJI',
  'DK',
  'DOM',
  'DZ',
  'E',
  'EAK',
  'EAT',
  'EAU',
  'EC',
  'ER',
  'ES',
  'EST',
  'ET',
  'ETH',
  'F',
  'FIN',
  'FJI',
  'FL',
  'FO',
  'FSM',
  'G',
  'GBA',
  'GBG',
  'GBJ',
  'GBM',
  'GBZ',
  'GCA + GT',
  'GE',
  'GH',
  'GQ',
  'GR',
  'GUB',
  'GUI',
  'GUY',
  'H',
  'HK',
  'HN',
  'HR',
  'I',
  'IL',
  'IND',
  'IR',
  'IRL',
  'IRQ',
  'IS',
  'J',
  'JA',
  'JOR',
  'K',
  'KAN',
  'KG',
  'KIR',
  'KN',
  'KP',
  'KSA',
  'KWT',
  'KZ',
  'L',
  'LAO',
  'LAR',
  'LB',
  'LS',
  'LT',
  'LV',
  'M',
  'MA',
  'MAL',
  'MC',
  'MD',
  'MEX',
  'MNG',
  'MH',
  'MNE',
  'MOC',
  'MS',
  'MV',
  'MW',
  'MYA',
  'N',
  'NA',
  'NAM',
  'NAU',
  'NCL',
  'NEP',
  'NGR',
  'NI',
  'NIC',
  'NL',
  'NMK',
  'NZ',
  'OM',
  'P',
  'PA',
  'PAL',
  'PE',
  'PK',
  'PL',
  'PMR',
  'PNG',
  'PRI',
  'PY',
  'Q',
  'RA',
  'RB',
  'RC',
  'RCA',
  'RCB',
  'RCH',
  'RG',
  'RH',
  'RI',
  'RIM',
  'RKS',
  'RL',
  'RM',
  'RMM',
  'RN',
  'RO',
  'ROK',
  'ROU',
  'RP',
  'RSM',
  'RT',
  'RU',
  'RUS',
  'RWA',
  'S',
  'SD',
  'SGP',
  'SK',
  'SLE',
  'SLO',
  'SME',
  'S.M.O.M.',
  'SN',
  'SO',
  'SOL',
  'SRB',
  'SSD',
  'STP',
  'SUD',
  'SY',
  'SYR',
  'T',
  'TD',
  'TG',
  'TJ',
  'TL',
  'TM',
  'TN',
  'TON',
  'TR',
  'TT',
  'TUV',
  'UA',
  'UAE',
  'UK',
  'USA',
  'UZ',
  'V',
  'VAN',
  'VG',
  'VN',
  'WAG',
  'WAL',
  'WB',
  'WD',
  'WG',
  'WL',
  'WS',
  'WSA',
  'WV',
  'YEM',
  'YV',
  'Z',
  'ZA',
  'ZW',
];

const isoToIntlVehicleCode = (countryCode) => {
  const index = isoCountryCode.indexOf(countryCode);
  return intlVehicleCode[index] || countryCode;
};
export default isoToIntlVehicleCode;
