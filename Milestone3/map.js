// Acknowledgment: https://leafletjs.com/, https://d3js.org/
// Used Google Maps to identify GPS coordinates
// Use of Claude Haiku 4.5 for some code modulation to avoid repetition

// === Rounded Discipline Icon ===
// Required as cannot be done in CSS directly
function roundedDisciplineIcon(disciplineName, size, anchor) {
    return L.divIcon({
        className: '',
        html: `<img src="../ExtraRessources/Disciplines/${disciplineName}.png" 
                style="width:${size[0]}px; height:${size[1]}px; 
                    border-radius: 4px;">`,
        iconSize: size,
        iconAnchor: anchor
    });
}

// === Map Initialization ===
// Leaflet map linked to id="venue-map" in index.html. setView([lat, lng], zoomLevel) sets the initial view of the map.
var map = L.map('venue-map').setView([45.850799, 10.664303], 8);

// Add tiles to map
// Other pick for tiles: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
// attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// === Venues Manual Data ===
// Data to be added to the CSV information
const additionalData = [
    { name: "Antholz Antersevla Biathlon Arena", coords: [46.89978344698612, 12.154818897754511], image: "AntholzAnterselvaBiathlonArena.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/anterselva-biathlon-arena" },
    { name: "Cortina Curling Olympic Stadium", coords: [46.54392264763853, 12.133486358679093], image: "CortinaCurlingOlympicStadium.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/cortina-curling-olympic-stadium" },
    { name: "Cortina Sliding Centre", coords: [46.54604390906742, 12.127073084150148], image: "CortinaSlidingCentre.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/cortina-sliding-centre" },
    { name: "Livigno Aerials & Moguls Park", coords: [46.52711584722091, 10.156618695692748], image: "LivignoAerials&MogulsPark.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/livigno-aerials-moguls-park" },
    { name: "Livigno Snow Park", coords: [46.52030277180839, 10.156080263559932], image: "LivignoSnowPark.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/livigno-snow-park" },
    { name: "Milano Ice Skating Arena", coords: [45.40156275065069, 9.142319961258863], image: "MilanoIceSkatingArena.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/milano-ice-skating-arena" },
    { name: "Milano San Siro Olympic Stadium", coords: [45.478018233365816, 9.123853306861502], image: "MilanoSanSiroOlympicStadium.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/milano-san-siro-olympic-stadium" },
    { name: "Milano Santagiulia Ice Hockey Arena", coords: [45.44146491547319, 9.254797454093541], image: "MilanoSantagiuliaIceHockeyArena.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/milano-santagiulia-ice-hockey-arena" },
    { name: "Milano Speed Skating Stadium", coords: [45.518432404275856, 9.085218217152695], image: "MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/milano-speed-skating-stadium" },
    { name: "Milano Rho Ice Hockey Arena", coords: [45.521909396135854, 9.072673103873448], image: "MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/milano-rho-ice-hockey-arena" },
    { name: "Predazzo Ski Jumping Stadium", coords: [46.32808004838116, 11.601220322821835], image: "PredazzoSkiJumpingStadium.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/predazzo-ski-jumping-stadium" },
    { name: "Stelvio Ski Centre", coords: [46.450283657829196, 10.384446715739985], image: "StelvioSkiCentre.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/stelvio-ski-centre" },
    { name: "Tesero Cross-Country Skiing Stadium", coords: [46.28263384762345, 11.523868284140212], image: "TeseroCross-CountrySkiingStadium.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/tesero-cross-country-skiing-stadium" },
    { name: "Tofane Alpine Skiing Centre", coords: [46.535066186820735, 12.121624673178943], image: "TofaneAlpineSkiingCentre.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/tofane-alpine-skiing-centre" },
    { name: "Verona Olympic Arena", coords: [45.438848940007134, 10.994207524175199], image: "VeronaOlympicArena.png", url: "https://www.olympics.com/en/milano-cortina-2026/venues/verona-olympic-arena" }
];

// === Access + Complete CSV data & Generate markers ===
var venuesData = [];

var markers = [];

var initialIconWidth = 96
var initialIconHeight = 60
var initialPopupAnchor = [0, -initialIconHeight/2]

