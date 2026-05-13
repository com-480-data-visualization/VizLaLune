// Global variables to store counts
// Map structure for disciplines: { "Cross-Country Skiing" : { M: 12, F: 15 }, ... }
// Map structure for events: { "Cross-Country Skiing/EventName" : { M: 12, F: 15 }, ... }
const countsDisciplines = new Map();
const countsEvents = new Map();

let activeContinents = new Set(continents); // All selected at start
let athletesRaw = []; // Stored for recomputing on filter change

// ==== Load CSV  ====
d3.csv('../DataPreprocessing/athletes.csv').then(data => {
    athletesRaw = data; 
    recomputeAndRender(); // Initial render with all data
});

// ==== Recompute counts + re-render both charts ====
function recomputeAndRender() {
    // Clear previous counts
    countsDisciplines.clear();
    countsEvents.clear();

    // Recount based on active continents
    athletesRaw.forEach(athlete => {
        // Skip athlete if their continent is not selected
        const continent = countryToContinent[athlete.country_code];
        if (!activeContinents.has(continent)) return;

        try {
            // Same parsing logic as intro_bubbles.js
            // e.g. [{discipline: 'Cross-Country Skiing', event: "Men's 10km Interval Start Free"}, {discipline: 'Cross-Country Skiing', event: "Men's 10km + 10km Skiathlon"}]
            const participations = Function('return (' + athlete.events + ')')();

            // Disciplines + events for this athlete (avoid counting twice if multiple events in same discipline)
            const disciplines = [...new Set(participations.map(p => p.discipline))];
            const events = [...new Set(participations.map(p => p.discipline + "/" + p.event))];

            // Count disciplines
            disciplines.forEach(discipline => {
                // Create entry if discipline not yet seen
                if (!countsDisciplines.has(discipline)) {
                    countsDisciplines.set(discipline, { M: 0, F: 0 });
                }
                // Increment M or F counter
                countsDisciplines.get(discipline)[athlete.gender]++;
            });

            // Count events
            events.forEach(event => {
                // Create entry if event not yet seen
                if (!countsEvents.has(event)) {
                    countsEvents.set(event, { M: 0, F: 0 });
                }
                // Increment M or F counter
                countsEvents.get(event)[athlete.gender]++;
            });

        } catch { return; }
    });



    // Re-render discipline chart
    renderDisciplineChart();
    // Re-render event chart
    const disciplineName = document.getElementById('badge-discipline-input').value || 'No discipline selected';
    renderEventChart(disciplineName);
}

