const bubbleData = [
    { value: 2026, text: 'year',        color: { fill: '#EEEDFE', stroke: '#AFA9EC', text: '#3C3489'} },
    { value: 2900, text: 'athletes',    color: { fill: '#E1F5EE', stroke: '#5DCAA5', text: '#085041'} },
    { value: 16,   text: 'disciplines', color: { fill: '#FAEEDA', stroke: '#EF9F27', text: '#633806'} },
    { value: 116,  text: 'events',      color: { fill: '#E6F1FB', stroke: '#85B7EB', text: '#0C447C'} },
    { value: 15,   text: 'venues',      color: { fill: '#FAECE7', stroke: '#F0997B', text: '#712B13'} },
];

// Select bubbles container
const bubbles = d3.select('#intro-bubbles');

// Generate bubbles
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

