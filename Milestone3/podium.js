// Global variables
let filteredSchedule = [];
let filteredMedallists = [];
let sortEventNameState = "asc"; // "asc": A to Z, "desc": Z to A
let sortEventTypeState = "asc";
let sortEventVenueState = "asc";
let sortEventDateState = "asc";

// Cache the CSV data so we only load it once
let schedulesCache = null;
let medallistsCache = null;

// ==== Main entry point: called from grid.js and map.js ====
// disciplineName : display name e.g. "Cross-Country Skiing"
// disciplineURL  : link to official Olympics page
// disciplineImage: path to the discipline image
function showPodium(disciplineName, disciplineURL, disciplineImage) {
    // Show the section
    const section = document.getElementById("podium");
    section.style.display = "block";

    // Fill header info
    document.getElementById("disciplineName").textContent = disciplineName;
    document.getElementById("disciplineImage").src = disciplineImage;
    document.getElementById("disciplineDetails").innerHTML = "More details about " + disciplineName + `: <a href="${disciplineURL}" target="_blank">View official Olympics Website</a>`;


    // Reset sort state on each new discipline load
    sortEventNameState = "asc";
    sortEventTypeState = "asc";
    sortEventVenueState = "asc";
    sortEventDateState = "asc";
    d3.select("#sort-event-name-arrow").text("⇅");
    d3.select("#sort-event-type-arrow").text("⇅");
    d3.select("#sort-event-venue-arrow").text("⇅");
    d3.select("#sort-event-date-arrow").text("⇅");
    // Load (or reuse cached) CSV data and render the table
    loadCSVData().then(([schedulesData, medallistsData]) => {
        filteredSchedule = schedulesData.filter(row => row.discipline === disciplineName && row.event_medal === "1");
        filteredMedallists = medallistsData.filter(row => row.discipline === disciplineName);
        renderTable(filteredSchedule);
    });
}


// === Load both CSVs once and cache them ===
function loadCSVData() {
    if (schedulesCache && medallistsCache) {
        return Promise.resolve([schedulesCache, medallistsCache]);
    }
    return Promise.all([
        d3.csv("../DataPreprocessing/schedules.csv"),
        d3.csv("../DataPreprocessing/medallists.csv")
    ]).then(([schedulesData, medallistsData]) => {
        schedulesCache = schedulesData;
        medallistsCache = medallistsData;
        return [schedulesCache, medallistsCache];
    });
}

// === Render the table based on filtered data ===
function renderTable(scheduleData) {
    // Select the table body
    const tbody = d3.select("#podium-table tbody");

    // Clear hard coded existing rows (leave them for debug for the moment)
    tbody.selectAll("tr").remove();

    // Fill the table with filtered data
    const rows = tbody.selectAll("tr")
        .data(scheduleData)
        .enter()
        .append("tr");

    // Fill with CSV corresponding element
    // == Event Name ==
    rows.append("td").text(d => d.event); 

    // Event Type ==
        // To just keep "INDV" or "TEAM" for event type
    rows.append("td").text(d => {
        if (d.event_type === "DGRP" || d.event_type === "IGRP") return "TEAM";
        return d.event_type;
    });

    // == Event Venue ==
    rows.append("td").text(d => d.venue);
    
    // == Event Date ==
    rows.append("td").text(d => {
        const date = new Date(d.day);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // 0-indexed

        return `${day}/${month.toString().padStart(2, "0")}`; // To string for padStart to have "02" instead of "2"
    });

    // === Input medallists.csv data ===
    // Look into filtered medallists.csv, if corresponding event then check medalt type if gold get the name
    rows.append("td").html(d => {
        const golds = filteredMedallists.filter(m => m.event_name === d.event && m.medal === "GOLD");
        const country = golds[0].country_code;
        const names = golds.map(m => m.name).join("<br>");
        return golds.length > 0 ? `<strong>${country}</strong><br>${names}` : "Podium equality";
    });
    rows.append("td").html(d => {
        const silvers = filteredMedallists.filter(m => m.event_name === d.event && m.medal === "SILVER");
        if (silvers.length === 0) return "Podium equality";
        const country = silvers[0].country_code;
        const names = silvers.map(m => m.name).join("<br>");
        return `<strong>${country}</strong><br>${names}`;
    });
    rows.append("td").html(d => {
        const bronzes = filteredMedallists.filter(m => m.event_name === d.event && m.medal === "BRONZE");
        if (bronzes.length === 0) return "Podium equality";
        const country = bronzes[0].country_code;
        const names = bronzes.map(m => m.name).join("<br>");
        return `<strong>${country}</strong><br>${names}`;
    });
}