// ==== Render discipline chart ====
let showOverall = true;
function renderDisciplineChart() {
    // === Clear previous chart ===
    d3.select('#symmetrical-gender-discipline').selectAll('*').remove();

    // === Convert Map to array for D3 ===
    const chartData = Array.from(countsDisciplines, ([discipline, values]) => ({
        discipline,
        M: values.M,
        F: values.F
    })).sort((a, b) => (b.M + b.F) - (a.M + a.F)); // Sort by total descending

    // Compute Overall (bug detected and fixed: 3 athletes participated to more than 1 discipline!)
    if(showOverall) {
        // Filter by continent first
        const filteredAthletes = athletesRaw.filter(a => {
            const continent = countryToContinent[a.country_code];
            return activeContinents.has(continent);
        });

        const overallM = filteredAthletes.filter(a => a.gender === 'M').length;
        const overallF = filteredAthletes.filter(a => a.gender === 'F').length;

        chartData.unshift({ discipline: 'Overall', M: overallM, F: overallF });
    }

    // === Generate SVG ===
    // == Dimensions ==
    const width = 1400;
    const height = 600;
    const margin = 40; // Space for x-axis labels to show properly

    const dSvg = d3.select('#symmetrical-gender-discipline')
        .append('svg')
        .attr('width', width + margin * 2) // Extra space for axes on both sides
        .attr('height', height + margin + 80) // Extra space for x-axis + checkboxes on top
        .append('g')
        .attr('transform', `translate(${(width / 2) + margin}, 40)`); // Start bars middle and top + 40px down for checkboxes

    // == Scales ==
    const maxVal = d3.max(chartData, d => Math.max(d.M, d.F));

    const xScale = d3.scaleLinear()
        .domain([0, maxVal])    
        .range([0, width / 2]); // 0 to half the SVG width

    const yScale = d3.scaleBand()
        .domain(chartData.map(d => d.discipline))
        .range([0, height])
        .padding(0.2);

    // == Bars ==
    dSvg.selectAll('.bar-m')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar-m')
        .attr('x', d => -xScale(d.M))           // Negative x = goes left from center
        .attr('y', d => yScale(d.discipline))
        .attr('width', d => xScale(d.M))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#5b91ce');

    dSvg.selectAll('.bar-f')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar-f')
        .attr('x', 0)                            // Starts at center
        .attr('y', d => yScale(d.discipline))
        .attr('width', d => xScale(d.F))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#c45bbf');

    // == Labels ==
    dSvg.selectAll('.label-discipline')
        .data(chartData)
        .enter()
        .append('text')
        .attr('class', 'label-discipline')
        .attr('x', 0)
        .attr('y', d => yScale(d.discipline) + yScale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'black')
        .attr('font-size', '18px')
        .text(d => {
            const total = d.M + d.F;
            const pctM = Math.round(d.M / total * 100);
            const pctF = Math.round(d.F / total * 100);
            return `${pctM}%    ${d.discipline}    ${pctF}%`;
        });


    // == Axes ==
    dSvg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale.copy().range([0, -width / 2])))
        .style('font-size', '16px');

    dSvg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .style('font-size', '16px');

    dSvg.append('text')
        .attr('x', 0)
        .attr('y', height + margin + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .text('Number of Athletes per Discipline');
        

    // == Legend ==
    const legend = dSvg.append('g')
        .attr('transform', `translate(${-width / 2}, ${-30})`);

    legend.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#5b91ce');

    legend.append('text')
        .attr('x', 25)
        .attr('y', 16)
        .attr('fill', 'black')
        .attr('font-size', '18px')
        .text('Male');

    legend.append('rect')
        .attr('x', 70)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#c45bbf');

    legend.append('text')
        .attr('x', 95)
        .attr('y', 16)
        .attr('fill', 'black')
        .attr('font-size', '18px')
        .text('Female');

    // == Overall button ==
    const overallToggle = dSvg.append('g')
        .attr('transform', `translate(${(-width / 2) + 170}, -30)`)
        .style('cursor', 'pointer')
        .on('click', function() {
            showOverall = !showOverall;
            recomputeAndRender();
        });

    // Checkbox rect
    overallToggle.append('rect')
        .attr('width', 20).attr('height', 20)
        .attr('rx', 2)
        .attr('fill', showOverall ? '#98a4a8' : '#ffffff')
        .attr('stroke', '#6775de').attr('stroke-width', 1);

    // Checkmark
    overallToggle.append('text')
        .attr('x', 3).attr('y', 18)
        .attr('font-size', '22px')
        .attr('fill', 'white')
        .text(showOverall ? '✓' : '');

    // Label
    overallToggle.append('text')
        .attr('x', 25).attr('y', 13)
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'black').attr('font-size', '18px')
        .text('Overall');

    // == Checkboxes (top right of SVG) ==
    const checkBoxes = dSvg.append('g')
        .attr('transform', `translate(${(width / 2) - 120}, ${height/2 - 2*margin})`);

    continents.forEach((continent, i) => {
        const box = checkBoxes.append('g')
            .attr('transform', `translate(0, ${i * 32})`) // 32px per row
            .style('cursor', 'pointer')
            .on('click', function() {
                // Toggle continent in active set
                if (activeContinents.has(continent)) {
                    activeContinents.delete(continent);

                } else {
                    activeContinents.add(continent);
                }
                // Re-render everything
                recomputeAndRender();
            });

        // Checkbox rect
        box.append('rect')
            .attr('width', 20).attr('height', 20)
            .attr('rx', 2) // Slightly rounded
            .attr('fill', activeContinents.has(continent) ? '#98a4a8' : '#ffffff')
            .attr('stroke', '#6775de').attr('stroke-width', 1);

        // Checkmark when selected
        box.append('text')
            .attr('x', 3).attr('y', 18)
            .attr('font-size', '22px')
            .attr('fill', 'white')
            .text(activeContinents.has(continent) ? '✓' : '');

        // Label
        box.append('text')
            .attr('x', 25).attr('y', 13)
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'black').attr('font-size', '18px')
            .text(continent);
    });

    // == Tooltip ==
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'sg-tooltip')
        .style('display', 'none')

    dSvg.selectAll('.bar-m, .bar-f')
        .on('mouseover', function(event, d) {
            tooltip
                .style('display', 'block')
                .style('text-align', 'center')
                .html(`
                    <strong>${d.discipline}</strong><br>
                    Total: ${d.M + d.F}<br>
                    Male: ${d.M}<br>
                    Female: ${d.F}
                `);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('left', (event.pageX + 12) + 'px')  // 12px right of cursor
                .style('top', (event.pageY - 28) + 'px');   // 28px box starts above cursor
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none');
        });
}

