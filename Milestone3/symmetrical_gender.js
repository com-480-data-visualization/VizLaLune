// === Load CSV + Compute Metrics ===
d3.csv('../DataPreprocessing/athletes.csv').then(data => {
    // == Count M/F per discipline ==
    // Map structure: { "Cross-Country Skiing" : { M: 12, F: 15 }, ... }
    const counts = new Map();

    data.forEach(athlete => {
        try {
            // Same parsing logic as intro_bubbles.js
            // e.g. [{discipline: 'Cross-Country Skiing', event: "Men's 10km Interval Start Free"}, {discipline: 'Cross-Country Skiing', event: "Men's 10km + 10km Skiathlon"}]
            const events = Function('return (' + athlete.events + ')')();

            // Disciplines for this athlete (avoid counting twice if multiple events in same discipline)
            const disciplines = [...new Set(events.map(e => e.discipline))];

            disciplines.forEach(discipline => {
                // Create entry if discipline not yet seen
                if (!counts.has(discipline)) {
                    counts.set(discipline, { M: 0, F: 0 });
                }
                // Increment M or F counter
                counts.get(discipline)[athlete.gender]++;
            });

        } catch { return; }
    });

    // == Convert Map to array for D3 ==
    const chartData = Array.from(counts, ([discipline, values]) => ({
        discipline,
        M: values.M,
        F: values.F
    })).sort((a, b) => (b.M + b.F) - (a.M + a.F)); // Sort by total descending

    // == Create SVG ==
    const width = 800;
    const height = 500;
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
        .attr('fill', 'white')
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
    // Create tooltip div (outside SVG, in HTML)
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'sgd-tooltip')
        .style('display', 'none')

    // Attach hover events
    sgdSvg.selectAll('.bar-m, .bar-f')
        .on('mouseover', function(event, d) {
            tooltip
                .style('display', 'block')
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