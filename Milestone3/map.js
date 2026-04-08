// Acknowledgment: https://leafletjs.com/, https://d3js.org/
// Used Google Maps to identify GPS coordinates
// Use of Claude Haiku 4.5 for some code modulation to avoid repetition

// === Map Initialization ===
// Leaflet map linked to id="map" in index.html. setView([lat, lng], zoomLevel) sets the initial view of the map.
var map = L.map('map').setView([45.850799, 10.664303], 8);

// Add tiles to map
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// === Venues Manual Data ===
// Data to be added to the CSV information
const additionalData = [
    { name: "Antholz Antersevla Biathlon Arena", coords: [46.89978344698612, 12.154818897754511], image: "AntholzAnterselvaBiathlonArena.png" },
    { name: "Cortina Curling Olympic Stadium", coords: [46.54392264763853, 12.133486358679093], image: "CortinaCurlingOlympicStadium.png" },
    { name: "Cortina Sliding Centre", coords: [46.54604390906742, 12.127073084150148], image: "CortinaSlidingCentre.png" },
    { name: "Livigno Aerials & Moguls Park", coords: [46.52711584722091, 10.156618695692748], image: "LivignoAerials&MogulsPark.png" },
    { name: "Livigno Snow Park", coords: [46.52030277180839, 10.156080263559932], image: "LivignoSnowPark.png" },
    { name: "Milano Ice Skating Arena", coords: [45.40156275065069, 9.142319961258863], image: "MilanoIceSkatingArena.png" },
    { name: "Milano San Siro Olympic Stadium", coords: [45.478018233365816, 9.123853306861502], image: "MilanoSanSiroOlympicStadium.png" },
    { name: "Milano Santagiulia Ice Hockey Arena", coords: [45.44146491547319, 9.254797454093541], image: "MilanoSantagiuliaIceHockeyArena.png" },
    { name: "Milano Speed Skating Stadium", coords: [45.518432404275856, 9.085218217152695], image: "MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png" },
    { name: "Milano Rho Ice Hockey Arena", coords: [45.521909396135854, 9.072673103873448], image: "MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png" },
    { name: "Predazzo Ski Jumping Stadium", coords: [46.32808004838116, 11.601220322821835], image: "PredazzoSkiJumpingStadium.png" },
    { name: "Stelvio Ski Centre", coords: [46.450283657829196, 10.384446715739985], image: "StelvioSkiCentre.png" },
    { name: "Tesero Cross-Country Skiing Stadium", coords: [46.28263384762345, 11.523868284140212], image: "TeseroCross-CountrySkiingStadium.png" },
    { name: "Tofane Alpine Skiing Centre", coords: [46.535066186820735, 12.121624673178943], image: "TofaneAlpineSkiingCentre.png" },
    { name: "Verona Olympic Arena", coords: [45.438848940007134, 10.994207524175199], image: "VeronaOlympicArena.png" }
];

// === Access + Complete CSV data & Generate markers ===
var venuesData = [];

var markers = [];

var initialIconWidth = 64
var initialIconHeight = 40
var initialPopupAnchor = [0, -20]

d3.csv("../DataPreprocessing/venues.csv").then(data => {
    // == Complete CSV data ==
    venuesData = data.map((row, index) => {
        const{venue, ...rest} = row; // Extract the 'venue' property
        return {
            ...rest,                              // Copies all existing properties from the CSV row
            name: venue,                     // Rename 'venue' to 'venueName'
            coords: additionalData[index].coords,    // Adds coordinates
            image: additionalData[index].image,       // Adds image
        };
    });

    // == Create markers with hovering ==
    markers = venuesData.map(venue => {
        // = Place markers =
        // Need to move it here to avoid race condition where creating markers before the data is loaded
        // Generate icon
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
        
        return marker;
    });
})


// === Event functions ===
// Adapt icon size to zoom level
// [0;19] with 0 being whole world
function setIconSize(zoomLevel) {
    return [(zoomLevel * 8),(zoomLevel * 5)];
}

function setIconSizeHover(zoomLevel) {
    return [(zoomLevel * 10),(zoomLevel * 7)];
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

// === Zoom Event Handler ===
map.on('zoom', function() {
    markers.forEach((marker, index) => {
        marker.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Venues/' + venuesData[index].image,
            iconSize: marker.isHovering ? setIconSizeHover(map.getZoom()) : setIconSize(map.getZoom()),
            popupAnchor: marker.isHovering ? setPopupAnchorHover(map.getZoom()) : setPopupAnchor(map.getZoom())
        }));
    });
});

