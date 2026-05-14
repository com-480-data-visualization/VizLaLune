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
    // Reset filter badge content
    document.getElementById('badge-discipline-input').value = '';
    document.getElementById('badge-country-input').value = '';

    // Reset introduction bubbles
    updateBubbles();

    // Reset grid selection
    selectDisciplineCard();

    // Reset map view
    resetMapView();

    // Reset symmetrical charts
    recomputeAndRender();
}

// Discipline filter selection
function filterDisciplineSuggestions(value) {
    const suggestions = document.getElementById('discipline-suggestions');
    const badge = document.getElementById('badge-discipline-input');

    const countryBadge = document.getElementById('badge-country-input');

    // Get all discipline names from grid cards
    const allDisciplines = [...document.querySelectorAll('.discipline-card text')]
        .map(t => t.textContent);

    // Filter by startsWith (case insensitive)
    const filtered = value.trim() === ''
        ? allDisciplines
        : allDisciplines.filter(d => d.toLowerCase().startsWith(value.toLowerCase()));

    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    // Render suggestions
    suggestions.innerHTML = ''; // Clear previous suggestions
    suggestions.style.display = 'block'; // Make suggestions now visible

    filtered.forEach(discipline => {
        const item = document.createElement('div');
        item.className = 'discipline-suggestion-item';
        item.textContent = discipline;
        item.onclick = () => {
            badge.value = discipline;
            suggestions.style.display = 'none';
            // Trigger discipline selection
            updateBubbles(discipline, countryBadge.value);
            selectDisciplineCard(discipline);
            
            // Convert "Alpine Skiing" to "Alpine-skiing" to match disciplinesList format
            // For zoomToDiscipline and showPodium functions
            const formattedName = discipline.replace(/ /g, '-')
                .toLowerCase()
                .replace(/^\w/, c => c.toUpperCase()); // First letter only to cap

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

    // Get all country names from athletes data
    const allCountriesCodes = [...new Set(athletesDataGlobal.map(a => a.country_code))];
    const allCountries = allCountriesCodes.map(code => countryCodeToName[code]).sort();

    // Filter by startsWith (case insensitive)
    const filtered = value.trim() === ''
        ? allCountries
        : allCountries.filter(c => c.toLowerCase().startsWith(value.toLowerCase()));

    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    // Render suggestions
    suggestions.innerHTML = ''; // Clear previous suggestions
    suggestions.style.display = 'block'; // Make suggestions now visible

    filtered.forEach(country => {
        const item = document.createElement('div');
        item.className = 'country-suggestion-item';
        item.textContent = country;
        item.onclick = () => {
            badge.value = country;
            suggestions.style.display = 'none';
            // Trigger country selection
            updateBubbles(disciplineBadge.value, country);
            recomputeAndRender(country);
            // renderEventChart(country);
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