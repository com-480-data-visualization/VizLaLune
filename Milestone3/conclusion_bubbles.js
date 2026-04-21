// === Data ===
// Each bubble has a text and a size
const bubblesData = [
    { text: "Nordic Combined is the only male-only discipline", r: 80, vx: 1.5, vy: 1.0 },
    { text: "Some disciplines have more male-only events than female-only events", r: 95, vx: -1.0, vy: 1.5 },
    { text: "Takeaway 3", r: 120, vx: 1.2, vy: -1.2 },
    { text: "Takeaway 4", r: 110, vx: -1.8, vy: 0.8 },
    { text: "Takeaway 5", r: 90, vx: 1.0, vy: -1.5 },
];

// === Box dimensions ===
const boxWidth = 800;
const boxHeight = 500;

// === Create SVG inside the box ===
const svg = d3.select('#conclusion-bubbles')
    .append('svg')
    .attr('width', boxWidth)
    .attr('height', boxHeight);

// === Give each bubble a starting position ===
bubblesData.forEach((d, i) => {
    d.x = (i + 1) * 140;   // Spread horizontally like before
    d.y = boxHeight / 2;    // All start at mid-height
});

// === Create one group per bubble ===
// A group <g> holds both the circle and the text together
const bubbles = svg.selectAll('g')
    .data(bubblesData)
    .enter()
    .append('g')

// === Append circle to each group ===
bubbles.append('circle')
    .attr('r', d => d.r)
    .attr('fill', '#b40ec0')
    .attr('opacity', 0.8);

// === Append text to each group ===
bubbles.append('text')
    .attr('text-anchor', 'middle')   // Centre text of x-axis
    .attr('dominant-baseline', 'middle') // Centre text of y-axis
    .attr('fill', 'white')
    .style('pointer-events', 'none') // Text to not interfere with mouse events on circles
    .each(function(d) {
        const text = d3.select(this);
        const words = d.text.split(' ');
        const lineHeight = 14; // px per line
        const maxCharsPerLine = Math.floor(d.r * 1.6 / 7); // Approximate chars that fit per line (given by Anthropic Sonnet 4.6)

        // Group words into lines
        const lines = [];
        let currentLine = '';
        words.forEach(word => {
            if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
                currentLine = (currentLine + ' ' + word).trim();
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });
        if (currentLine) lines.push(currentLine);

        // Center lines vertically around 0
        const totalHeight = (lines.length - 1) * lineHeight;
        lines.forEach((line, i) => {
            text.append('tspan')
                .attr('x', 0)
                .attr('dy', i === 0 ? -totalHeight / 2 : lineHeight) // First line offset, rest increment
                .attr('font-size', '11px')
                .text(line);
        });
    });

// === Hover ===
bubbles
    .on('mouseover', function(event, d) {
        d.hovered = true;

        // Bring to front using D3's raise()
        d3.select(this).raise();

        // Grow
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', d.r * 1.3);
    })
    .on('mouseout', function(event, d) {
        // Shrink back, then resume movement
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', d.r)
            .on('end', () => { d.hovered = false; });
    });

// === Animation loop ===
d3.timer(() => {
    bubblesData.forEach(d => {
        if (d.hovered) return; // Freeze position while hovered

        d.x += d.vx;
        d.y += d.vy;

        if (d.x - d.r < 0 || d.x + d.r > boxWidth) d.vx *= -1;
        if (d.y - d.r < 0 || d.y + d.r > boxHeight) d.vy *= -1;
    });

    // Only update transform for non-hovered bubbles
    svg.selectAll('g')
        .filter(d => !d.hovered)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
});