// Acknowledgment: https://leafletjs.com/
// Used Google Maps to identify GPS coordinates

// === Map Initialization ===
// Leaflet map linked to id="map" in index.html. setView([lat, lng], zoomLevel) sets the initial view of the map.
var map = L.map('map').setView([45.850799, 10.664303], 8);

// Add tiles to map
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);


// === Event functions ===
// Adapt icon size to zoom level
// [0;19] with 0 being whole world
function setIconSize(zoomLevel) {
    return [(zoomLevel * 8),(zoomLevel * 5)];
}

function setPopupAnchor(zoomLevel) {
    var iconSize = setIconSize(zoomLevel);
    var iconHeight = iconSize[1];
    return [0, -(iconHeight/2)]; 
}

// === Venues Data ===
const venuesData = [
    { name: "Antholz Antersevla Biathlon Arena", coords: [46.89978344698612, 12.154818897754511], icon: "AntholzAnterselvaBiathlonArena.png" },
    { name: "Cortina Curling Olympic Stadium", coords: [46.54392264763853, 12.133486358679093], icon: "CortinaCurlingOlympicStadium.png" },
    { name: "Cortina Sliding Centre", coords: [46.54604390906742, 12.127073084150148], icon: "CortinaSlidingCentre.png" },
    { name: "Livigno Aerials & Moguls Park", coords: [46.52711584722091, 10.156618695692748], icon: "LivignoAerials&MogulsPark.png" },
    { name: "Livigno Snow Park", coords: [46.52030277180839, 10.156080263559932], icon: "LivignoSnowPark.png" },
    { name: "Milano Ice Skating Arena", coords: [45.40156275065069, 9.142319961258863], icon: "MilanoIceSkatingArena.png" },
    { name: "Milano Rho Ice Hockey Arena & Speed Skating Stadium", coords: [45.52135449345083, 9.077361542788738], icon: "MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png" },
    { name: "Milano San Siro Olympic Stadium", coords: [45.478018233365816, 9.123853306861502], icon: "MilanoSanSiroOlympicStadium.png" },
    { name: "Milano Santagiulia Ice Hockey Arena", coords: [45.44146491547319, 9.254797454093541], icon: "MilanoSantagiuliaIceHockeyArena.png" },
    { name: "Predazzo Ski Jumping Stadium", coords: [46.32808004838116, 11.601220322821835], icon: "PredazzoSkiJumpingStadium.png" },
    { name: "Stelvio Ski Centre", coords: [46.450283657829196, 10.384446715739985], icon: "StelvioSkiCentre.png" },
    { name: "Tesero Cross-Country Skiing Stadium", coords: [46.28263384762345, 11.523868284140212], icon: "TeseroCross-CountrySkiingStadium.png" },
    { name: "Tofane Alpine Skiing Centre", coords: [46.535066186820735, 12.121624673178943], icon: "TofaneAlpineSkiingCentre.png" },
    { name: "Verona Olympic Arena", coords: [45.438848940007134, 10.994207524175199], icon: "VeronaOlympicArena.png" }
];

// === Create Markers ===
var initialIconWidth = 64
var initialIconHeight = 40
var initialPopupAnchor = [0, -20]

const markers = venuesData.map(venue => {
    const icon = L.icon({
        iconUrl: '../ExtraRessources/Venues/' + venue.icon,
        iconSize: [initialIconWidth, initialIconHeight],
        popupAnchor: initialPopupAnchor
    });
    return L.marker(venue.coords, { icon: icon })
        .addTo(map)
        .bindPopup(venue.name);
});

// === Zoom Event Handler ===
map.on('zoom', function() {
    markers.forEach((marker, index) => {
        marker.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Venues/' + venuesData[index].icon,
            iconSize: setIconSize(map.getZoom()),
            popupAnchor: setPopupAnchor(map.getZoom())
        }));
    });
});