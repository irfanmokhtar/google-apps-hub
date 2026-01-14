// Sidebar renderer logic
document.addEventListener('DOMContentLoaded', () => {
    // Select both standard nav buttons and the logo (nav-item)
    const navItems = document.querySelectorAll('.nav-btn, .nav-item');

    // Set Home (logo) as active by default if not set
    if (!document.querySelector('.active')) {
        const homeBtn = document.querySelector('[data-service="home"]');
        if (homeBtn) homeBtn.classList.add('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceName = item.dataset.service;

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Send message to main process to switch views
            window.electronAPI.switchService(serviceName);
        });
    });

    // Navigation controls
    const backBtn = document.getElementById('btn-back');
    const refreshBtn = document.getElementById('btn-refresh');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.electronAPI.goBack();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.electronAPI.reload();
        });
    }
});
