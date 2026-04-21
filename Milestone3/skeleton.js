function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarButton = document.getElementById('sidebar-button');
    sidebar.classList.toggle('active');
    sidebarButton.textContent = sidebar.classList.contains('active') ? '✕' : '☰';
}