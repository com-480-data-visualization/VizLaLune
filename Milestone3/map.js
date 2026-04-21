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

        // Access link by double click
        marker.on('dblclick', function() {
            window.open(venue.url, '_blank');
        });

        const badge = document.getElementById('badge-text');

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
                            icon: L.icon({
                            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png',
                            iconSize: [markerSize[0]/2, markerSize[1]/2],
                            //iconAnchor: [0, 0] // leads to image having top left corner in middle of venue icon + - for x axis and up = + and down = - for y axis
                            iconAnchor: [(1/4) * markerSize[0], -(3/4) * markerSize[1]]
                            })
                        }
                    ).addTo(map);
                    marker.disciplineMarker11.disciplineName = marker.disciplinesList[0];

                    // Redirect to link
                    marker.disciplineMarker11.on('dblclick', function() {
                        window.open(marker.disciplineURL[0], '_blank');
                    });

                    marker.disciplineMarker11.on('click', function() {
                        const disciplineName = marker.disciplinesList[0];
                        const disciplineURL = marker.disciplineURL[0];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.textContent = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                    });
                    break;
                }

                case 2:  {// Show 2 disciplines
                    const markerSize = setIconSizeHover(map.getZoom());
                    marker.disciplineMarker21 = L.marker(
                        venue.coords,
                        {
                            icon: L.icon({
                            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png',
                            iconSize: [markerSize[0]/2, markerSize[1]/2],
                            iconAnchor: [(3/4) * markerSize[0], -(3/4) * markerSize[1]]
                            })
                        }
                    ).addTo(map);
                    marker.disciplineMarker21.disciplineName = marker.disciplinesList[0];

                    marker.disciplineMarker22 = L.marker(
                        venue.coords,
                        {
                            icon: L.icon({
                            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplinesList[1] + '.png',
                            iconSize: [markerSize[0]/2, markerSize[1]/2],
                            iconAnchor: [(-1/4) * markerSize[0], -(3/4) * markerSize[1]]
                            })
                        }
                    ).addTo(map);
                    marker.disciplineMarker22.disciplineName = marker.disciplinesList[1];

                    // Redirect to link
                    marker.disciplineMarker21.on('dblclick', function() {
                        window.open(marker.disciplineURL[0], '_blank');
                    });
                    marker.disciplineMarker22.on('dblclick', function() {
                        window.open(marker.disciplineURL[1], '_blank');
                    });

                    marker.disciplineMarker21.on('click', function() {
                        const disciplineName = marker.disciplinesList[0];
                        const disciplineURL = marker.disciplineURL[0];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.textContent = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                    });
                    marker.disciplineMarker22.on('click', function() {
                        const disciplineName = marker.disciplinesList[1];
                        const disciplineURL = marker.disciplineURL[1];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[1] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.textContent = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                    });

                    break;
                }

                case 3:  {// Show 3 disciplines
                    const markerSize = setIconSizeHover(map.getZoom());
                    marker.disciplineMarker31 = L.marker(
                        venue.coords,
                        {
                            icon: L.icon({
                            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png',
                            iconSize: [markerSize[0]/2, markerSize[1]/2],
                            iconAnchor: [(1) * markerSize[0], -(3/4) * markerSize[1]]
                            })
                        }
                    ).addTo(map);
                    marker.disciplineMarker31.disciplineName = marker.disciplinesList[0];

                    marker.disciplineMarker32 = L.marker(
                        venue.coords,
                        {
                            icon: L.icon({
                            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplinesList[1] + '.png',
                            iconSize: [markerSize[0]/2, markerSize[1]/2],
                            iconAnchor: [(-1/2) * markerSize[0], -(3/4) * markerSize[1]]
                            })
                        }
                    ).addTo(map);
                    marker.disciplineMarker32.disciplineName = marker.disciplinesList[1];

                    marker.disciplineMarker33 = L.marker(
                        venue.coords,
                        {
                            icon: L.icon({
                            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplinesList[2] + '.png',
                            iconSize: [markerSize[0]/2, markerSize[1]/2],
                            iconAnchor: [(1/4) * markerSize[0], -(3/4) * markerSize[1]]
                            })
                        }
                    ).addTo(map);
                    marker.disciplineMarker33.disciplineName = marker.disciplinesList[2];

                    // Redirect to link
                    marker.disciplineMarker31.on('dblclick', function() {
                        window.open(marker.disciplineURL[0], '_blank');
                    });
                    marker.disciplineMarker32.on('dblclick', function() {
                        window.open(marker.disciplineURL[1], '_blank');
                    });
                    marker.disciplineMarker33.on('dblclick', function() {
                        window.open(marker.disciplineURL[2], '_blank');
                    });

                    marker.disciplineMarker31.on('click', function() {
                        const disciplineName = marker.disciplinesList[0];
                        const disciplineURL = marker.disciplineURL[0];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[0] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.textContent = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName); 
                    });
                    marker.disciplineMarker32.on('click', function() {
                        const disciplineName = marker.disciplinesList[1];
                        const disciplineURL = marker.disciplineURL[1];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[1] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.textContent = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
                    });
                    marker.disciplineMarker33.on('click', function() {
                        const disciplineName = marker.disciplinesList[2];
                        const disciplineURL = marker.disciplineURL[2];
                        const disciplineImage = '../ExtraRessources/Disciplines/' + marker.disciplinesList[2] + '.png';
                        const cleanDisciplineName = cleanMapDisciplineName(disciplineName);
                        showPodium(cleanDisciplineName, disciplineURL, disciplineImage);
                        badge.textContent = cleanDisciplineName;
                        updateBubbles(cleanDisciplineName);
                        selectDisciplineCard(cleanDisciplineName);
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

function updateDisciplineMarkersZoom(marker) {
    const markerSize = setIconSizeHover(map.getZoom());
    
    if (marker.disciplineMarker11) {
        marker.disciplineMarker11.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplineMarker11.disciplineName + '.png',
            iconSize: [markerSize[0]/2, markerSize[1]/2],
            iconAnchor: [(1/4) * markerSize[0], -(3/4) * markerSize[1]]
        }));
    }

    if (marker.disciplineMarker21){
        marker.disciplineMarker21.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplineMarker21.disciplineName + '.png',
            iconSize: [markerSize[0]/2, markerSize[1]/2],
            iconAnchor: [(3/4) * markerSize[0], -(3/4) * markerSize[1]]
        }));

        marker.disciplineMarker22.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplineMarker22.disciplineName + '.png',
            iconSize: [markerSize[0]/2, markerSize[1]/2],
            iconAnchor: [(-1/4) * markerSize[0], -(3/4) * markerSize[1]]
        }));
    }

    if (marker.disciplineMarker31){
        marker.disciplineMarker31.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplineMarker31.disciplineName + '.png',
            iconSize: [markerSize[0]/2, markerSize[1]/2],
            iconAnchor: [(1) * markerSize[0], -(3/4) * markerSize[1]]
        }));

        marker.disciplineMarker32.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplineMarker32.disciplineName + '.png',
            iconSize: [markerSize[0]/2, markerSize[1]/2],
            iconAnchor: [-(1/2) * markerSize[0], -(3/4) * markerSize[1]]
        }));

        marker.disciplineMarker33.setIcon(L.icon({
            iconUrl: '../ExtraRessources/Disciplines/' + marker.disciplineMarker33.disciplineName + '.png',
            iconSize: [markerSize[0]/2, markerSize[1]/2],
            iconAnchor: [(1/4) * markerSize[0], -(3/4) * markerSize[1]]
        }));
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