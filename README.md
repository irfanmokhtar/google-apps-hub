# Google Workspace Hub

A native macOS desktop application that centralizes Google Services (Drive, Sheets, Photos, Keep) into a single, unified interface using Electron.

![App Icon](https://github.com/user-attachments/assets/placeholder-icon.png)

## 🚀 Features

-   **Dashboard Homepage**: Starts with a beautiful, tiled dashboard for quick access to all services.
-   **Smart Navigation**: 
    -   **Click the "G" Logo** to return to the Homepage at any time.
    -   **Unified Sidebar** for quick switching between apps.
    -   **Top Bar Controls**: Dedicated Back and Refresh buttons for easy navigation within services.
-   **State Persistence**: Each service runs in its own isolated view. Switching tabs preserves your work and navigation state.
-   **Native Experience**:
    -   Draggable top bar with macOS traffic light controls.
    -   Dark-themed, polished UI.
    -   Start page points directly to app dashboards (e.g., `/drive/my-drive`) to bypass landing pages.
-   **Security**:
    -   Implements a modern Chrome User Agent spoofing (Chrome 131) to correctly handle Google Sign-In security checks.
    -   Secure IPC bridge integration.
-   **Link Handling**:
    -   External links (non-Google) automatically open in your default OS browser.
    -   In-app login flows are captured correctly within the main window.

## 🛠️ Tech Stack

-   **Runtime**: [Electron](https://www.electronjs.org/) (Node.js + Chromium)
-   **Frontend**: HTML5, CSS3 (Vanilla)
-   **Logic**: JavaScript (Main & Renderer processes)

## 📦 Installation & Usage

### Prerequisites

-   Node.js (v16 or higher recommended)
-   npm

### Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/google-hub.git
    cd google-hub
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the application**
    ```bash
    npm start
    ```

### Building for Production

To create a `.dmg` installer for macOS:

```bash
npm run build
```

The output file will be located in the `dist/` directory.

## 📂 Project Structure

```text
google-hub/
├── main.js             # Main Electron process (Window, View & Navigation management)
├── preload.js          # IPC Bridge (Secure communication context)
├── src/
│   ├── index.html      # Main UI layout (Sidebar + Top Bar)
│   ├── home.html       # Dashboard Homepage
│   ├── style.css       # Application styling
│   └── renderer.js     # Frontend logic (Event listeners & Navigation)
├── package.json        # Dependencies and build configuration
└── .gitignore          # Git ignore rules
```

## 📝 License

This project is licensed under the MIT License - see the `package.json` file for details.

## ⚠️ Note on Google Sign-In

If you encounter a "This browser or app may not be secure" error, this application uses a specific `userAgentFallback` to identify as a standard Chrome browser. This allows the login flow to proceed normally.
