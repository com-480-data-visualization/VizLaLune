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


// === Venues icons ===
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

var initialIconWidth = 64
var initialIconHeight = 40
var initialPopupAnchor = [0, -20]

// AntholzAnterselvaBiathlonArena
var icon_Antholz_Antersevla = L.icon({
    iconUrl: '../ExtraRessources/Venues/AntholzAnterselvaBiathlonArena.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor // position of the popup relative to the icon
});
var marker_Antholz_Antersevla =L.marker([46.89978344698612, 12.154818897754511], {icon: icon_Antholz_Antersevla}).addTo(map).bindPopup("Antholz Antersevla Biathlon Arena");

// CortinaCurlingOlympicStadium
var icon_Cortina_Curling_Olympic_Stadium = L.icon({
    iconUrl: '../ExtraRessources/Venues/CortinaCurlingOlympicStadium.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Cortina_Curling_Olympic_Stadium =L.marker([46.54392264763853, 12.133486358679093], {icon: icon_Cortina_Curling_Olympic_Stadium}).addTo(map).bindPopup("Cortina Curling Olympic Stadium");

// CortinaSlidingCentre
var icon_Cortina_Sliding_Centre = L.icon({
    iconUrl: '../ExtraRessources/Venues/CortinaSlidingCentre.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Cortina_Sliding_Centre =L.marker([46.54604390906742, 12.127073084150148], {icon: icon_Cortina_Sliding_Centre}).addTo(map).bindPopup("Cortina Sliding Centre");

// LivignoAerials&MogulsPark
var icon_Livigno_Aerials_Moguls_Park = L.icon({
    iconUrl: '../ExtraRessources/Venues/LivignoAerials&MogulsPark.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Livigno_Aerials_Moguls_Park =L.marker([46.52711584722091, 10.156618695692748], {icon: icon_Livigno_Aerials_Moguls_Park}).addTo(map).bindPopup("Livigno Aerials & Moguls Park");

// LivignoSnowPark
var icon_Livigno_SnowPark = L.icon({
    iconUrl: '../ExtraRessources/Venues/LivignoSnowPark.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Livigno_SnowPark =L.marker([46.52030277180839, 10.156080263559932], {icon: icon_Livigno_SnowPark}).addTo(map).bindPopup("Livigno Snow Park");

// MilanoIceSkatingArena
var icon_Milano_Ice_Skating_Arena = L.icon({
    iconUrl: '../ExtraRessources/Venues/MilanoIceSkatingArena.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Milano_Ice_Skating_Arena =L.marker([45.40156275065069, 9.142319961258863], {icon: icon_Milano_Ice_Skating_Arena}).addTo(map).bindPopup("Milano Ice Skating Arena");

// MilanoRhoIceHockeyArena & MilanoSpeedSkatingStadium
var icon_Milano_Rho_Ice_Hockey_Arena = L.icon({
    iconUrl: '../ExtraRessources/Venues/MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Milano_Rho_Ice_Hockey_Arena =L.marker([45.52135449345083, 9.077361542788738], {icon: icon_Milano_Rho_Ice_Hockey_Arena}).addTo(map).bindPopup("Milano Rho Ice Hockey Arena & Speed Skating Stadium");

// MilanoSanSiroOlympicStadium
var icon_Milano_San_Siro_Olympic_Stadium = L.icon({
    iconUrl: '../ExtraRessources/Venues/MilanoSanSiroOlympicStadium.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Milano_San_Siro_Olympic_Stadium =L.marker([45.478018233365816, 9.123853306861502], {icon: icon_Milano_San_Siro_Olympic_Stadium}).addTo(map).bindPopup("Milano San Siro Olympic Stadium");

// MilanoSantagiuliaIceHockeyArena
var icon_Milano_Santagiulia_Ice_Hockey_Arena = L.icon({
    iconUrl: '../ExtraRessources/Venues/MilanoSantagiuliaIceHockeyArena.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Milano_Santagiulia_Ice_Hockey_Arena =L.marker([45.44146491547319, 9.254797454093541], {icon: icon_Milano_Santagiulia_Ice_Hockey_Arena}).addTo(map).bindPopup("Milano Santagiulia Ice Hockey Arena");

// PredazzoSkiJumpingStadium
var icon_Predazzo_Ski_Jumping_Stadium = L.icon({
    iconUrl: '../ExtraRessources/Venues/PredazzoSkiJumpingStadium.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Predazzo_Ski_Jumping_Stadium =L.marker([46.32808004838116, 11.601220322821835], {icon: icon_Predazzo_Ski_Jumping_Stadium}).addTo(map).bindPopup("Predazzo Ski Jumping Stadium");

// StelvioSkiCentre
var icon_Stelvio_Ski_Centre = L.icon({
    iconUrl: '../ExtraRessources/Venues/StelvioSkiCentre.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Stelvio_Ski_Centre =L.marker([46.450283657829196, 10.384446715739985], {icon: icon_Stelvio_Ski_Centre}).addTo(map).bindPopup("Stelvio Ski Centre");

// TeseroCross-CountrySkiingStadium
var icon_Tesero_Cross_Country_Skiing_Stadium = L.icon({
    iconUrl: '../ExtraRessources/Venues/TeseroCross-CountrySkiingStadium.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Tesero_Cross_Country_Skiing_Stadium =L.marker([46.28263384762345, 11.523868284140212], {icon: icon_Tesero_Cross_Country_Skiing_Stadium}).addTo(map).bindPopup("Tesero Cross-Country Skiing Stadium");

// TofaneAlpineSkiingCentre
var icon_Tofane_Alpine_Skiing_Centre = L.icon({
    iconUrl: '../ExtraRessources/Venues/TofaneAlpineSkiingCentre.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Tofane_Alpine_Skiing_Centre =L.marker([46.535066186820735, 12.121624673178943], {icon: icon_Tofane_Alpine_Skiing_Centre}).addTo(map).bindPopup("Tofane Alpine Skiing Centre");

// VeronaOlympicArena
var icon_Verona_Olympic_Arena = L.icon({
    iconUrl: '../ExtraRessources/Venues/VeronaOlympicArena.png',
    iconSize:     [initialIconWidth, initialIconHeight], // size of the icon
    popupAnchor:  initialPopupAnchor
});
var marker_Verona_Olympic_Arena =L.marker([45.438848940007134, 10.994207524175199], {icon: icon_Verona_Olympic_Arena}).addTo(map).bindPopup("Verona Olympic Arena");

// === Events ===
map.on('zoom', function() {
    marker_Antholz_Antersevla.setIcon(L.icon({ // setIcon to change icon without deleting the marker
        iconUrl: '../ExtraRessources/Venues/AntholzAnterselvaBiathlonArena.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Cortina_Curling_Olympic_Stadium.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/CortinaCurlingOlympicStadium.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Cortina_Sliding_Centre.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/CortinaSlidingCentre.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Livigno_Aerials_Moguls_Park.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/LivignoAerials&MogulsPark.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Livigno_SnowPark.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/LivignoSnowPark.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Milano_Ice_Skating_Arena.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/MilanoIceSkatingArena.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Milano_Rho_Ice_Hockey_Arena.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/MilanoRhoIceHockeyArena_MilanoSpeedSkatingStadium.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Milano_San_Siro_Olympic_Stadium.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/MilanoSanSiroOlympicStadium.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Milano_Santagiulia_Ice_Hockey_Arena.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/MilanoSantagiuliaIceHockeyArena.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Predazzo_Ski_Jumping_Stadium.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/PredazzoSkiJumpingStadium.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Stelvio_Ski_Centre.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/StelvioSkiCentre.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Tesero_Cross_Country_Skiing_Stadium.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/TeseroCross-CountrySkiingStadium.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Tofane_Alpine_Skiing_Centre.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/TofaneAlpineSkiingCentre.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));

    marker_Verona_Olympic_Arena.setIcon(L.icon({ 
        iconUrl: '../ExtraRessources/Venues/VeronaOlympicArena.png',
        iconSize: setIconSize(map.getZoom()),
        popupAnchor: setPopupAnchor(map.getZoom())
    }));
});