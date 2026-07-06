const MAPPING = {
  BRA: "br",
  ARG: "ar",
  USA: "us",
  ENG: "gb-eng",
  WAL: "gb-wls",
  RSA: "za",
  KOR: "kr",
  IRN: "ir",
  SUI: "ch",
  CZE: "cz",
  GER: "de",
  JPN: "jp",
  POR: "pt",
  ESP: "es",
  FRA: "fr",
  BEL: "be",
  CRO: "hr",
  MAR: "ma",
  SEN: "sn",
  CAN: "ca",
  MEX: "mx",
  POL: "pl",
  DEN: "dk",
  AUS: "au",
  PER: "pe",
  ECU: "ec",
  CRC: "cr",
  NZL: "nz",
  ITA: "it",
  COL: "co",
  ALG: "dz",
  UKR: "ua",
  NED: "nl",
  CHI: "cl",
  NGA: "ng",
  SWE: "se",
  EGY: "eg",
  AUT: "at",
  TUR: "tr",
  JAM: "jm",
  NOR: "no",
  SRB: "rs",
  CMR: "cm",
  PAN: "pa",
  URU: "uy",
  GHA: "gh",
  TUN: "tn",
  KSA: "sa"
};

export const getFlagUrl = (code) => {
  if (!code) return "https://flagcdn.com/24x18/un.png";
  const iso = MAPPING[code.toUpperCase()];
  if (!iso) {
    return "https://flagcdn.com/24x18/un.png"; // Fallback to UN flag
  }
  return `https://flagcdn.com/24x18/${iso}.png`;
};
