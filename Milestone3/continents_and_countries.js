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

// ==== Country code to Country mapping ====
const countryCodeToName = {
    // Europe
    ALB: "Albania", AND: "Andorra", ARM: "Armenia", AUT: "Austria", AZE: "Azerbaijan",
    BEL: "Belgium", BIH: "Bosnia and Herzegovina", BUL: "Bulgaria", CRO: "Croatia", CYP: "Cyprus",
    CZE: "Czech Republic", DEN: "Denmark", ESP: "Spain", EST: "Estonia", FIN: "Finland",
    FRA: "France", GBR: "Great Britain", GEO: "Georgia", GER: "Germany", GRE: "Greece",
    HUN: "Hungary", IRL: "Ireland", ISL: "Iceland", ISR: "Israel", ITA: "Italy",
    KOS: "Kosovo", LAT: "Latvia", LIE: "Liechtenstein", LTU: "Lithuania", LUX: "Luxembourg",
    MDA: "Moldova", MKD: "North Macedonia", MLT: "Malta", MNE: "Montenegro", MON: "Monaco",
    NED: "Netherlands", NOR: "Norway", POL: "Poland", POR: "Portugal", ROU: "Romania",
    SLO: "Slovenia", SMR: "San Marino", SRB: "Serbia", SUI: "Switzerland", SVK: "Slovakia",
    SWE: "Sweden", TUR: "Turkey", UKR: "Ukraine",
    // Americas
    ARG: "Argentina", BOL: "Bolivia", BRA: "Brazil", CAN: "Canada",
    CHI: "Chile", COL: "Colombia", ECU: "Ecuador", HAI: "Haiti",
    JAM: "Jamaica", MEX: "Mexico", PUR: "Puerto Rico", TTO: "Trinidad and Tobago",
    URU: "Uruguay", USA: "United States", VEN: "Venezuela",
    // Asia
    CHN: "China", HKG: "Hong Kong", IND: "India", IRI: "Iran", JPN: "Japan",
    KAZ: "Kazakhstan", KGZ: "Kyrgyzstan", KOR: "South Korea", KSA: "Saudi Arabia", LBN: "Lebanon",
    MAS: "Malaysia", MGL: "Mongolia", PAK: "Pakistan", PHI: "Philippines", SGP: "Singapore",
    THA: "Thailand", TPE: "Chinese Taipei", UAE: "United Arab Emirates", UZB: "Uzbekistan",
    // Africa
    BEN: "Benin", ERI: "Eritrea", KEN: "Kenya", MAD: "Madagascar",
    MAR: "Morocco", NGR: "Nigeria", RSA: "South Africa", GBS: "Guinea-Bissau",
    // Oceania
    AUS: "Australia", NZL: "New Zealand",
    // Neutral
    AIN: "Individual Neutral Athletes",
};

function getCodeFromCountryName(countryName) {
    return Object.keys(countryCodeToName).find(
        code => countryCodeToName[code] === countryName
    );
}