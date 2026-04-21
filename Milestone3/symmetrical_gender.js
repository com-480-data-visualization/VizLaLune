// Global variables to store counts
// Map structure for disciplines: { "Cross-Country Skiing" : { M: 12, F: 15 }, ... }
// Map structure for events: { "Cross-Country Skiing/EventName" : { M: 12, F: 15 }, ... }
const countsDisciplines = new Map();
const countsEvents = new Map();


// ==== Load CSV + Compute Metrics ====
d3.csv('../DataPreprocessing/athletes.csv').then(data => {
    // === Fetch data ===
    data.forEach(athlete => {
        try {
            // Same parsing logic as intro_bubbles.js
            // e.g. [{discipline: 'Cross-Country Skiing', event: "Men's 10km Interval Start Free"}, {discipline: 'Cross-Country Skiing', event: "Men's 10km + 10km Skiathlon"}]
            const participations = Function('return (' + athlete.events + ')')();

            // Disciplines for this athlete (avoid counting twice if multiple events in same discipline)
            const disciplines = [...new Set(participations.map(p => p.discipline))];
            const events = [...new Set(participations.map(p => p.discipline + "/" + p.event))];

            disciplines.forEach(discipline => {
                // Create entry if discipline not yet seen
                if (!countsDisciplines.has(discipline)) {
                    countsDisciplines.set(discipline, { M: 0, F: 0 });
                }
                // Increment M or F counter
                countsDisciplines.get(discipline)[athlete.gender]++;
            });

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

    // === Gender distribution on disciplines ===
    // == Convert Map to array for D3 ==
    const chartData = Array.from(countsDisciplines, ([discipline, values]) => ({
        discipline,
        M: values.M,
        F: values.F
    })).sort((a, b) => (b.M + b.F) - (a.M + a.F)); // Sort by total descending

    // == Create SVG ==
    const width = 800;
    const height = 480;
    const margin = 30; // Space for x-axis labels to show properly

    const sgdSvg = d3.select('#symmetrical-gender-discipline')
        .append('svg')
        .attr('width', width + margin * 2) // Extra space for axes on both sides
        .attr('height', height + margin) // Extra space for x-axis
        .append('g')
        .attr('transform', `translate(${(width / 2) + margin}, ${0})`); // Start bars middle and top

    // == Scales ==
    const maxVal = d3.max(chartData, d => Math.max(d.M, d.F));

    const xScale = d3.scaleLinear()
        .domain([0, maxVal])    
        .range([0, width / 2]); // 0 to half the SVG width

    const yScale = d3.scaleBand()
        .domain(chartData.map(d => d.discipline))
        .range([0, height])
        .padding(0.2);

    console.log('xScale domain:', xScale.domain());
    console.log('yScale domain:', yScale.domain());

    // == Draw Male bars (go LEFT) ==
    sgdSvg.selectAll('.bar-m')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar-m')
        .attr('x', d => -xScale(d.M))           // Negative x = goes left from center
        .attr('y', d => yScale(d.discipline))
        .attr('width', d => xScale(d.M))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#4e9af1');

    // == Draw Female bars (go RIGHT) ==
    sgdSvg.selectAll('.bar-f')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar-f')
        .attr('x', 0)                            // Starts at center
        .attr('y', d => yScale(d.discipline))
        .attr('width', d => xScale(d.F))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#f14ee9');

    // == Discipline labels (center) ==
    sgdSvg.selectAll('.label-discipline')
        .data(chartData)
        .enter()
        .append('text')
        .attr('class', 'label-discipline')
        .attr('x', 0)
        .attr('y', d => yScale(d.discipline) + yScale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'black')
        .attr('font-size', '11px')
        .text(d => d.discipline);

    // == Left axis (Male — values increase going left) ==
    sgdSvg.append('g')
        .attr('transform', `translate(0, ${height})`)   // Place at bottom
        .call(d3.axisBottom(xScale.copy().range([0, -width / 2]))); // Reversed range for left side

    // == Right axis (Female) ==
    sgdSvg.append('g')
        .attr('transform', `translate(0, ${height})`)   // Place at bottom
        .call(d3.axisBottom(xScale));

    // == Tooltip ==
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'sg-tooltip')
        .style('display', 'none')
    
    // Attach hover events
    sgdSvg.selectAll('.bar-m, .bar-f')
        .on('mouseover', function(event, d) {
            tooltip
                .style('display', 'flex')
                .html(`
                    <strong>${d.discipline}</strong><br>
                    Total: ${d.M + d.F}<br>
                    💙 Male: ${d.M}<br>
                    🩷 Female: ${d.F}
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
});

// ==== Gender distribution on events (for selected discipline) ====
function updateEventChart(discipline) {
    // Clear previous chart
    d3.select('#symmetrical-gender-event').selectAll('*').remove();
    const sgeSvg = d3.select('#symmetrical-gender-event');

    // Hide/Show event chart based on whether a discipline is selected
    if (discipline === "No discipline selected") {
        sgeSvg.style('display', 'none');
        return; // No discipline selected
    } else {
        sgeSvg.style('display', 'flex');
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

    console.log('Event data for discipline', discipline, ':', eventData);

    // == Create SVG (same structure as discipline chart) ==
    const eWidth = 800;
    const eHeight = eventData.length * 30;
    const eMargin = 30;

    const eSvg = d3.select('#symmetrical-gender-event')
        .append('svg')
        .attr('width', eWidth + eMargin * 2)
        .attr('height', eHeight + eMargin)
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
        .attr('fill', '#4e9af1');

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
        .attr('fill', '#f14ee9');

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
        .attr('font-size', '11px')
        .text(d => d.event);

    // == Axes ==
    eSvg.append('g')
        .attr('transform', `translate(0, ${eHeight})`)
        .call(d3.axisBottom(eXScale.copy().range([0, -eWidth / 2])));

    eSvg.append('g')
        .attr('transform', `translate(0, ${eHeight})`)
        .call(d3.axisBottom(eXScale));

    // == Tooltip ==
    const eTooltip = d3.select('body')
        .append('div')
        .attr('class', 'sg-tooltip')
        .style('display', 'none')
    
    // Attach hover events
    eSvg.selectAll('.e-bar-m, .e-bar-f')
        .on('mouseover', function(event, d) {
            eTooltip
                .style('display', 'flex')
                .html(`
                    <strong>${d.event}</strong><br>
                    Total: ${d.M + d.F}<br>
                    💙 Male: ${d.M}<br>
                    🩷 Female: ${d.F}
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