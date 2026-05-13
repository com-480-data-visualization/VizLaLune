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
    document.getElementById('badge-discipline').textContent = 'No discipline selected';
    document.getElementById('badge-country').textContent = 'No country selected';
}