d3.csv("../DataPreprocessing/venues.csv").then(data => {
    // == Complete CSV data ==
    venuesData = data.map((row, index) => {
        const{venue, ...rest} = row; // Extract the 'venue' property
        return {
            ...rest,                              // Copies all existing properties from the CSV row
            name: venue,                     // Rename 'venue' to 'venueName'
            coords: additionalData[index].coords,    // Adds coordinates
            image: additionalData[index].image,       // Adds image
            url: additionalData[index].url          // Adds URL
        };
    });

    // == Create markers with hovering ==
    markers = venuesData.map(venue => {
        // = Place markers =
        // Need to move it here to avoid race condition where creating markers before the data is loaded
        // Generate initial icon
        const icon = L.icon({
            iconUrl: '../ExtraRessources/Venues/' + venue.image,
            iconSize: [initialIconWidth, initialIconHeight],
            popupAnchor: initialPopupAnchor
        });
        
        // Place marker
        const marker = L.marker(venue.coords, { icon: icon })
            .addTo(map)
            .bindPopup(venue.name);

        // = Hovering =
        // Hovering flag
        marker.isHovering = false;
        showDisciplines = true;
        marker.disciplinesList = [];
        marker.disciplineURL = [];

        // = Discipline sub markers =
        // Need to convert string into list for length computation + links
        try {
            marker.disciplinesList = JSON.parse(venue.disciplines);
        } catch(e) {
            // To handle single + empty discipline case
            marker.disciplinesList = venue.disciplines === '' ? [] : [venue.disciplines];
        }

        try {
            // Convert single quotes to double quotes for valid JSON
            let cleanedJSON = venue.url_sport.replace(/'/g, '"');
            marker.disciplineURL = JSON.parse(cleanedJSON);
        } catch(e) {
            marker.disciplineURL = venue.url_sport === '' ? [] : [venue.url_sport];
        }


        // Rename discipline to match image names
        marker.disciplinesList = marker.disciplinesList.map(discipline => {
            const name = discipline.replace('discipline-', ''); // Extract the discipline name after the hyphen e.g. discipline-curling => curling
            return name.charAt(0).toUpperCase() + name.slice(1);  // Cap on first letter to match image e.g curling => Curling
            }
        )

        // Hovering event listeners
            // Hovering on
        marker.on('mouseover', function() {
            marker.isHovering = true;
            marker.setIcon(L.icon({
                iconUrl: '../ExtraRessources/Venues/' + venue.image,
                iconSize: setIconSizeHover(map.getZoom()),
                popupAnchor: setPopupAnchorHover(map.getZoom())
            }));
        });
        
            // Hovering off
        marker.on('mouseout', function() {
            marker.isHovering = false;
            marker.setIcon(L.icon({
                iconUrl: '../ExtraRessources/Venues/' + venue.image,
                iconSize: setIconSize(map.getZoom()),
                popupAnchor: setPopupAnchor(map.getZoom())
            }));
        });

        // Access link by double click (Official Website deleted such pages)
        // marker.on('dblclick', function() {
        //     window.open(venue.url, '_blank');
        // });

        const badge = document.getElementById('badge-discipline-input')

        // Show/Hide disciplines on click
        marker.on('click', function() {
            // Delete previous discipline markers
            markers.forEach(marker => {
                if (marker.disciplineMarker11) map.removeLayer(marker.disciplineMarker11);
                if (marker.disciplineMarker21) map.removeLayer(marker.disciplineMarker21);
                if (marker.disciplineMarker22) map.removeLayer(marker.disciplineMarker22);
                if (marker.disciplineMarker31) map.removeLayer(marker.disciplineMarker31);
                if (marker.disciplineMarker32) map.removeLayer(marker.disciplineMarker32);
                if (marker.disciplineMarker33) map.removeLayer(marker.disciplineMarker33);

            });

            // Showcase current discipline markers
            switch(marker.disciplinesList.length) {
                case 0: break;

                case 1:  {//Show 1 discipline 
                    const markerSize = setIconSizeHover(map.getZoom());
                    marker.disciplineMarker11 = L.marker(
                        venue.coords,
                        {
                            icon: roundedDisciplineIcon(
                                marker.disciplinesList[0],
                                [markerSize[0]*(3/4), markerSize[1]*(3/4)],
                                [(3/8) * markerSize[0], -(3/4) * markerSize[1]]
                            )
                        }
                    ).addTo(map);
                    marker.disciplineMarker11.disciplineName = marker.disciplinesList[0];

                    // Redirect to link
                    marker.disciplineMarker11.on('dblclick', function() {
                        const disciplineName = marker.disciplinesList[0];
                        window.open(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`, '_blank');
                        console.log(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`);
                    });

                    marker.disciplineMarker11.on('click', function() {
                        const disciplineName = marker.disciplinesList[0];
                        const disciplineURL = marker.disciplineURL[0];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.value = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                        renderEventChart(cleanDisciplineName);
                    });
                    break;
                }

                case 2:  {// Show 2 disciplines
                    const markerSize = setIconSizeHover(map.getZoom());
                    marker.disciplineMarker21 = L.marker(
                        venue.coords,
                        {
                            icon: roundedDisciplineIcon(
                                marker.disciplinesList[0],
                                [markerSize[0]*(3/4), markerSize[1]*(3/4)],
                                [(7/8) * markerSize[0], -(3/4) * markerSize[1]]
                            )
                        }
                    ).addTo(map);
                    marker.disciplineMarker21.disciplineName = marker.disciplinesList[0];

                    marker.disciplineMarker22 = L.marker(
                        venue.coords,
                        {
                            icon: roundedDisciplineIcon(
                                marker.disciplinesList[1],
                                [markerSize[0]*(3/4), markerSize[1]*(3/4)],
                                [(-1/8) * markerSize[0], -(3/4) * markerSize[1]]
                            )
                        }
                    ).addTo(map);
                    marker.disciplineMarker22.disciplineName = marker.disciplinesList[1];

                    // Redirect to link
                    marker.disciplineMarker21.on('dblclick', function() {
                        const disciplineName = marker.disciplinesList[0];
                        window.open(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`, '_blank');
                    });
                    marker.disciplineMarker22.on('dblclick', function() {
                        const disciplineName = marker.disciplinesList[1];
                        window.open(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`, '_blank');
                    });

                    marker.disciplineMarker21.on('click', function() {
                        const disciplineName = marker.disciplinesList[0];
                        const disciplineURL = marker.disciplineURL[0];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.value = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                        renderEventChart(cleanDisciplineName);
                    });
                    marker.disciplineMarker22.on('click', function() {
                        const disciplineName = marker.disciplinesList[1];
                        const disciplineURL = marker.disciplineURL[1];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[1] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.value = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                        renderEventChart(cleanDisciplineName);
                    });

                    break;
                }

                case 3:  {// Show 3 disciplines
                    const markerSize = setIconSizeHover(map.getZoom());
                    marker.disciplineMarker31 = L.marker(
                        venue.coords,
                        {
                            icon: roundedDisciplineIcon(
                                marker.disciplinesList[0],
                                [markerSize[0]*(3/4), markerSize[1]*(3/4)],
                                [(10/8) * markerSize[0], -(3/4) * markerSize[1]]
                            )
                        }
                    ).addTo(map);
                    marker.disciplineMarker31.disciplineName = marker.disciplinesList[0];

                    marker.disciplineMarker32 = L.marker(
                        venue.coords,
                        {
                            icon: roundedDisciplineIcon(
                                marker.disciplinesList[1],
                                [markerSize[0]*(3/4), markerSize[1]*(3/4)],
                                [(3/8) * markerSize[0], -(3/4) * markerSize[1]]
                            )
                        }
                    ).addTo(map);
                    marker.disciplineMarker32.disciplineName = marker.disciplinesList[1];

                    marker.disciplineMarker33 = L.marker(
                        venue.coords,
                        {
                            icon: roundedDisciplineIcon(
                                marker.disciplinesList[2],
                                [markerSize[0]*(3/4), markerSize[1]*(3/4)],
                                [(-4/8) * markerSize[0], -(3/4) * markerSize[1]]
                            )
                        }
                    ).addTo(map);
                    marker.disciplineMarker33.disciplineName = marker.disciplinesList[2];

                    // Redirect to link
                    marker.disciplineMarker31.on('dblclick', function() {
                        const disciplineName = marker.disciplinesList[0];
                        window.open(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`, '_blank');
                    });
                    marker.disciplineMarker32.on('dblclick', function() {
                        const disciplineName = marker.disciplinesList[1];
                        window.open(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`, '_blank');
                    });
                    marker.disciplineMarker33.on('dblclick', function() {
                        const disciplineName = marker.disciplinesList[2];
                        window.open(`https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`, '_blank');
                    });

                    marker.disciplineMarker31.on('click', function() {
                        const disciplineName = marker.disciplinesList[0];
                        const disciplineURL = marker.disciplineURL[0];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.value = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                        renderEventChart(cleanDisciplineName);
                    });
                    marker.disciplineMarker32.on('click', function() {
                        const disciplineName = marker.disciplinesList[1];
                        const disciplineURL = marker.disciplineURL[1];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[1] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.value = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                        renderEventChart(cleanDisciplineName);
                    });
                    marker.disciplineMarker33.on('click', function() {
                        const disciplineName = marker.disciplinesList[2];
                        const disciplineURL = marker.disciplineURL[2];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[2] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.value = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                        renderEventChart(cleanDisciplineName);                        
                    });

                    break;
                }
            }
        });
        return marker;
    });
});

// === Event functions ===
// Adapt icon size to zoom level
// [0;19] with 0 being whole world
function setIconSize(zoomLevel) {
    return [(zoomLevel * 12),(zoomLevel * 7.5)];
}

function setIconSizeHover(zoomLevel) {
    return [(zoomLevel * 14),(zoomLevel * 8.75)];
}

function setPopupAnchor(zoomLevel) {
    var iconSize = setIconSize(zoomLevel);
    var iconHeight = iconSize[1];
    return [0, -(iconHeight/2)]; 
}

function setPopupAnchorHover(zoomLevel) {
    var iconSize = setIconSizeHover(zoomLevel);
    var iconHeight = iconSize[1];
    return [0, -(iconHeight / 2)];
}

function updateDisciplineMarkersZoom(marker) {
    const markerSize = setIconSizeHover(map.getZoom());
    
    if (marker.disciplineMarker11) {
        marker.disciplineMarker11.setIcon(roundedDisciplineIcon(
            marker.disciplineMarker11.disciplineName,
            [markerSize[0]*(3/4), markerSize[1]*(3/4)],
            [(3/8) * markerSize[0], -(3/4) * markerSize[1]]
        ));
    }

    if (marker.disciplineMarker21){
        marker.disciplineMarker21.setIcon(roundedDisciplineIcon(
            marker.disciplineMarker21.disciplineName,
            [markerSize[0]*(3/4), markerSize[1]*(3/4)],
            [(7/8) * markerSize[0], -(3/4) * markerSize[1]]
        ));
        marker.disciplineMarker22.setIcon(roundedDisciplineIcon(
            marker.disciplineMarker22.disciplineName,
            [markerSize[0]*(3/4), markerSize[1]*(3/4)],
            [(-1/8) * markerSize[0], -(3/4) * markerSize[1]]
        ));
    }

    if (marker.disciplineMarker31){
        marker.disciplineMarker31.setIcon(roundedDisciplineIcon(
            marker.disciplineMarker31.disciplineName,
            [markerSize[0]*(3/4), markerSize[1]*(3/4)],
            [(10/8) * markerSize[0], -(3/4) * markerSize[1]]
        ));
        marker.disciplineMarker32.setIcon(roundedDisciplineIcon(
            marker.disciplineMarker32.disciplineName,
            [markerSize[0]*(3/4), markerSize[1]*(3/4)],
            [(3/8) * markerSize[0], -(3/4) * markerSize[1]]
        ));
        marker.disciplineMarker33.setIcon(roundedDisciplineIcon(
            marker.disciplineMarker33.disciplineName,
            [markerSize[0]*(3/4), markerSize[1]*(3/4)],
            [(-4/8) * markerSize[0], -(3/4) * markerSize[1]]
        ));
    }
}


// === Zoom Event Handler ===
map.on('zoom', function() {
    markers.forEach((marker, index) => {
        marker.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Venues/' + venuesData[index].image,
            iconSize: marker.isHovering ? setIconSizeHover(map.getZoom()) : setIconSize(map.getZoom()),
            popupAnchor: marker.isHovering ? setPopupAnchorHover(map.getZoom()) : setPopupAnchor(map.getZoom())
        }));

        // Update discipline marker sizes and positions if they are currently displayed
        updateDisciplineMarkersZoom(marker);
    });
});

