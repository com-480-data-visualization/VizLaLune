// Global variables
let filteredSchedule = [];
let filteredMedallists = [];
let sortState = "asc"; // "asc": A to Z, "desc": Z to A


// ==== Load CSV data onto table ====
// Waits for both CSV to be loaded before continuing
Promise.all([
    d3.csv("../DataPreprocessing/schedules.csv"),
    d3.csv("../DataPreprocessing/medallists.csv")
]).then(([schedulesData, medallistsData]) => {
    // Filter the CSV data based on the discipline name
    filteredSchedule = schedulesData.filter(row => row.discipline === disciplineName && row.event_medal === "1");
    filteredMedallists = medallistsData.filter(row => row.discipline === disciplineName);

    renderTable(filteredSchedule);
});

// ==== Sort table ====
// On click change order of table + arrow direction
d3.select("#sort-event").on("click", function() {
    // Deal with state + arrow
    if (sortState === "asc") {
        sortState = "desc";
        d3.select("#sort-arrow").text("▼");
    } else {
        sortState = "asc";
        d3.select("#sort-arrow").text("▲");
    }

    // Sort table
    // .sort((a,b)) -1 a before b, 1 b before a, 0 no change
    const sortedEvents = filteredSchedule.sort((a, b) => {
        if (sortState === "asc") {
            return a.event.localeCompare(b.event);
        } else {
            return b.event.localeCompare(a.event);
        }
    });

    renderTable(sortedEvents);
});

function renderTable(scheduleData) {
    // Select the table body
    const tbody = d3.selectAll("table tbody");

    // Clear hard coded existing rows (leave them for debug for the moment)
    tbody.selectAll("tr").remove();

    // Fill the table with filtered data
    const rows = tbody.selectAll("tr")
        .data(scheduleData)
        .enter()
        .append("tr");

    // Fill with CSV corresponding element
    rows.append("td").text(d => d.event); 
    rows.append("td").text(d => d.event_type);
    rows.append("td").text(d => d.venue);
    rows.append("td").text(d => d.day);

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
        const country = silvers[0].country_code;
        const names = silvers.map(m => m.name).join("<br>");
        return silvers.length > 0 ? `<strong>${country}</strong><br>${names}` : "Podium equality";
    });
    rows.append("td").html(d => {
        const bronzes = filteredMedallists.filter(m => m.event_name === d.event && m.medal === "BRONZE");
        const country = bronzes[0].country_code;
        const names = bronzes.map(m => m.name).join("<br>");
        return bronzes.length > 0 ? `<strong>${country}</strong><br>${names}` : "Podium equality";
    });
}