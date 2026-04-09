fetch('/ExtraRessources/Disciplines/') // Fetch at this URL
    .then(response => response.text()) // Transform the ReadableStream response into HTML text
    .then(html => { // response.text() result
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = [...doc.querySelectorAll('a')]
            .map(a => a.href)
            .filter(href => href.endsWith('.png'));

        const grid = d3.select('#discipline-grid');

        links.forEach(imgURL => {
            const fileName = imgURL.split('/').pop().replace('.png', '');

            const card = grid.append('div')
                .attr('class', 'discipline-card');

            card.append('img')
                .attr('src', `/ExtraRessources/Disciplines/${fileName}.png`)
                .attr('alt', fileName);

            card.append('span')
                .text(fileName.replace(/-/g, ' '));
        });
    });