// ==== Render event chart ====
function renderEventChart(discipline) {
    // Clear previous chart
    d3.select('#symmetrical-gender-event').selectAll('*').remove();
    const svg = d3.select('#symmetrical-gender-event');

    // Hide/Show event chart based on whether a discipline is selected
    if (discipline === "No discipline selected") {
        svg.style('display', 'none');
        return; // No discipline selected
    } else {
        svg.style('display', 'flex');
    }

    // Filter events for this discipline + Convert Map to array for D3
    const eventData = Array.from(countsEvents, ([key, values]) => ({
        key,
        event: key.split('/')[1],       // Remove "discipline/" prefix
        M: values.M,
        F: values.F
    }))
    .filter(d => d.key.startsWith(discipline + '/') && d.event.trim() !== '') // Do not want empty events (IMPORTANT!)
    .sort((a, b) => (b.M + b.F) - (a.M + a.F));

    // Compute Overall
    if(showOverall) {
        // Filter by continent AND discipline (not by event)
        const filteredAthletes = athletesRaw.filter(a => {
            // Filter by continent
            const continent = countryToContinent[a.country_code];
            if (!activeContinents.has(continent)) return false;

            // Filter by discipline
            try {
                const parsed = Function('return (' + a.events + ')')();
                return parsed.some(e => e.discipline === discipline);
            } catch { return false; }
        });

        const overallM = filteredAthletes.filter(a => a.gender === 'M').length;
        const overallF = filteredAthletes.filter(a => a.gender === 'F').length;

        eventData.unshift({ key: discipline + '/Overall', event: 'Overall', M: overallM, F: overallF });
    }

    console.log('Event data for discipline', discipline, ':', eventData);

    // == Create SVG (same structure as discipline chart) ==
    const eWidth = 1400;
    const eHeight = eventData.length * 40;
    const eMargin = 40;

    const eSvg = d3.select('#symmetrical-gender-event')
        .append('svg')
        .attr('width', eWidth + eMargin * 2)
        .attr('height', eHeight + eMargin + 80)
        .append('g')
        .attr('transform', `translate(${(eWidth / 2) + eMargin}, ${0})`);

    // == Scales ==
    const eMaxVal = d3.max(eventData, d => Math.max(d.M, d.F));

    const eXScale = d3.scaleLinear()
        .domain([0, eMaxVal])
        .range([0, eWidth / 2]);

    const eYScale = d3.scaleBand()
        .domain(eventData.map(d => d.event))
        .range([0, eHeight])
        .padding(0.2);

    // == Male bars ==
    eSvg.selectAll('.e-bar-m')
        .data(eventData)
        .enter()
        .append('rect')
        .attr('class', 'e-bar-m')
        .attr('x', d => -eXScale(d.M))
        .attr('y', d => eYScale(d.event))
        .attr('width', d => eXScale(d.M))
        .attr('height', eYScale.bandwidth())
        .attr('fill', '#5b91ce');

    // == Female bars ==
    eSvg.selectAll('.e-bar-f')
        .data(eventData)
        .enter()
        .append('rect')
        .attr('class', 'e-bar-f')
        .attr('x', 0)
        .attr('y', d => eYScale(d.event))
        .attr('width', d => eXScale(d.F))
        .attr('height', eYScale.bandwidth())
        .attr('fill', '#c45bbf');

    // == Event labels ==
    eSvg.selectAll('.e-label')
        .data(eventData)
        .enter()
        .append('text')
        .attr('class', 'e-label')
        .attr('x', 0)
        .attr('y', d => eYScale(d.event) + eYScale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'black')
        .attr('font-size', '18px')
        .text(d => {
            const total = d.M + d.F;
            const pctM = Math.round(d.M / total * 100);
            const pctF = Math.round(d.F / total * 100);
            return `${pctM}%    ${d.event}    ${pctF}%`;
        });

    // == Axes ==
    eSvg.append('g')
        .attr('transform', `translate(0, ${eHeight})`)
        .call(d3.axisBottom(eXScale.copy().range([0, -eWidth / 2])));

    eSvg.append('g')
        .attr('transform', `translate(0, ${eHeight})`)
        .call(d3.axisBottom(eXScale));

    eSvg.append('text')
        .attr('x', 0)
        .attr('y', eHeight + eMargin + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .text('Number of Athletes per Event');

    // == Tooltip ==
    const eTooltip = d3.select('body')
        .append('div')
        .attr('class', 'sg-tooltip')
        .style('display', 'none')
    
    // Attach hover events
    eSvg.selectAll('.e-bar-m, .e-bar-f')
        .on('mouseover', function(event, d) {
            eTooltip
                .style('display', 'block')
                .style('text-align', 'center')
                .html(`
                    <strong>${d.event}</strong><br>
                    Total: ${d.M + d.F}<br>
                    Male: ${d.M}<br>
                    Female: ${d.F}
                `);
        })
        .on('mousemove', function(event) {
            eTooltip
                .style('left', (event.pageX + 12) + 'px')  // 12px right of cursor
                .style('top', (event.pageY - 28) + 'px');   // 28px box starts above cursor
        })
        .on('mouseout', function() {
            eTooltip.style('display', 'none');
        });
}