// === Zoom to discipline function from grid.js ===
function zoomToDiscipline(disciplineName) {
    
    const target = markers.find(marker =>
        marker.disciplinesList.includes(disciplineName)
    );
    
    // Move to map section with 1.2s animation
    map.flyTo(target.getLatLng(), 12, { duration: 1.2 });

    // Open disciplines after 1.3s to happen after animation
    setTimeout(() => target.fire('click'), 1300);
}

// === Clean discipline name for podium.js ===
function cleanMapDisciplineName(name) {
    if (name === "Cross-country-skiing") return "Cross-Country Skiing";
    // General case: replace hyphens with spaces, capitalize each word
    return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// === Reset map view when clearing filters ===
function resetMapView() {
    map.flyTo([45.850799, 10.664303], 8);
}// ─── MAP.JS — Figure 2.2 ───────────────────────────────────────────────────

const mapWidth = 960;
const mapHeight = 500;

const mapSvg = d3.select("#figure2_2")
  .attr("width", mapWidth)
  .attr("height", mapHeight)
  .style("background", "#0a1628")
  .style("display", "block");

const projection = d3.geoNaturalEarth1()
  .scale(153)
  .translate([mapWidth / 2, mapHeight / 2]);

const path = d3.geoPath().projection(projection);

const isoAlpha3ToNumeric = {
  "AFG":"004","ALB":"008","DZA":"012","AND":"020","AGO":"024","ARG":"032",
  "ARM":"051","AUS":"036","AUT":"040","AZE":"031","BEL":"056","BEN":"204",
  "BIH":"070","BOL":"068","BRA":"076","BGR":"100","BUL":"100","CAN":"124",
  "CHI":"152","CHL":"152","CHN":"156","COL":"170","CRI":"188","CRO":"191",
  "HRV":"191","CYP":"196","CZE":"203","DEN":"208","DNK":"208","ECU":"218",
  "EGY":"818","EST":"233","ETH":"231","FIN":"246","FRA":"250","GEO":"268",
  "GER":"276","DEU":"276","GBR":"826","GRE":"300","GRL":"304","GTM":"320",
  "HAI":"332","HKG":"344","HUN":"348","ISL":"352","IND":"356","IRI":"364",
  "IRN":"364","IRL":"372","ISR":"376","ITA":"380","JAM":"388","JPN":"392",
  "KAZ":"398","KEN":"404","KGZ":"417","KOR":"410","KOS":"926","KSA":"682",
  "SAU":"682","LAT":"428","LBN":"422","LIE":"438","LTU":"440","LUX":"442",
  "MAD":"450","MAR":"504","MAS":"458","MDA":"498","MEX":"484","MGL":"496",
  "MKD":"807","MLT":"470","MNE":"499","MON":"492","MCO":"492",
  "NED":"528","NLD":"528","NGR":"566","NGA":"566","NOR":"578","NZL":"554",
  "PAK":"586","PHI":"608","POL":"616","POR":"620","PRT":"620","PUR":"630",
  "ROU":"642","RSA":"710","ZAF":"710","RUS":"643","SGP":"702","SVK":"703",
  "SLO":"705","SVN":"705","SMR":"674","SRB":"688","SUI":"756","CHE":"756",
  "SWE":"752","SWK":"752","THA":"764","TTO":"780","TPE":"158","TWN":"158",
  "TUR":"792","UAE":"784","UKR":"804","URU":"858","USA":"840","UZB":"860",
  "VEN":"862","AIN":"000"
};

const countryNames = {
  "AFG":"Afghanistan","ALB":"Albania","DZA":"Algeria","AND":"Andorra",
  "AGO":"Angola","ARG":"Argentina","ARM":"Armenia","AUS":"Australia",
  "AUT":"Austria","AZE":"Azerbaijan","BEL":"Belgium","BEN":"Benin",
  "BIH":"Bosnia & Herzegovina","BOL":"Bolivia","BRA":"Brazil",
  "BGR":"Bulgaria","BUL":"Bulgaria","CAN":"Canada","CHI":"Chile",
  "CHL":"Chile","CHN":"China","COL":"Colombia","CRO":"Croatia",
  "HRV":"Croatia","CYP":"Cyprus","CZE":"Czech Republic","DEN":"Denmark",
  "DNK":"Denmark","ECU":"Ecuador","EST":"Estonia","FIN":"Finland",
  "FRA":"France","GEO":"Georgia","GER":"Germany","DEU":"Germany",
  "GBR":"Great Britain","GRE":"Greece","HAI":"Haiti","HKG":"Hong Kong",
  "HUN":"Hungary","ISL":"Iceland","IND":"India","IRI":"Iran",
  "IRN":"Iran","IRL":"Ireland","ISR":"Israel","ITA":"Italy",
  "JAM":"Jamaica","JPN":"Japan","KAZ":"Kazakhstan","KEN":"Kenya",
  "KGZ":"Kyrgyzstan","KOR":"South Korea","KOS":"Kosovo","KSA":"Saudi Arabia",
  "SAU":"Saudi Arabia","LAT":"Latvia","LBN":"Lebanon","LIE":"Liechtenstein",
  "LTU":"Lithuania","LUX":"Luxembourg","MAD":"Madagascar","MAR":"Morocco",
  "MAS":"Malaysia","MDA":"Moldova","MEX":"Mexico","MGL":"Mongolia",
  "MKD":"North Macedonia","MLT":"Malta","MNE":"Montenegro","MON":"Monaco",
  "MCO":"Monaco","NED":"Netherlands","NLD":"Netherlands","NGR":"Nigeria",
  "NGA":"Nigeria","NOR":"Norway","NZL":"New Zealand","PAK":"Pakistan",
  "PHI":"Philippines","POL":"Poland","POR":"Portugal","PRT":"Portugal",
  "PUR":"Puerto Rico","ROU":"Romania","RSA":"South Africa","ZAF":"South Africa",
  "SGP":"Singapore","SVK":"Slovakia","SLO":"Slovenia","SVN":"Slovenia",
  "SMR":"San Marino","SRB":"Serbia","SUI":"Switzerland","CHE":"Switzerland",
  "SWE":"Sweden","THA":"Thailand","TTO":"Trinidad & Tobago","TPE":"Chinese Taipei",
  "TWN":"Chinese Taipei","TUR":"Turkey","UAE":"UAE","UKR":"Ukraine",
  "URU":"Uruguay","USA":"United States","UZB":"Uzbekistan","VEN":"Venezuela",
  "AIN":"AIN"
};

// Tooltip
const tooltip = d3.select("body")
  .append("div")
  .style("position", "fixed")
  .style("background", "rgba(10, 22, 40, 0.92)")
  .style("color", "#e8eaf0")
  .style("padding", "8px 12px")
  .style("border-radius", "6px")
  .style("font-size", "13px")
  .style("pointer-events", "none")
  .style("opacity", 0)
  .style("border", "1px solid rgba(255,255,255,0.1)");

function parseDiscipline(d) {
  try {
    const match = d.events.match(/'discipline':\s*'([^']+)'/);
    return match ? match[1] : "Unknown";
  } catch {
    return "Unknown";
  }
}

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.csv("../DataPreprocessing/athletes.csv"),
  d3.json("countries_coords.json"),
  d3.json("regions.json")
]).then(([world, athletes, coords, regions]) => {

  window.athletesData = athletes;
  updateBarChart(athletes, null);

  const athletesByCountry = d3.rollup(
    athletes, v => v.length, d => d.country_code
  );

  const maxAthletes = d3.max([...athletesByCountry.values()]);

  const colorScale = d3.scaleSequential()
    .domain([0, maxAthletes])
    .interpolator(d3.interpolateBlues);

  const countries = topojson.feature(world, world.objects.countries);

  // ── CARTE ──────────────────────────────────────────────────────────────
  const countryPaths = mapSvg.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const numId = String(+d.id).padStart(3, "0");
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      return count > 0 ? colorScale(count) : "#1a2e4a";
    })
    .attr("stroke", "#2a4a6a")
    .attr("stroke-width", 0.5);

  // ── TOOLTIP + HOVER + CLICK ─────────────────────────────────────────────
  countryPaths
    .on("mouseover", function(event, d) {
      const numId = String(+d.id).padStart(3, "0");
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      if (count === 0) return;
      d3.select(this).attr("stroke", "white").attr("stroke-width", 1.5);

      const countryAthletes = athletes.filter(a => a.country_code === alpha3);
      const disciplineCount = d3.rollup(
        countryAthletes, v => v.length, a => parseDiscipline(a)
      );
      const topDiscipline = [...disciplineCount.entries()]
        .sort((a, b) => b[1] - a[1])[0];

      const men = countryAthletes.filter(a => a.gender === "M").length;
      const women = countryAthletes.filter(a => a.gender === "F").length;
      const pctMen = Math.round(men / count * 100);
      const pctWomen = Math.round(women / count * 100);

      tooltip.style("opacity", 1).html(`
        <div style="font-weight:bold;font-size:14px;margin-bottom:6px;color:#4a9eff">
          ${countryNames[alpha3] || alpha3}
        </div>
        <div>🏅 <strong>${count}</strong> athletes</div>
        <div>🏆 Top sport: <strong>${topDiscipline ? topDiscipline[0] : "—"}</strong></div>
        <div>👨 Men: <strong>${men}</strong> (${pctMen}%)</div>
        <div>👩 Women: <strong>${women}</strong> (${pctWomen}%)</div>
      `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.clientX + 14) + "px")
        .style("top", (event.clientY - 10) + "px");
    })
    .on("mouseout", function() {
      if (!d3.select(this).classed("selected")) {
        d3.select(this).attr("stroke", "#2a4a6a").attr("stroke-width", 0.5);
      }
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      const numId = String(+d.id).padStart(3, "0");
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      if (count === 0) return;

      const isSame = d3.select(this).classed("selected");
      countryPaths.classed("selected", false)
        .attr("stroke", "#2a4a6a").attr("stroke-width", 0.5);

      if (!isSame) {
        d3.select(this).classed("selected", true)
          .attr("stroke", "white").attr("stroke-width", 2);
        updateBarChart(athletes, alpha3);
      } else {
        updateBarChart(athletes, null);
      }
    });

  // ── LÉGENDE ─────────────────────────────────────────────────────────────
  const legend = mapSvg.append("g")
    .attr("transform", `translate(20, ${mapHeight - 100})`);

  legend.append("text")
    .attr("x", 0).attr("y", 0)
    .style("fill", "#e8eaf0").style("font-size", "11px")
    .style("font-weight", "bold").text("Athletes per country");

  const defs = mapSvg.append("defs");
  const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-gradient");

  linearGradient.selectAll("stop")
    .data([
      { offset: "0%", color: colorScale(maxAthletes) },
      { offset: "50%", color: colorScale(maxAthletes / 2) },
      { offset: "100%", color: colorScale(0) }
    ])
    .join("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  legend.append("rect")
    .attr("x", 0).attr("y", 8)
    .attr("width", 150).attr("height", 10)
    .style("fill", "url(#legend-gradient)").attr("rx", 2);

  legend.append("text").attr("x", 0).attr("y", 30)
    .style("fill", "#a0b4c8").style("font-size", "10px").text("0");

  legend.append("text").attr("x", 150).attr("y", 30)
    .attr("text-anchor", "end")
    .style("fill", "#a0b4c8").style("font-size", "10px")
    .text(`${maxAthletes} athletes`);

  legend.append("circle")
    .attr("cx", 0).attr("cy", 55).attr("r", 5)
    .attr("fill", "rgba(255, 200, 50, 0.7)").attr("stroke", "none");

  legend.append("text").attr("x", 12).attr("y", 59)
    .style("fill", "#a0b4c8").style("font-size", "10px")
    .text("1 dot = 1 athlete");

  // ── DOTS (1 par athlète) ────────────────────────────────────────────────
  const milanXY = projection([9.19, 45.46]);

  const dotsGroup = mapSvg.append("g").attr("class", "dots");

  const allDots = [];
  athletesByCountry.forEach((count, code) => {
    const latLng = coords[code];
    if (!latLng) return;
    const xy = projection([latLng[1], latLng[0]]);
    if (!xy) return;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 20;
      const ox = xy[0] + Math.cos(angle) * radius;
      const oy = xy[1] + Math.sin(angle) * radius;
      allDots.push({ code, count, x: ox, y: oy, originX: ox, originY: oy });
    }
  });

  dotsGroup.selectAll("circle")
    .data(allDots)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 2)
    .attr("fill", "rgba(255, 200, 50, 0.7)")
    .attr("stroke", "none");

  // ── MARQUEUR MILAN ──────────────────────────────────────────────────────
  const milanG = mapSvg.append("g")
    .attr("transform", `translate(${milanXY[0]}, ${milanXY[1]})`);

  milanG.append("circle")
    .attr("r", 8)
    .attr("fill", "rgba(255, 80, 80, 0.3)")
    .attr("stroke", "#ff5050")
    .attr("stroke-width", 1.5);

  milanG.append("text")
    .attr("text-anchor", "middle").attr("dy", "4px")
    .style("font-size", "10px").text("⭐");

  milanG.append("text")
    .attr("text-anchor", "middle").attr("dy", "-12px")
    .style("fill", "white").style("font-size", "10px")
    .style("font-weight", "bold").text("Milano");

  // ── BOUTONS SEND / RESET ────────────────────────────────────────────────
  d3.select("#btn-send").on("click", function() {
    dotsGroup.selectAll("circle")
      .transition().duration(2000)
      .delay(() => Math.random() * 1500)
      .ease(d3.easeCubicInOut)
      .attr("cx", milanXY[0]).attr("cy", milanXY[1])
      .attr("r", 1.5).attr("fill", "rgba(255, 200, 50, 0.4)");
  });

  d3.select("#btn-reset").on("click", function() {
    dotsGroup.selectAll("circle")
      .transition().duration(1000)
      .attr("cx", d => d.originX).attr("cy", d => d.originY)
      .attr("r", 2).attr("fill", "rgba(255, 200, 50, 0.7)");
  });

  // ── FILTRE PAR RÉGION ───────────────────────────────────────────────────
  const countryToRegion = {};
  Object.entries(regions).forEach(([region, codes]) => {
    codes.forEach(code => countryToRegion[code] = region);
  });

  function filterByRegion(region) {
    d3.selectAll(".region-btn").classed("active", false);
    d3.select(region ? `#btn-${region.toLowerCase()}` : "#btn-all")
      .classed("active", true);

    dotsGroup.selectAll("circle")
      .transition().duration(400)
      .attr("opacity", d => {
        if (!region) return 0.7;
        return countryToRegion[d.code] === region ? 1 : 0.05;
      });

    countryPaths.transition().duration(400)
      .attr("opacity", d => {
        if (!region) return 1;
        const numId = String(+d.id).padStart(3, "0");
        const alpha3 = Object.keys(isoAlpha3ToNumeric)
          .find(k => isoAlpha3ToNumeric[k] === numId);
        return alpha3 && countryToRegion[alpha3] === region ? 1 : 0.25;
      });
  }

  d3.select("#btn-all").on("click", () => filterByRegion(null));
  d3.select("#btn-europe").on("click", () => filterByRegion("Europe"));
  d3.select("#btn-americas").on("click", () => filterByRegion("Americas"));
  d3.select("#btn-asia").on("click", () => filterByRegion("Asia"));
  d3.select("#btn-africa").on("click", () => filterByRegion("Africa"));
  d3.select("#btn-oceania").on("click", () => filterByRegion("Oceania"));

  console.log("Athlètes:", athletes.length, "| Dots:", allDots.length);

}).catch(err => console.error("Erreur:", err));