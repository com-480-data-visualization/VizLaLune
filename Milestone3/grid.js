// Fetches HTML directory listing from a server path, scrapes all .png image links from it, 
// then dynamically builds a visual grid of "discipline cards" (image + label) using D3.js.

// To memorize the selected discipline
let selectedDiscipline = null;

fetch('../ExtraResources/Disciplines/') // Fetch at this URL from server
    .then(response => response.text()) // Transform the body: ReadableStream response into HTML text
    .then(html => { // html = response.text()

        // Required to enable querySelectorAll which transforms HTML string into DOM tree
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html'); 

        // Find all <a> tags in the directory listing,
        // extract their href URLs and keep only .png image links
        const links = [...doc.querySelectorAll('a')]
            .map(a => a.href)
            .filter(href => href.endsWith('.png'));

        // Select grid container
        const grid = d3.select('#discipline-grid');

        // For each image link, create a card with the image and a label
        links.forEach(imgURL => {
            const disciplineName = imgURL.split('/').pop().replace('.png', '');
            const disciplineURL = `https://www.olympics.com/en/sports/${disciplineName.toLowerCase()}`; // Link maybe changed (done once already)
            const disciplineImgURL = `../ExtraResources/Disciplines/${disciplineName}.png`;

            // == Generate card ==
            const card = grid.append('div')
                .attr('class', 'discipline-card');

            card.append('img')
                .attr('src', disciplineImgURL)
                .attr('alt', disciplineName);

            // Cross-country special case handling
            if (disciplineName === "Cross-country-skiing"){
                card.append('text')
                    .text("Cross-Country Skiing");
            } else {
                card.append('text')
                    .text(disciplineName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
            }

            // == Click event ==
                // Single click: zoom map + show podium below grid
            card.on('click', () => {
                const badge = document.getElementById('badge-discipline-input')

                // Remove 'selected' class from previously selected discipline
                if (selectedDiscipline){
                    selectedDiscipline.classed('selected', false);
                }

                // Click back on selected card
                if (selectedDiscipline === card) {
                    selectedDiscipline = null; // Deselect if clicking the same card
                    badge.value = ''; // Reset badge text
                    updateBubbles(null);
                    // Hide podium section when deselecting
                    document.getElementById('podium').style.display = 'none';
                    renderEventChart("No discipline selected");
                // Click on a different card
                } else {
                    card.classed('selected', true); // Add 'selected' class to clicked card
                    selectedDiscipline = card; // Update selected discipline
                    zoomToDiscipline(disciplineName);

                    let cleanDisciplineName; // To filter properly athletes.csv in bubbles.js

                    if (disciplineName === "Cross-country-skiing"){
                        cleanDisciplineName = "Cross-Country Skiing";
                    } else {
                        cleanDisciplineName = disciplineName
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, c => c.toUpperCase());
                    }

                    badge.value = cleanDisciplineName;
                    updateBubbles(cleanDisciplineName);

                    // Show podium inline below the grid
                    showPodium(cleanDisciplineName, disciplineURL, disciplineImgURL);

                    // Update event chart for this discipline
                    renderEventChart(cleanDisciplineName);
                }
            });
        });
    });


// Called from map.js when a discipline marker is clicked
function selectDisciplineCard(disciplineName) {
    // If disciplineName is empty ==> reset the grid selection
    if (!disciplineName){
        if (selectedDiscipline){
            selectedDiscipline.classed('selected', false);
            selectedDiscipline = null;
        }
        // Hide podium section when deselecting
        document.getElementById('podium').style.display = 'none';
        renderEventChart("No discipline selected");
        return;
    }

    // If disciplineName is provided
    d3.selectAll('.discipline-card').each(function() {
        const card = d3.select(this);
        const cardText = card.select('text').text();

        if (cardText === disciplineName) {
            // Deselect previous card
            if (selectedDiscipline) {
                selectedDiscipline.classed('selected', false);
            }
            // Select this card
            card.classed('selected', true);
            selectedDiscipline = card;
        }
    });
}