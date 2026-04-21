// Completed with Anthropic Sonnet 4.6
// ==== Country code to Continent mapping ====
const countryToContinent = {
    // Europe
    ALB: "Europe", AND: "Europe", ARM: "Europe", AUT: "Europe", AZE: "Europe",
    BEL: "Europe", BIH: "Europe", BUL: "Europe", CRO: "Europe", CYP: "Europe",
    CZE: "Europe", DEN: "Europe", ESP: "Europe", EST: "Europe", FIN: "Europe",
    FRA: "Europe", GBR: "Europe", GEO: "Europe", GER: "Europe", GRE: "Europe",
    HUN: "Europe", IRL: "Europe", ISL: "Europe", ISR: "Europe", ITA: "Europe",
    KOS: "Europe", LAT: "Europe", LIE: "Europe", LTU: "Europe", LUX: "Europe",
    MDA: "Europe", MKD: "Europe", MLT: "Europe", MNE: "Europe", MON: "Europe",
    NED: "Europe", NOR: "Europe", POL: "Europe", POR: "Europe", ROU: "Europe",
    SLO: "Europe", SMR: "Europe", SRB: "Europe", SUI: "Europe", SVK: "Europe",
    SWE: "Europe", TUR: "Europe", UKR: "Europe",
    // Americas
    ARG: "Americas", BOL: "Americas", BRA: "Americas", CAN: "Americas",
    CHI: "Americas", COL: "Americas", ECU: "Americas", HAI: "Americas",
    JAM: "Americas", MEX: "Americas", PUR: "Americas", TTO: "Americas",
    URU: "Americas", USA: "Americas", VEN: "Americas",
    // Asia
    CHN: "Asia", HKG: "Asia", IND: "Asia", IRI: "Asia", JPN: "Asia",
    KAZ: "Asia", KGZ: "Asia", KOR: "Asia", KSA: "Asia", LBN: "Asia",
    MAS: "Asia", MGL: "Asia", PAK: "Asia", PHI: "Asia", SGP: "Asia",
    THA: "Asia", TPE: "Asia", UAE: "Asia", UZB: "Asia",
    // Africa
    BEN: "Africa", ERI: "Africa", KEN: "Africa", MAD: "Africa",
    MAR: "Africa", NGR: "Africa", RSA: "Africa", GBS: "Africa",
    // Oceania
    AUS: "Oceania", NZL: "Oceania",
    // Neutral
    AIN: "Neutral",
};

const continents = ["Europe", "Americas", "Asia", "Africa", "Oceania", "Neutral"];