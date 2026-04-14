// ==== GLOBAL VARIABLES ====
let totalAthletes = 0;
let participatingCountries = 0;
let disciplines = 0;
let events = 0;
let venues = 0;

let athletesDataGlobal = [];
let venuesDataGlobal = [];

// ==== LOAD CSV DATA ====
// Waits for both CSV to be loaded before continuing
Promise.all([
    d3.csv("../DataPreprocessing/athletes.csv"), // For Total Athletes + Participating Countries + Disciplines + Events
    d3.csv("../DataPreprocessing/venues.csv") // For Venues
]).then(([athletesData, venuesData]) => {
    athletesDataGlobal = athletesData;
    venuesDataGlobal = venuesData;

    // Update bubbles without any selected discipline
    updateBubbles(null);
});

// ==== UPDATE BUBBLES ====
function updateBubbles(selectedDiscipline) {
    // === Filter athletes on discipline ===
    const filteredAthletes = selectedDiscipline
        ? athletesDataGlobal.filter(d => {
            try {
                const parsed = Function('return (' + d.events + ')')();
                return parsed.some(e => e.discipline === selectedDiscipline);
            } catch { 
                return false; 
            }
        })
        : athletesDataGlobal;

    // === Compute Total Athletes ===
    totalAthletes = filteredAthletes.length;
    console.log("Total Athletes:", totalAthletes);

    // === Compute Participating Countries ===
    participatingCountries = new Set(filteredAthletes.map(d => d.country_code)).size;
    console.log("Participating Countries:", participatingCountries);

    // === Compute Disciplines ===
    const disciplines = new Set(
        filteredAthletes
            .flatMap(d => {
                try {
                    // Instead of JSON.parse because of cases such as Men's which will include the ' to " and breaking the parsing
                    const parsed = Function('return (' + d.events + ')')();
                    return parsed.map(e => e.discipline);
                } catch {
                    return []; // skip rows that fail to parse
                }
            })
    ).size;
    console.log("Disciplines:", disciplines);

    // === Compute Events ===
    const events = new Set(
        filteredAthletes
            .flatMap(d => {
                try {
                    // Instead of JSON.parse because of cases such as Men's which will include the ' to " and breaking the parsing
                    const parsed = Function('return (' + d.events + ')')();
                    // Need to filter out the empty events (as seen in the data exploration! See /DataExploration/PickedDataset)
                    return parsed
                                .filter(e => e.event)
                                .map(e => e.discipline + ' - ' + e.event);
                } catch {
                    return []; // skip rows that fail to parse
                }
            })
    ).size;
    console.log("Events:", events);

    // === Compute Venues ===
    venues = venuesDataGlobal.length;
    console.log("Venues:", venues);


    // All rest of code put here to ensure it get CSV data
    // === Bubble data ===
    const bubbleData = [
        { value: totalAthletes, text: 'Total Athletes',        color: { fill: '#EEEDFE', stroke: '#AFA9EC', text: '#3C3489'} },
        { value: participatingCountries, text: 'Participating Countries',    color: { fill: '#E1F5EE', stroke: '#5DCAA5', text: '#085041'} },
        { value: disciplines,   text: 'Disciplines', color: { fill: '#FAEEDA', stroke: '#EF9F27', text: '#633806'} },
        { value: events,  text: 'Events',      color: { fill: '#E6F1FB', stroke: '#85B7EB', text: '#0C447C'} },
        { value: venues,   text: 'Venues',      color: { fill: '#FAECE7', stroke: '#F0997B', text: '#712B13'} },
    ];

    // === Generate bubbles ===
    // Select bubbles container
    const bubbles = d3.select('#intro-bubbles');
    bubbles.selectAll('*').remove(); // Wipe existing bubbles (otherwise will just add 5 more bubbles)

    bubbleData.forEach(d => {
        // Empty bubble
        const card = bubbles.append('div')
            .attr('class', 'bubble-card')
            .style('background-color', d.color.fill)
            .style('border', `3px solid ${d.color.stroke}`)
            .style('color', d.color.text);
        
        // Bubble value
        card.append('div')
            .attr('class', 'bubble-value')
            .text(d.value);

        // Bubble text
        card.append('div')
            .attr('class', 'bubble-text')
            .text(d.text);
    });
}


