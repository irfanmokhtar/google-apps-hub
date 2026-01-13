// Sidebar renderer logic
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceName = button.dataset.service;

            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

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
