const { app, BrowserWindow, BrowserView, ipcMain, shell } = require('electron');
const path = require('path');

// Use a modern, standard Chrome User Agent to avoid "browser not secure" errors
// Updated to Chrome 131 to ensure Google sees it as a modern browser
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// Set the User Agent globally for the app - CRITICAL for Google Sign-In
app.userAgentFallback = USER_AGENT;

// Google service URLs - pointed to app roots
const SERVICES = {
    home: 'file://' + path.join(__dirname, 'src', 'home.html'),
    drive: 'https://drive.google.com/drive/my-drive',
    sheets: 'https://docs.google.com/spreadsheets/u/0/?tgif=d',
    photos: 'https://photos.google.com/u/0/',
    keep: 'https://keep.google.com/u/0/'
};

// Layout constants
const SIDEBAR_WIDTH = 70;
const TOP_BAR_HEIGHT = 40; // Height of the draggable top area

let mainWindow;
let views = {};
let activeService = 'home'; // Default to home

function createWindow() {
    // Create the main browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 15, y: 15 },
        backgroundColor: '#1a1a2e',
        // Increase sensitivity of window dragging if needed, but the HTML drag region handles it
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Load the sidebar HTML
    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

    // Create BrowserViews for each Google service
    Object.keys(SERVICES).forEach(serviceName => {
        const view = new BrowserView({
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'), // Needed for home page IPC
                contextIsolation: true,
                nodeIntegration: false,
                // Using a persistent partition for session storage
                partition: 'persist:google_workspace'
            }
        });

        // Set the User Agent explicitly for this view as well
        view.webContents.setUserAgent(USER_AGENT);

        // Load the service URL
        view.webContents.loadURL(SERVICES[serviceName]);

        // Handle external links and new window requests
        view.webContents.setWindowOpenHandler(({ url }) => {
            // If it's the home page sending a local file request, allow it
            if (url.startsWith('file://')) return { action: 'allow' };

            // If it's an external link (non-Google), open in default browser
            if (!url.includes('google.com') && !url.includes('googleapis.com') && !url.includes('gstatic.com')) {
                shell.openExternal(url);
                return { action: 'deny' };
            }

            // If it's a Google link trying to open a new window, load in current view
            view.webContents.loadURL(url);
            return { action: 'deny' };
        });

        // Also handle navigation to external sites from within the page
        view.webContents.on('will-navigate', (event, url) => {
            // Allow file:// navigation (for home page loading)
            if (url.startsWith('file://')) return;

            if (!url.includes('google.com') && !url.includes('googleapis.com') && !url.includes('gstatic.com')) {
                event.preventDefault();
                shell.openExternal(url);
            }
        });

        views[serviceName] = view;
    });

    // Show the default service (Drive)
    switchService(activeService);

    // Handle window resize
    mainWindow.on('resize', () => {
        resizeActiveView();
    });

    // Handle maximize/unmaximize
    mainWindow.on('maximize', () => {
        setTimeout(resizeActiveView, 100);
    });

    mainWindow.on('unmaximize', () => {
        setTimeout(resizeActiveView, 100);
    });
}

function resizeActiveView() {
    const view = views[activeService];
    if (view && mainWindow) {
        const bounds = mainWindow.getBounds();
        // Offset y by TOP_BAR_HEIGHT and reduce height by TOP_BAR_HEIGHT
        view.setBounds({
            x: SIDEBAR_WIDTH,
            y: TOP_BAR_HEIGHT,
            width: bounds.width - SIDEBAR_WIDTH,
            height: bounds.height - TOP_BAR_HEIGHT
        });
    }
}

function switchService(serviceName) {
    if (!views[serviceName]) return;

    // Remove current view
    if (views[activeService]) {
        mainWindow.removeBrowserView(views[activeService]);
    }

    // Set and show new view
    activeService = serviceName;
    mainWindow.addBrowserView(views[serviceName]);
    resizeActiveView();
}

// IPC handler for switching services
ipcMain.on('switch-service', (event, serviceName) => {
    switchService(serviceName);
});

// IPC handlers for navigation
ipcMain.on('go-back', () => {
    const view = views[activeService];
    if (view && view.webContents.canGoBack()) {
        view.webContents.goBack();
    }
});

ipcMain.on('reload', () => {
    const view = views[activeService];
    if (view) {
        view.webContents.reload();
    }
});

// App lifecycle
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
