// Hide/Show sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarButton = document.getElementById('sidebar-button');
    sidebar.classList.toggle('active');
    sidebarButton.textContent = sidebar.classList.contains('active') ? '✕' : '☰';
}

// Hide/Show filter badge
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.getElementById('filters-badge').style.display = 'none';
        } else {
            document.getElementById('filters-badge').style.display = 'flex';
        }
    });
}, { threshold: 0.1 }); 

observer.observe(document.getElementById('banner'));

// Reset filters
function resetFilters() {
    document.getElementById('badge-discipline-input').value = '';
    document.getElementById('badge-country-input').value = '';
    updateBubbles();
    selectDisciplineCard();
    resetMapView();
    recomputeAndRender();

    if (window.athletesData) {
        updateBarChart(window.athletesData, null);
        highlightDiscipline(null);
    }
    if (window.filterMapByDiscipline) filterMapByDiscipline(null);
    if (window.highlightCountryOnMap) highlightCountryOnMap(null);
}

// Discipline filter selection
function filterDisciplineSuggestions(value) {
    const suggestions = document.getElementById('discipline-suggestions');
    const badge = document.getElementById('badge-discipline-input');
    const countryBadge = document.getElementById('badge-country-input');

    const allDisciplines = [...document.querySelectorAll('.discipline-card text')]
        .map(t => t.textContent);

    const filtered = value.trim() === ''
        ? allDisciplines
        : allDisciplines.filter(d => d.toLowerCase().startsWith(value.toLowerCase()));

    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    suggestions.innerHTML = '';
    suggestions.style.display = 'block';

    filtered.forEach(discipline => {
        const item = document.createElement('div');
        item.className = 'discipline-suggestion-item';
        item.textContent = discipline;
        item.onclick = () => {
            badge.value = discipline;
            suggestions.style.display = 'none';
            updateBubbles(discipline, countryBadge.value);
            selectDisciplineCard(discipline);
        
            if (window.athletesData) highlightDiscipline(discipline);
            if (window.filterMapByDiscipline) filterMapByDiscipline(discipline); // ← ajoute cette ligne
        
            let formattedName = discipline.replace(/ /g, '-')
                .toLowerCase()
                .replace(/^\w/, c => c.toUpperCase());
        
            zoomToDiscipline(formattedName);
            showPodium(discipline, `https://www.olympics.com/en/sports/${formattedName.toLowerCase()}`, `/ExtraRessources/Disciplines/${formattedName}.png`);
            renderEventChart(discipline);
        };
        suggestions.appendChild(item);
    });
}

// Country filter selection
function filterCountrySuggestions(value) {
    const suggestions = document.getElementById('country-suggestions');
    const badge = document.getElementById('badge-country-input');
    const disciplineBadge = document.getElementById('badge-discipline-input');

    const allCountriesCodes = [...new Set(athletesDataGlobal.map(a => a.country_code))];
    const allCountries = allCountriesCodes.map(code => countryCodeToName[code]).sort();

    const filtered = value.trim() === ''
        ? allCountries
        : allCountries.filter(c => c.toLowerCase().startsWith(value.toLowerCase()));

    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    suggestions.innerHTML = '';
    suggestions.style.display = 'block';

    filtered.forEach(country => {
        const item = document.createElement('div');
        item.className = 'country-suggestion-item';
        item.textContent = country;
        item.onclick = () => {
            badge.value = country;
            suggestions.style.display = 'none';
            updateBubbles(disciplineBadge.value, country);
            recomputeAndRender(country);
            // Update bar chart
            if (window.athletesData) {
                const code = Object.keys(countryNames).find(k => countryNames[k] === country);
                updateBarChart(window.athletesData, code || null);
    }

    // Highlight sur la map
    if (window.highlightCountryOnMap) highlightCountryOnMap(country);
};
        suggestions.appendChild(item);
    });
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#badge-discipline-wrapper')) {
        document.getElementById('discipline-suggestions').style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#badge-country-wrapper')) {
        document.getElementById('country-suggestions').style.display = 'none';
    }
});

// Reset map et barchart quand le champ country est vidé
document.getElementById('badge-country-input').addEventListener('input', function() {
    if (this.value.trim() === '') {
        if (window.athletesData) updateBarChart(window.athletesData, null);
        if (window.highlightCountryOnMap) highlightCountryOnMap(null);
    }
});

// Reset barchart highlight quand le champ discipline est vidé
document.getElementById('badge-discipline-input').addEventListener('input', function() {
    if (this.value.trim() === '') {
        highlightDiscipline(null);
        if (window.filterMapByDiscipline) filterMapByDiscipline(null);
    }
});