// Home page tile click handlers
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const service = tile.dataset.service;
        if (window.electronAPI) {
            window.electronAPI.switchService(service);
        }
    });
});