// ==== Sort table ====
// == Event Name Sort ==
// On click change order of table + arrow direction
d3.select("#event-name").on("click", function() {
    // Deal with state + arrow
    if (sortEventNameState === "asc") {
        sortEventNameState = "desc";
        d3.select("#sort-event-name-arrow").text("▼");
    } else {
        sortEventNameState = "asc";
        d3.select("#sort-event-name-arrow").text("▲");
    }

    // Sort table
    // .sort((a,b)) -1 a before b, 1 b before a, 0 no change
    const sortedEvents = filteredSchedule.sort((a, b) => {
        if (sortEventNameState === "asc") {
            return a.event.localeCompare(b.event);
        } else {
            return b.event.localeCompare(a.event);
        }
    });

    // Reset other filters symbols
    d3.select("#sort-event-type-arrow").text("⇅");
    d3.select("#sort-event-venue-arrow").text("⇅");
    d3.select("#sort-event-date-arrow").text("⇅");
    sortEventTypeState = "asc";
    sortEventVenueState = "asc";
    sortEventDateState = "asc";

    renderTable(sortedEvents);
});

// == Event Type Sort ==
d3.select("#event-type").on("click", function() {
    if (sortEventTypeState === "asc") {
        sortEventTypeState = "desc";
        d3.select("#sort-event-type-arrow").text("▼");
    } else {
        sortEventTypeState = "asc";
        d3.select("#sort-event-type-arrow").text("▲");
    }
    const sortedEvents = filteredSchedule.sort((a, b) => {
        if (sortEventTypeState === "asc") {
            return a.event_type.localeCompare(b.event_type);
        } else {
            return b.event_type.localeCompare(a.event_type);
        }
    });

    // Reset other filters symbols
    d3.select("#sort-event-name-arrow").text("⇅");
    d3.select("#sort-event-venue-arrow").text("⇅");
    d3.select("#sort-event-date-arrow").text("⇅");
    sortEventNameState = "asc";
    sortEventVenueState = "asc";
    sortEventDateState = "asc";

    renderTable(sortedEvents);
});

// == Event Venue Sort ==
d3.select("#event-venue").on("click", function() {
    if (sortEventVenueState === "asc") {
        sortEventVenueState = "desc";
        d3.select("#sort-event-venue-arrow").text("▼");
    } else {
        sortEventVenueState = "asc";
        d3.select("#sort-event-venue-arrow").text("▲");
    }
    const sortedEvents = filteredSchedule.sort((a, b) => {
        if (sortEventVenueState === "asc") {
            return a.venue.localeCompare(b.venue);
        } else {
            return b.venue.localeCompare(a.venue);
        }
    });

    // Reset other filters symbols
    d3.select("#sort-event-name-arrow").text("⇅");
    d3.select("#sort-event-type-arrow").text("⇅");
    d3.select("#sort-event-date-arrow").text("⇅");
    sortEventNameState = "asc";
    sortEventTypeState = "asc";
    sortEventDateState = "asc";

    renderTable(sortedEvents);
});

// == Event Date Sort ==
d3.select("#event-date").on("click", function() {
    if (sortEventDateState === "asc") {
        sortEventDateState = "desc";
        d3.select("#sort-event-date-arrow").text("▼");
    } else {
        sortEventDateState = "asc";
        d3.select("#sort-event-date-arrow").text("▲");
    }
    const sortedEvents = filteredSchedule.sort((a, b) => {
        if (sortEventDateState === "asc") {
            return a.end_date.localeCompare(b.end_date);
        } else {
            return b.end_date.localeCompare(a.end_date);
        }
    });

    // Reset other filters symbols
    d3.select("#sort-event-name-arrow").text("⇅");
    d3.select("#sort-event-type-arrow").text("⇅");
    d3.select("#sort-event-venue-arrow").text("⇅");
    sortEventNameState = "asc";
    sortEventTypeState = "asc";
    sortEventVenueState = "asc";

    renderTable(sortedEvents);
});